import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import type IMessageRepository from '../../interfaces/message.repository.interface';
import type IChatRepository from '@/modules/chat/interfaces/chat.repository.interface';
import type IUserRepository from '@/modules/users/interfaces/user.repository.interface';
import type ICityRepository from '@/modules/cities/interfaces/city.repository.interface';
import { MessageEntity } from '../../entities/message.entity';
import { MESSAGE_REPOSITORY } from '../../infra/tokens/message.token.repository';
import { CHAT_REPOSITORY } from '@/modules/chat/infra/tokens/chat.token.repository';
import { USER_REPOSITORY } from '@/modules/users/infra/tokens/user.token.repository';
import { CITY_REPOSITORY } from '@/modules/cities/infra/tokens/city.token.repository';
import { DeliveryService } from '@/modules/delivery/services/delivery.service';
import { DistanceService } from '@/modules/delivery/services/distance.service';
import { CryptoMessageService } from '@/modules/crypto/crypto.message.service';
import { MessageViewService, type MessageView } from '../message-view/message.view.service';

interface CreateMessageProps {
  chatId: string;
  content: string;
}

@Injectable()
export class CreateMessageService {
  private readonly logger = new Logger(CreateMessageService.name);

  constructor(
    @Inject(MESSAGE_REPOSITORY)
    private readonly messageRepository: IMessageRepository,
    @Inject(CHAT_REPOSITORY)
    private readonly chatRepository: IChatRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(CITY_REPOSITORY)
    private readonly cityRepository: ICityRepository,
    private readonly deliveryService: DeliveryService,
    private readonly distanceService: DistanceService,
    private readonly cryptoMessageService: CryptoMessageService,
    private readonly messageViewService: MessageViewService,
  ) {}

  async execute(
    input: CreateMessageProps,
    authenticatedUserId: string,
  ): Promise<MessageView> {
    const chat = await this.chatRepository.findById(input.chatId);

    if (!chat) {
      this.logger.error('Chat not found', { chatId: input.chatId });
      throw new NotFoundException('Chat not found');
    }

    const sender = await this.userRepository.findById(authenticatedUserId);

    if (!sender) {
      this.logger.error('Sender not found', { senderId: authenticatedUserId });
      throw new NotFoundException('Sender not found');
    }

    const isParticipant =
      chat.getUserOneId() === authenticatedUserId ||
      chat.getUserTwoId() === authenticatedUserId;

    if (!isParticipant) {
      this.logger.error('Authenticated user is not a participant of this chat', {
        chatId: input.chatId,
        authenticatedUserId,
      });
      throw new ForbiddenException('You can only send messages in chats you participate in');
    }

    const recipientId = chat.getRecipientId(authenticatedUserId);

    const recipient = await this.userRepository.findById(recipientId);

    if (!recipient) {
      this.logger.error('Recipient not found', { recipientId });
      throw new NotFoundException('Recipient not found');
    }

    const originCityId = sender.getCityId();
    const destinationCityId = recipient.getCityId();

    if (!originCityId || !destinationCityId) {
      throw new BadRequestException('Sender and recipient must have a city assigned');
    }

    const originCity = await this.cityRepository.findById(originCityId);
    const destinationCity = await this.cityRepository.findById(destinationCityId);

    if (!originCity || !destinationCity) {
      throw new NotFoundException('Origin or destination city not found');
    }

    const { distanceKm, travelTimeMinutes } = this.distanceService.calculate(
      originCity.getCoordinate(),
      destinationCity.getCoordinate(),
    );

    const delivery = this.deliveryService.scheduleDelivery(travelTimeMinutes);
    const encryptedContent = this.cryptoMessageService.encrypt(input.content);

    const message = MessageEntity.send({
      chatId: input.chatId,
      senderId: authenticatedUserId,
      encryptedContent,
      arrivalAt: delivery.arrivalAt,
      distanceKm,
      departureAt: delivery.departureAt,
      originCityId,
      destinationCityId,
      travelTimeMinutes,
    });

    await this.messageRepository.create(message);

    return this.messageViewService.toView(
      message,
      authenticatedUserId,
      sender.getName(),
    );
  }
}
