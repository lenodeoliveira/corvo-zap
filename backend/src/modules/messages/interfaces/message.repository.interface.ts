import { MessageEntity } from '../entities/message.entity';

interface IMessageRepository {
  create(message: MessageEntity): Promise<void>;
  findById(id: string): Promise<MessageEntity | null>;
  findByChatId(chatId: string): Promise<MessageEntity[]>;
}

export default IMessageRepository;
