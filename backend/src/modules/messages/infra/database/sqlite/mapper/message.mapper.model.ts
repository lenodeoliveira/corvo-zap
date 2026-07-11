import { MessageEntity, MessageStatus } from '@/modules/messages/entities/message.entity';
import { MessageModel } from '../model/message.model';
import { DeepPartial } from 'typeorm';

export class MessageMapper {
  static toModel(entity: MessageEntity): DeepPartial<MessageModel> {
    return {
      id: entity.getId(),
      chatId: entity.getChatId(),
      senderId: entity.getSenderId(),
      content: entity.getContent(),
      status: entity.getStatus(),
    };
  }

  static toDomain(models: MessageModel[]): MessageEntity[] {
    if (!models?.length) {
      return [];
    }

    return models.map((model) =>
      MessageEntity.create({
        id: model.id,
        chatId: model.chatId,
        senderId: model.senderId,
        content: model.content,
        status: model.status as MessageStatus,
      }),
    );
  }
}
