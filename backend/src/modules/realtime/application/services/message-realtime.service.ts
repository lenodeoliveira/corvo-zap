import { Inject, Injectable, Logger } from '@nestjs/common';
import type { ChatEntity } from '@/modules/chat/domain/entities/chat.entity';
import type { MessageEntity } from '@/modules/messages/domain/entities/message.entity';
import type IUserRepository from '@/modules/users/domain/repositories/interface-users/user.repository.interface';
import type IChatRepository from '@/modules/chat/domain/repositories/interface-chat/chat.repository.interface';
import { USER_REPOSITORY } from '@/modules/users/domain/tokens/user.repository.token';
import { CHAT_REPOSITORY } from '@/modules/chat/domain/tokens/chat.repository.token';
import {
  MessageViewService,
  type MessageView,
} from '@/modules/messages/application/usecases/message-view/message.view.service';
import { buildSenderNamesByUserId } from '@/modules/messaging-query/application/shared/build-sender-names';
import type IMessageRepository from '@/modules/messages/domain/repositories/interface-messages/message.repository.interface';
import { MESSAGE_REPOSITORY } from '@/modules/messages/domain/tokens/message.repository.token';
import { ChatGateway } from '../../infra/gateways/chat.gateway';
import {
  REALTIME_EVENTS,
  type RealtimeEventPayload,
} from '../../constants/realtime.events';

@Injectable()
export class MessageRealtimeService {
  private readonly logger = new Logger(MessageRealtimeService.name);

  constructor(
    private readonly chatGateway: ChatGateway,
    @Inject(MESSAGE_REPOSITORY)
    private readonly messageRepository: IMessageRepository,
    @Inject(CHAT_REPOSITORY)
    private readonly chatRepository: IChatRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly messageViewService: MessageViewService,
  ) {}

  async notifyMessageCreated(
    message: MessageEntity,
    chat: ChatEntity,
    senderName: string,
  ): Promise<void> {
    await this.emitMessageToParticipants(
      REALTIME_EVENTS.MESSAGE_CREATED,
      message,
      chat,
      senderName,
    );
  }

  async notifyMessageDelivered(messageId: string): Promise<void> {
    const message = await this.messageRepository.findById(messageId);

    if (!message) {
      this.logger.warn('Message not found for delivery notification', {
        messageId,
      });
      return;
    }

    const chat = await this.chatRepository.findById(message.getChatId());

    if (!chat) {
      this.logger.warn('Chat not found for delivery notification', {
        messageId,
        chatId: message.getChatId(),
      });
      return;
    }

    const senderNames = await buildSenderNamesByUserId(this.userRepository, [
      message.getSenderId(),
    ]);

    await this.emitMessageToParticipants(
      REALTIME_EVENTS.MESSAGE_DELIVERED,
      message,
      chat,
      senderNames[message.getSenderId()] ?? '',
    );
  }

  async notifyMessageRead(messageId: string): Promise<void> {
    const message = await this.messageRepository.findById(messageId);

    if (!message) {
      this.logger.warn('Message not found for read notification', {
        messageId,
      });
      return;
    }

    const chat = await this.chatRepository.findById(message.getChatId());

    if (!chat) {
      this.logger.warn('Chat not found for read notification', {
        messageId,
        chatId: message.getChatId(),
      });
      return;
    }

    const senderNames = await buildSenderNamesByUserId(this.userRepository, [
      message.getSenderId(),
    ]);

    await this.emitMessageToParticipants(
      REALTIME_EVENTS.MESSAGE_READ,
      message,
      chat,
      senderNames[message.getSenderId()] ?? '',
    );
  }

  private async emitMessageToParticipants(
    event: string,
    message: MessageEntity,
    chat: ChatEntity,
    senderName: string,
  ): Promise<void> {
    const participantIds = [chat.getUserOneId(), chat.getUserTwoId()];

    for (const participantId of participantIds) {
      const view = this.messageViewService.toView(
        message,
        participantId,
        senderName,
      );

      this.chatGateway.emitToUser(
        participantId,
        event,
        this.buildPayload(message.getChatId(), view),
      );
    }
  }

  private buildPayload(
    chatId: string,
    message: MessageView,
  ): RealtimeEventPayload {
    return {
      chatId,
      message: message as unknown as Record<string, unknown>,
    };
  }
}
