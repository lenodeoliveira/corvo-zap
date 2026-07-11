import { MessageEntity } from '../entities/message.entity';

interface IMessageRepository {
  create(message: MessageEntity): Promise<void>;
  findByChatId(chatId: string): Promise<MessageEntity[]>;
}

export default IMessageRepository;
