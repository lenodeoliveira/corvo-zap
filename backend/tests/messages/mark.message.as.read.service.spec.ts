import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MarkMessageAsReadService } from '@/modules/messages/application/usecases/mark-message-as-read/mark.message.as.read.service';
import { ChatEntity } from '@/modules/chat/domain/entities/chat.entity';
import { UserEntity } from '@/modules/users/domain/entities/user.entity';
import { MessageStatus } from '@/modules/messages/domain/entities/message.entity';
import { DOMAIN_EVENTS } from '@/modules/events';
import type IMessageRepository from '@/modules/messages/domain/repositories/interface-messages/message.repository.interface';
import type IUserRepository from '@/modules/users/domain/repositories/interface-users/user.repository.interface';
import type { ChatParticipantService } from '@/modules/chat/application/services/chat-participant.service';
import type { MessageViewService } from '@/modules/messages/application/usecases/message-view/message.view.service';
import {
  buildDeliveredMessage,
  buildMessage,
} from './helpers/message.fixture';

describe('MarkMessageAsReadService', () => {
  const senderId = 'user-sender';
  const recipientId = 'user-recipient';

  const chat = ChatEntity.create({
    id: 'chat-1',
    userOneId: senderId,
    userTwoId: recipientId,
  });

  const sender = UserEntity.create({
    id: senderId,
    name: 'Sender',
    email: 'sender@example.com',
    passwordHash: 'hash',
    role: 'user',
    status: 'active',
    cityId: 'city-origin',
  });

  let messageRepository: {
    findById: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
  };
  let userRepository: {
    findById: ReturnType<typeof vi.fn>;
  };
  let chatParticipantService: {
    requireById: ReturnType<typeof vi.fn>;
  };
  let messageViewService: {
    toView: ReturnType<typeof vi.fn>;
  };
  let eventEmitter: {
    emit: ReturnType<typeof vi.fn>;
  };
  let service: MarkMessageAsReadService;

  beforeEach(() => {
    messageRepository = {
      findById: vi.fn(),
      update: vi.fn().mockResolvedValue(undefined),
    };
    userRepository = {
      findById: vi.fn().mockResolvedValue(sender),
    };
    chatParticipantService = {
      requireById: vi.fn().mockResolvedValue(chat),
    };
    messageViewService = {
      toView: vi.fn().mockReturnValue({ id: 'view-1', canRead: true }),
    };
    eventEmitter = { emit: vi.fn() };

    service = new MarkMessageAsReadService(
      messageRepository as unknown as IMessageRepository,
      userRepository as unknown as IUserRepository,
      chatParticipantService as unknown as ChatParticipantService,
      messageViewService as unknown as MessageViewService,
      eventEmitter as unknown as EventEmitter2,
    );
  });

  it('marks a delivered message as read and emits read event', async () => {
    const message = buildDeliveredMessage();
    messageRepository.findById.mockResolvedValue(message);

    const view = await service.execute(message.getId(), recipientId);

    expect(message.getStatus()).toBe(MessageStatus.READ);
    expect(message.getReadAt()).toBeInstanceOf(Date);
    expect(messageRepository.update).toHaveBeenCalledWith(message);
    expect(eventEmitter.emit).toHaveBeenCalledWith(
      DOMAIN_EVENTS.MESSAGE_READ,
      expect.objectContaining({ messageId: message.getId() }),
    );
    expect(messageViewService.toView).toHaveBeenCalledWith(
      message,
      recipientId,
      'Sender',
    );
    expect(view).toEqual({ id: 'view-1', canRead: true });
  });

  it('is idempotent when message is already read', async () => {
    const message = buildDeliveredMessage();
    message.markAsRead(recipientId);
    messageRepository.findById.mockResolvedValue(message);

    await service.execute(message.getId(), recipientId);

    expect(messageRepository.update).not.toHaveBeenCalled();
    expect(eventEmitter.emit).not.toHaveBeenCalled();
    expect(messageViewService.toView).toHaveBeenCalled();
  });

  it('throws when message does not exist', async () => {
    messageRepository.findById.mockResolvedValue(null);

    await expect(
      service.execute('missing', recipientId),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('throws when sender tries to mark as read', async () => {
    messageRepository.findById.mockResolvedValue(buildDeliveredMessage());

    await expect(
      service.execute('message-1', senderId),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('throws when message is still traveling', async () => {
    messageRepository.findById.mockResolvedValue(buildMessage());

    await expect(
      service.execute('message-1', recipientId),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
