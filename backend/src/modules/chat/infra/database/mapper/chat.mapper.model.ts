import { DeepPartial } from 'typeorm';
import { ChatEntity } from '@/modules/chat/domain/entities/chat.entity';
import { ChatModel } from '../typeorm/models/chat.model';

export class ChatMapper {
  static toModel(entity: ChatEntity): DeepPartial<ChatModel> {
    return {
      id: entity.getId(),
      userOneId: entity.getUserOneId(),
      userTwoId: entity.getUserTwoId(),
    };
  }

  static toDomain(model: ChatModel): ChatEntity {
    return ChatEntity.create({
      id: model.id,
      userOneId: model.userOneId,
      userTwoId: model.userTwoId,
    });
  }

  static toDomainList(models: ChatModel[]): ChatEntity[] {
    if (!models?.length) {
      return [];
    }

    return models.map((model) => ChatMapper.toDomain(model));
  }
}
