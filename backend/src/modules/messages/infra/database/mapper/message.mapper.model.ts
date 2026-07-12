import { MessageEntity, MessageStatus } from '@/modules/messages/domain/entities/message.entity';
import { DeepPartial } from 'typeorm';
import { MessageModel } from '../typeorm/models/message.model';

export class MessageMapper {
  static toModel(entity: MessageEntity): DeepPartial<MessageModel> {
    return {
      id: entity.getId(),
      chatId: entity.getChatId(),
      senderId: entity.getSenderId(),
      encryptedContent: entity.getEncryptedContent(),
      status: entity.getStatus(),
      arrivalAt: entity.getArrivalAt(),
      distanceKm: entity.getDistanceKm(),
      departureAt: entity.getDepartureAt(),
      originCityId: entity.getOriginCityId(),
      destinationCityId: entity.getDestinationCityId(),
      travelTimeMinutes: entity.getTravelTimeMinutes(),
    };
  }

  static toDomain(models: MessageModel[]): MessageEntity[] {
    if (!models?.length) {
      return [];
    }

    return models.map((model) =>
      MessageEntity.send({
        id: model.id,
        chatId: model.chatId,
        senderId: model.senderId,
        encryptedContent: model.encryptedContent,
        status: model.status as MessageStatus,
        arrivalAt: model.arrivalAt,
        distanceKm: model.distanceKm,
        departureAt: model.departureAt,
        originCityId: model.originCityId,
        destinationCityId: model.destinationCityId,
        travelTimeMinutes: model.travelTimeMinutes,
      }),
    );
  }
}
