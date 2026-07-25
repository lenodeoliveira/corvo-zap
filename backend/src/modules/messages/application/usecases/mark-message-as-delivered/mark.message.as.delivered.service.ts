import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import type IMessageRepository from '../../../domain/repositories/interface-messages/message.repository.interface';
import { MessageStatus } from '../../../domain/entities/message.entity';
import { MESSAGE_REPOSITORY } from '../../../domain/tokens/message.repository.token';
import { DOMAIN_EVENTS, MessageDeliveredEvent } from '@/modules/events';
import { USER_REPOSITORY } from '@/modules/users/domain/tokens/user.repository.token';
import type IUserRepository from '@/modules/users/domain/repositories/interface-users/user.repository.interface';

@Injectable()
export class MarkMessageAsDeliveredService {
  private readonly logger = new Logger(MarkMessageAsDeliveredService.name);

  constructor(
    @Inject(MESSAGE_REPOSITORY)
    private readonly messageRepository: IMessageRepository,
    private readonly eventEmitter: EventEmitter2,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @InjectDataSource()
    private readonly dataSource: DataSource,
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

    const sender = await this.userRepository.findById(message.getSenderId());
    if (!sender) {
      this.logger.error('Sender not found for delivery', { messageId });
      throw new NotFoundException('Sender not found');
    }

    const delivered = await this.dataSource.transaction(async (manager) => {
      const messageDelivered =
        await this.messageRepository.markAsDeliveredIfTraveling(
          messageId,
          manager,
        );

      if (!messageDelivered) {
        return false;
      }

      await this.userRepository.restoreCrow(sender.getId(), manager);
      return true;
    });

    if (!delivered) {
      return false;
    }

    this.eventEmitter.emit(
      DOMAIN_EVENTS.MESSAGE_DELIVERED,
      new MessageDeliveredEvent(messageId),
    );

    return true;
  }
}
