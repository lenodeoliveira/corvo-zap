import {
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import type IMessageRepository from '../../../domain/repositories/interface-messages/message.repository.interface';
import type IChatRepository from '@/modules/chat/domain/repositories/interface-chat/chat.repository.interface';
import type IUserRepository from '@/modules/users/domain/repositories/interface-users/user.repository.interface';
import { MESSAGE_REPOSITORY } from '../../../infra/database/typeorm/tokens/message.token.repository';
import { CHAT_REPOSITORY } from '@/modules/chat/infra/database/typeorm/tokens/chat.token.repository';
import { USER_REPOSITORY } from '@/modules/users/infra/database/typeorm/tokens/user.token.repository';
import { MessageViewService, type MessageView } from '../message-view/message.view.service';
import { buildSenderNamesByUserId } from '../message-view/build-sender-names';

@Injectable()
export class GetMessageService {
  private readonly logger = new Logger(GetMessageService.name);

  constructor(
    @Inject(MESSAGE_REPOSITORY)
    private readonly messageRepository: IMessageRepository,
    @Inject(CHAT_REPOSITORY)
    private readonly chatRepository: IChatRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly messageViewService: MessageViewService,
  ) {}

  async execute(
    messageId: string,
    authenticatedUserId: string,
  ): Promise<MessageView> {
    const message = await this.messageRepository.findById(messageId);

    if (!message) {
      this.logger.error('Message not found', { messageId });
      throw new NotFoundException('Message not found');
    }

    const chat = await this.chatRepository.findById(message.getChatId());

    if (!chat) {
      this.logger.error('Chat not found', { chatId: message.getChatId() });
      throw new NotFoundException('Chat not found');
    }

    const isParticipant =
      chat.getUserOneId() === authenticatedUserId ||
      chat.getUserTwoId() === authenticatedUserId;

    if (!isParticipant) {
      this.logger.error('Authenticated user is not a participant of this chat', {
        messageId,
        chatId: message.getChatId(),
        authenticatedUserId,
      });
      throw new ForbiddenException('You can only read messages from chats you participate in');
    }

    const senderNames = await buildSenderNamesByUserId(this.userRepository, [
      chat.getUserOneId(),
      chat.getUserTwoId(),
    ]);

    return this.messageViewService.toView(
      message,
      authenticatedUserId,
      senderNames[message.getSenderId()] ?? '',
    );
  }
}
