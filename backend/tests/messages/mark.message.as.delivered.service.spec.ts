import { NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EventEmitter2 } from '@nestjs/event-emitter';
import type { DataSource } from 'typeorm';
import { MarkMessageAsDeliveredService } from '@/modules/messages/application/usecases/mark-message-as-delivered/mark.message.as.delivered.service';
import { UserEntity } from '@/modules/users/domain/entities/user.entity';
import { DOMAIN_EVENTS } from '@/modules/events';
import type IMessageRepository from '@/modules/messages/domain/repositories/interface-messages/message.repository.interface';
import type IUserRepository from '@/modules/users/domain/repositories/interface-users/user.repository.interface';
import {
  buildDeliveredMessage,
  buildMessage,
} from './helpers/message.fixture';

describe('MarkMessageAsDeliveredService', () => {
  const sender = UserEntity.create({
    id: 'user-sender',
    name: 'Sender',
    email: 'sender@example.com',
    passwordHash: 'hash',
    role: 'user',
    status: 'active',
    cityId: 'city-origin',
  });

  let messageRepository: {
    findById: ReturnType<typeof vi.fn>;
    markAsDeliveredIfTraveling: ReturnType<typeof vi.fn>;
  };
  let userRepository: {
    findById: ReturnType<typeof vi.fn>;
    restoreCrow: ReturnType<typeof vi.fn>;
  };
  let eventEmitter: {
    emit: ReturnType<typeof vi.fn>;
  };
  let dataSource: {
    transaction: ReturnType<typeof vi.fn>;
  };
  let service: MarkMessageAsDeliveredService;

  beforeEach(() => {
    messageRepository = {
      findById: vi.fn(),
      markAsDeliveredIfTraveling: vi.fn().mockResolvedValue(true),
    };
    userRepository = {
      findById: vi.fn().mockResolvedValue(sender),
      restoreCrow: vi.fn().mockResolvedValue(undefined),
    };
    eventEmitter = { emit: vi.fn() };
    dataSource = {
      transaction: vi.fn(async (callback) => callback({} as never)),
    };

    service = new MarkMessageAsDeliveredService(
      messageRepository as unknown as IMessageRepository,
      eventEmitter as unknown as EventEmitter2,
      userRepository as unknown as IUserRepository,
      dataSource as unknown as DataSource,
    );
  });

  it('delivers a traveling message, restores crow and emits delivered', async () => {
    const message = buildMessage();
    messageRepository.findById.mockResolvedValue(message);

    const result = await service.execute(message.getId());

    expect(result).toBe(true);
    expect(messageRepository.markAsDeliveredIfTraveling).toHaveBeenCalledWith(
      message.getId(),
      expect.anything(),
    );
    expect(userRepository.restoreCrow).toHaveBeenCalledWith(
      sender.getId(),
      expect.anything(),
    );
    expect(eventEmitter.emit).toHaveBeenCalledWith(
      DOMAIN_EVENTS.MESSAGE_DELIVERED,
      expect.objectContaining({ messageId: message.getId() }),
    );
  });

  it('returns false when message does not exist', async () => {
    messageRepository.findById.mockResolvedValue(null);

    await expect(service.execute('missing')).resolves.toBe(false);
    expect(eventEmitter.emit).not.toHaveBeenCalled();
  });

  it('returns false when message is not traveling', async () => {
    messageRepository.findById.mockResolvedValue(buildDeliveredMessage());

    await expect(service.execute('message-1')).resolves.toBe(false);
    expect(
      messageRepository.markAsDeliveredIfTraveling,
    ).not.toHaveBeenCalled();
    expect(eventEmitter.emit).not.toHaveBeenCalled();
  });

  it('returns false when concurrent delivery already happened', async () => {
    messageRepository.findById.mockResolvedValue(buildMessage());
    messageRepository.markAsDeliveredIfTraveling.mockResolvedValue(false);

    await expect(service.execute('message-1')).resolves.toBe(false);
    expect(userRepository.restoreCrow).not.toHaveBeenCalled();
    expect(eventEmitter.emit).not.toHaveBeenCalled();
  });

  it('throws when sender no longer exists', async () => {
    messageRepository.findById.mockResolvedValue(buildMessage());
    userRepository.findById.mockResolvedValue(null);

    await expect(service.execute('message-1')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
