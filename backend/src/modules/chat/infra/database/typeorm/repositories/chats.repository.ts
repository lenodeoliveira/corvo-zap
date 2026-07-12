import type IChatRepository from '@/modules/chat/domain/repositories/interface-chat/chat.repository.interface';
import { ChatEntity } from '@/modules/chat/domain/entities/chat.entity';
import { ChatModel } from '@/modules/chat/infra/database/typeorm/models/chat.model';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMapper } from '../../mapper/chat.mapper.model';

@Injectable()
export class ChatsRepository implements IChatRepository {
  constructor(
    @InjectRepository(ChatModel)
    private readonly chatsRepository: Repository<ChatModel>,
  ) {}

  async create(chat: ChatEntity): Promise<void> {
    const chatModel = ChatMapper.toModel(chat);

    await this.chatsRepository.save({
      id: chatModel.id,
      userOneId: chatModel.userOneId,
      userTwoId: chatModel.userTwoId,
    });
  }

  async findById(id: string): Promise<ChatEntity | null> {
    const chat = await this.chatsRepository.findOne({
      where: { id },
    });

    if (!chat) {
      return null;
    }

    return ChatMapper.toDomain(chat);
  }

  async findByParticipants(
    userOneId: string,
    userTwoId: string,
  ): Promise<ChatEntity | null> {
    const chat = await this.chatsRepository.findOne({
      where: [
        { userOneId, userTwoId },
        { userOneId: userTwoId, userTwoId: userOneId },
      ],
    });

    if (!chat) {
      return null;
    }

    return ChatMapper.toDomain(chat);
  }

  async findByUserId(userId: string): Promise<ChatEntity[]> {
    const chats = await this.chatsRepository.find({
      where: [{ userOneId: userId }, { userTwoId: userId }],
      order: { updatedAt: 'DESC' },
    });

    return ChatMapper.toDomainList(chats);
  }
}
