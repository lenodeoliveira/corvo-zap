import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import type IMessageRepository from '../../interfaces/message.repository.interface';
import type IChatRepository from '@/modules/chat/interfaces/chat.repository.interface';
import type IUserRepository from '@/modules/users/interfaces/user.repository.interface';
import { MessageEntity } from '../../entities/message.entity';
import { MESSAGE_REPOSITORY } from '../../infra/tokens/message.token.repository';
import { CHAT_REPOSITORY } from '@/modules/chat/infra/tokens/chat.token.repository';
import { USER_REPOSITORY } from '@/modules/users/infra/tokens/user.token.repository';

interface CreateMessageProps {
  chatId: string;
  senderId: string;
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
  ) {}

  async execute(input: CreateMessageProps): Promise<Record<string, unknown>> {
    const chat = await this.chatRepository.findById(input.chatId);

    if (!chat) {
      this.logger.error('Chat not found', { chatId: input.chatId });
      throw new NotFoundException('Chat not found');
    }

    const sender = await this.userRepository.findById(input.senderId);

    if (!sender) {
      this.logger.error('Sender not found', { senderId: input.senderId });
      throw new NotFoundException('Sender not found');
    }

    const isParticipant =
      chat.getUserOneId() === input.senderId ||
      chat.getUserTwoId() === input.senderId;

    if (!isParticipant) {
      this.logger.error('Sender is not a participant of this chat', {
        chatId: input.chatId,
        senderId: input.senderId,
      });
      throw new BadRequestException('Sender is not a participant of this chat');
    }

    const message = MessageEntity.create({
      chatId: input.chatId,
      senderId: input.senderId,
      content: input.content,
    });

    await this.messageRepository.create(message);

    return message.toJSON();
  }
}
