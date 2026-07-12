import { ChatEntity } from '../../entities/chat.entity';

interface IChatRepository {
  create(chat: ChatEntity): Promise<void>;
  findById(id: string): Promise<ChatEntity | null>;
  findByParticipants(
    userOneId: string,
    userTwoId: string,
  ): Promise<ChatEntity | null>;
  findByUserId(userId: string): Promise<ChatEntity[]>;
}

export default IChatRepository;
