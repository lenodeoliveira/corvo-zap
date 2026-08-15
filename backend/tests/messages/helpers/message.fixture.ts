import {
  MessageEntity,
  MessageStatus,
  type MessageEntityProps,
} from '@/modules/messages/domain/entities/message.entity';

export const messageBaseProps: MessageEntityProps = {
  id: 'message-1',
  chatId: 'chat-1',
  senderId: 'user-sender',
  encryptedContent: 'encrypted-hello',
  arrivalAt: new Date('2026-08-15T14:00:00.000Z'),
  distanceKm: 100,
  departureAt: new Date('2026-08-15T12:00:00.000Z'),
  originCityId: 'city-origin',
  destinationCityId: 'city-destination',
  travelTimeMinutes: 120,
};

export function buildMessage(
  overrides: Partial<MessageEntityProps> = {},
): MessageEntity {
  return MessageEntity.send({
    ...messageBaseProps,
    ...overrides,
  });
}

export function buildDeliveredMessage(
  overrides: Partial<MessageEntityProps> = {},
): MessageEntity {
  return MessageEntity.send({
    ...messageBaseProps,
    status: MessageStatus.DELIVERED,
    deliveredAt: new Date('2026-08-15T14:00:00.000Z'),
    ...overrides,
  });
}
