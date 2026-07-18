import { Inject, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import type IMessageRepository from '../../../domain/repositories/interface-messages/message.repository.interface';
import { MessageStatus } from '../../../domain/entities/message.entity';
import { MESSAGE_REPOSITORY } from '../../../domain/tokens/message.repository.token';
import { DOMAIN_EVENTS, MessageDeliveredEvent } from '@/modules/events';

@Injectable()
export class MarkMessageAsDeliveredService {
  private readonly logger = new Logger(MarkMessageAsDeliveredService.name);

  constructor(
    @Inject(MESSAGE_REPOSITORY)
    private readonly messageRepository: IMessageRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(messageId: string): Promise<boolean> {
    const message = await this.messageRepository.findById(messageId);

    if (!message) {
      this.logger.warn('Message not found for delivery', { messageId });
      return false;
    }

    if (message.getStatus() !== MessageStatus.TRAVELING) {
      return false;
    }

    message.markAsDelivered();
    await this.messageRepository.update(message);

    this.eventEmitter.emit(
      DOMAIN_EVENTS.MESSAGE_DELIVERED,
      new MessageDeliveredEvent(messageId),
    );

    return true;
  }
}
