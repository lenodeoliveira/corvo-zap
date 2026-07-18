import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import type IMessageRepository from '../../../domain/repositories/interface-messages/message.repository.interface';
import type IUserRepository from '@/modules/users/domain/repositories/interface-users/user.repository.interface';
import {
  MessageStatus,
} from '../../../domain/entities/message.entity';
import { MESSAGE_REPOSITORY } from '../../../domain/tokens/message.repository.token';
import { USER_REPOSITORY } from '@/modules/users/domain/tokens/user.repository.token';
import {
  MessageViewService,
  type MessageView,
} from '../message-view/message.view.service';
import { ChatParticipantService } from '@/modules/chat/application/services/chat-participant.service';
import { DOMAIN_EVENTS, MessageReadEvent } from '@/modules/events';

@Injectable()
export class MarkMessageAsReadService {
  private readonly logger = new Logger(MarkMessageAsReadService.name);

  constructor(
    @Inject(MESSAGE_REPOSITORY)
    private readonly messageRepository: IMessageRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly chatParticipantService: ChatParticipantService,
    private readonly messageViewService: MessageViewService,
    private readonly eventEmitter: EventEmitter2,
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

    const chat = await this.chatParticipantService.requireById(
      message.getChatId(),
      authenticatedUserId,
      {
        forbiddenMessage:
          'You can only mark messages as read in chats you participate in',
        logContext: { messageId },
      },
    );

    const recipientId = chat.getRecipientId(message.getSenderId());

    if (authenticatedUserId !== recipientId) {
      throw new ForbiddenException('Only the recipient can mark a message as read');
    }

    if (message.getStatus() === MessageStatus.TRAVELING) {
      throw new BadRequestException('Message has not been delivered yet');
    }

    const wasAlreadyRead = message.getStatus() === MessageStatus.READ;

    message.markAsRead(authenticatedUserId);

    if (!wasAlreadyRead) {
      await this.messageRepository.update(message);

      this.eventEmitter.emit(
        DOMAIN_EVENTS.MESSAGE_READ,
        new MessageReadEvent(messageId),
      );
    }

    const sender = await this.userRepository.findById(message.getSenderId());
    const senderName = sender?.getName() ?? '';

    return this.messageViewService.toView(
      message,
      authenticatedUserId,
      senderName,
    );
  }
}
