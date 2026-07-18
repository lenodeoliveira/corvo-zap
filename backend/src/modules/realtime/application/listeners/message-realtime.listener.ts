import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  DOMAIN_EVENTS,
  MessageCreatedEvent,
  MessageDeliveredEvent,
  MessageReadEvent,
} from '@/modules/events';
import { MessageRealtimeService } from '../services/message-realtime.service';

@Injectable()
export class MessageRealtimeListener {
  private readonly logger = new Logger(MessageRealtimeListener.name);

  constructor(private readonly messageRealtimeService: MessageRealtimeService) {}

  @OnEvent(DOMAIN_EVENTS.MESSAGE_CREATED)
  async handleMessageCreated(event: MessageCreatedEvent): Promise<void> {
    try {
      await this.messageRealtimeService.notifyMessageCreated(
        event.message,
        event.chat,
        event.senderName,
      );
    } catch (error) {
      this.logger.error('Failed to notify message creation', {
        messageId: event.message.getId(),
        error: error instanceof Error ? error.message : 'unknown',
      });
    }
  }

  @OnEvent(DOMAIN_EVENTS.MESSAGE_DELIVERED)
  async handleMessageDelivered(event: MessageDeliveredEvent): Promise<void> {
    try {
      await this.messageRealtimeService.notifyMessageDelivered(event.messageId);
    } catch (error) {
      this.logger.error('Failed to notify message delivery', {
        messageId: event.messageId,
        error: error instanceof Error ? error.message : 'unknown',
      });
    }
  }

  @OnEvent(DOMAIN_EVENTS.MESSAGE_READ)
  async handleMessageRead(event: MessageReadEvent): Promise<void> {
    try {
      await this.messageRealtimeService.notifyMessageRead(event.messageId);
    } catch (error) {
      this.logger.error('Failed to notify message read', {
        messageId: event.messageId,
        error: error instanceof Error ? error.message : 'unknown',
      });
    }
  }
}
