import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MessageViewService } from '@/modules/messages/application/usecases/message-view/message.view.service';
import { TrackingService } from '@/modules/delivery/application/usecases/tracking.service';
import { MessageStatus } from '@/modules/messages/domain/entities/message.entity';
import {
  buildDeliveredMessage,
  buildMessage,
} from './helpers/message.fixture';

describe('MessageViewService', () => {
  const decryptContent = vi.fn((value: string) => `plain:${value}`);
  const encryptContent = vi.fn();
  let service: MessageViewService;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-15T13:00:00.000Z'));
    decryptContent.mockClear();
    service = new MessageViewService(new TrackingService(), {
      encryptContent,
      decryptContent,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('lets the sender always read decrypted content while traveling', () => {
    const message = buildMessage();

    const view = service.toView(message, 'user-sender', 'Sender Name');

    expect(view.canRead).toBe(false);
    expect(view.content).toBe('plain:encrypted-hello');
    expect(view.tracking.status).toBe(MessageStatus.TRAVELING);
    expect(view.tracking.progress).toBe(50);
    expect(view.tracking.remainingMinutes).toBe(60);
    expect(decryptContent).toHaveBeenCalledWith('encrypted-hello');
  });

  it('hides content from recipient while the raven is traveling', () => {
    const message = buildMessage();

    const view = service.toView(message, 'user-recipient', 'Sender Name');

    expect(view.canRead).toBe(false);
    expect(view.content).toBe('Your raven is still flying.');
    expect(view.tracking.status).toBe(MessageStatus.TRAVELING);
    expect(decryptContent).not.toHaveBeenCalled();
  });

  it('reveals decrypted content to recipient after delivery', () => {
    const message = buildDeliveredMessage();

    const view = service.toView(message, 'user-recipient', 'Sender Name');

    expect(view.canRead).toBe(true);
    expect(view.content).toBe('plain:encrypted-hello');
    expect(view.tracking).toMatchObject({
      status: MessageStatus.DELIVERED,
      progress: 100,
      remainingMinutes: 0,
      deliveredAt: message.getDeliveredAt(),
      readAt: null,
    });
  });
});
