import { MessageEntity, MessageStatus } from '@/modules/messages/entities/message.entity';
import { MessageModel } from '../model/message.model';
import { DeepPartial } from 'typeorm';

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
