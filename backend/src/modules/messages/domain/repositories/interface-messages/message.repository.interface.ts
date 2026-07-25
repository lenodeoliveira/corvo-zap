import { MessageEntity } from '../../entities/message.entity';
import type { EntityManager } from 'typeorm';

interface IMessageRepository {
  create(message: MessageEntity, manager?: EntityManager): Promise<void>;
  update(message: MessageEntity): Promise<void>;
  markAsDeliveredIfTraveling(
    messageId: string,
    manager?: EntityManager,
  ): Promise<boolean>;
  findById(id: string): Promise<MessageEntity | null>;
  findByChatId(chatId: string): Promise<MessageEntity[]>;
  findPendingDelivery(): Promise<MessageEntity[]>;
}

export default IMessageRepository;
