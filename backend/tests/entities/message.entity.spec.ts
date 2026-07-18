import { describe, expect, it } from 'vitest';
import {
  MessageEntity,
  MessageStatus,
} from '@/modules/messages/domain/entities/message.entity';

const baseProps = {
  chatId: 'chat-1',
  senderId: 'user-sender',
  encryptedContent: 'encrypted-content',
  arrivalAt: new Date('2026-07-18T20:00:00.000Z'),
  distanceKm: 100,
  departureAt: new Date('2026-07-18T19:00:00.000Z'),
  originCityId: 'city-a',
  destinationCityId: 'city-b',
  travelTimeMinutes: 60,
};

describe('MessageEntity delivery state', () => {
  it('starts as TRAVELING without timestamps', () => {
    const message = MessageEntity.send(baseProps);

    expect(message.getStatus()).toBe(MessageStatus.TRAVELING);
    expect(message.getDeliveredAt()).toBeNull();
    expect(message.getReadAt()).toBeNull();
  });

  it('transitions from TRAVELING to DELIVERED', () => {
    const message = MessageEntity.send(baseProps);

    message.markAsDelivered();

    expect(message.getStatus()).toBe(MessageStatus.DELIVERED);
    expect(message.getDeliveredAt()).toBeInstanceOf(Date);
    expect(message.getReadAt()).toBeNull();
  });

  it('is idempotent when marking delivery twice', () => {
    const message = MessageEntity.send(baseProps);

    message.markAsDelivered();
    const deliveredAt = message.getDeliveredAt();

    message.markAsDelivered();

    expect(message.getStatus()).toBe(MessageStatus.DELIVERED);
    expect(message.getDeliveredAt()).toBe(deliveredAt);
  });

  it('transitions from DELIVERED to READ for recipient', () => {
    const message = MessageEntity.send(baseProps);
    message.markAsDelivered();

    message.markAsRead('user-recipient');

    expect(message.getStatus()).toBe(MessageStatus.READ);
    expect(message.getReadAt()).toBeInstanceOf(Date);
  });

  it('does not mark as read for sender', () => {
    const message = MessageEntity.send(baseProps);
    message.markAsDelivered();

    message.markAsRead(baseProps.senderId);

    expect(message.getStatus()).toBe(MessageStatus.DELIVERED);
    expect(message.getReadAt()).toBeNull();
  });

  it('throws when marking unreadable traveling message as read', () => {
    const message = MessageEntity.send(baseProps);

    expect(() => message.markAsRead('user-recipient')).toThrow(
      'Message has not been delivered yet',
    );
  });

  it('is idempotent when marking read twice', () => {
    const message = MessageEntity.send(baseProps);
    message.markAsDelivered();
    message.markAsRead('user-recipient');
    const readAt = message.getReadAt();

    message.markAsRead('user-recipient');

    expect(message.getStatus()).toBe(MessageStatus.READ);
    expect(message.getReadAt()).toBe(readAt);
  });
});
