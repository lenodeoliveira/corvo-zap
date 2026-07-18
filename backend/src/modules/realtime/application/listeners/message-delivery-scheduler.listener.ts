import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DOMAIN_EVENTS, MessageCreatedEvent } from '@/modules/events';
import { DeliverySchedulerService } from '../services/delivery-scheduler.service';

@Injectable()
export class MessageDeliverySchedulerListener {
  private readonly logger = new Logger(MessageDeliverySchedulerListener.name);

  constructor(private readonly deliverySchedulerService: DeliverySchedulerService) {}

  @OnEvent(DOMAIN_EVENTS.MESSAGE_CREATED)
  handleMessageCreated(event: MessageCreatedEvent): void {
    try {
      this.deliverySchedulerService.schedule(event.message);
    } catch (error) {
      this.logger.error('Failed to schedule message delivery', {
        messageId: event.message.getId(),
        error: error instanceof Error ? error.message : 'unknown',
      });
    }
  }
}
