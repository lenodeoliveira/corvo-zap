import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import type { MessageEntity } from '@/modules/messages/domain/entities/message.entity';
import type IMessageRepository from '@/modules/messages/domain/repositories/interface-messages/message.repository.interface';
import { Inject } from '@nestjs/common';
import { MESSAGE_REPOSITORY } from '@/modules/messages/domain/tokens/message.repository.token';
import { MarkMessageAsDeliveredService } from '@/modules/messages/application/usecases/mark-message-as-delivered/mark.message.as.delivered.service';

@Injectable()
export class DeliverySchedulerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DeliverySchedulerService.name);
  private readonly timeouts = new Map<string, NodeJS.Timeout>();

  constructor(
    @Inject(MESSAGE_REPOSITORY)
    private readonly messageRepository: IMessageRepository,
    private readonly markMessageAsDeliveredService: MarkMessageAsDeliveredService,
  ) {}

  async onModuleInit(): Promise<void> {
    const pendingMessages = await this.messageRepository.findPendingDelivery();

    for (const message of pendingMessages) {
      this.schedule(message);
    }

    this.logger.log(`Scheduled ${pendingMessages.length} pending deliveries`);
  }

  onModuleDestroy(): void {
    for (const timeout of this.timeouts.values()) {
      clearTimeout(timeout);
    }

    this.timeouts.clear();
  }

  schedule(message: MessageEntity): void {
    this.clearSchedule(message.getId());

    const delayMs = message.getArrivalAt().getTime() - Date.now();

    if (delayMs <= 0) {
      void this.deliver(message.getId());
      return;
    }

    const timeout = setTimeout(() => {
      this.timeouts.delete(message.getId());
      void this.deliver(message.getId());
    }, delayMs);

    this.timeouts.set(message.getId(), timeout);
  }

  private clearSchedule(messageId: string): void {
    const existingTimeout = this.timeouts.get(messageId);

    if (existingTimeout) {
      clearTimeout(existingTimeout);
      this.timeouts.delete(messageId);
    }
  }

  private async deliver(messageId: string): Promise<void> {
    try {
      await this.markMessageAsDeliveredService.execute(messageId);
    } catch (error) {
      this.logger.error('Failed to deliver message', {
        messageId,
        error: error instanceof Error ? error.message : 'unknown',
      });
    }
  }
}
