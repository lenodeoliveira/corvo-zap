import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EventEmitter2 } from '@nestjs/event-emitter';
import type { DataSource } from 'typeorm';
import { CreateMessageService } from '@/modules/messages/application/usecases/create-message/create.message.service';
import { ChatEntity } from '@/modules/chat/domain/entities/chat.entity';
import { UserEntity } from '@/modules/users/domain/entities/user.entity';
import { CityEntity } from '@/modules/cities/domain/entities/city.entity';
import { DOMAIN_EVENTS } from '@/modules/events';
import type IMessageRepository from '@/modules/messages/domain/repositories/interface-messages/message.repository.interface';
import type IUserRepository from '@/modules/users/domain/repositories/interface-users/user.repository.interface';
import type ICityRepository from '@/modules/cities/domain/repositories/interface-cities/city.repository.interface';
import type { ChatParticipantService } from '@/modules/chat/application/services/chat-participant.service';
import type { DeliveryService } from '@/modules/delivery/application/usecases/delivery.service';
import type { DistanceService } from '@/modules/delivery/application/usecases/distance.service';
import type { MessageViewService } from '@/modules/messages/application/usecases/message-view/message.view.service';
import type IContentEncryption from '@/modules/crypto/domain/gateways/content.encryption';

describe('CreateMessageService', () => {
  const senderId = 'user-sender';
  const recipientId = 'user-recipient';
  const chatId = 'chat-1';

  const chat = ChatEntity.create({
    id: chatId,
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

  const recipient = UserEntity.create({
    id: recipientId,
    name: 'Recipient',
    email: 'recipient@example.com',
    passwordHash: 'hash',
    role: 'user',
    status: 'active',
    cityId: 'city-destination',
  });

  const originCity = CityEntity.create({
    id: 'city-origin',
    name: 'Origin',
    x: 0,
    y: 0,
  });

  const destinationCity = CityEntity.create({
    id: 'city-destination',
    name: 'Destination',
    x: 3,
    y: 4,
  });

  let messageRepository: {
    create: ReturnType<typeof vi.fn>;
  };
  let userRepository: {
    findById: ReturnType<typeof vi.fn>;
    reserveCrow: ReturnType<typeof vi.fn>;
  };
  let cityRepository: {
    findById: ReturnType<typeof vi.fn>;
  };
  let contentEncryptionService: {
    encryptContent: ReturnType<typeof vi.fn>;
  };
  let chatParticipantService: {
    requireById: ReturnType<typeof vi.fn>;
  };
  let deliveryService: {
    scheduleDelivery: ReturnType<typeof vi.fn>;
  };
  let distanceService: {
    calculate: ReturnType<typeof vi.fn>;
  };
  let messageViewService: {
    toView: ReturnType<typeof vi.fn>;
  };
  let eventEmitter: {
    emit: ReturnType<typeof vi.fn>;
  };
  let dataSource: {
    transaction: ReturnType<typeof vi.fn>;
  };
  let service: CreateMessageService;

  beforeEach(() => {
    messageRepository = { create: vi.fn().mockResolvedValue(undefined) };
    userRepository = {
      findById: vi.fn(),
      reserveCrow: vi.fn().mockResolvedValue(true),
    };
    cityRepository = { findById: vi.fn() };
    contentEncryptionService = {
      encryptContent: vi.fn().mockReturnValue('encrypted-hello'),
    };
    chatParticipantService = {
      requireById: vi.fn().mockResolvedValue(chat),
    };
    deliveryService = {
      scheduleDelivery: vi.fn().mockReturnValue({
        departureAt: new Date('2026-08-15T12:00:00.000Z'),
        arrivalAt: new Date('2026-08-15T12:19:00.000Z'),
      }),
    };
    distanceService = {
      calculate: vi.fn().mockReturnValue({
        distanceKm: 25,
        travelTimeMinutes: 19,
      }),
    };
    messageViewService = {
      toView: vi.fn().mockReturnValue({ id: 'view-1' }),
    };
    eventEmitter = { emit: vi.fn() };
    dataSource = {
      transaction: vi.fn(async (callback) => callback({} as never)),
    };

    service = new CreateMessageService(
      messageRepository as unknown as IMessageRepository,
      userRepository as unknown as IUserRepository,
      cityRepository as unknown as ICityRepository,
      contentEncryptionService as unknown as IContentEncryption,
      chatParticipantService as unknown as ChatParticipantService,
      deliveryService as unknown as DeliveryService,
      distanceService as unknown as DistanceService,
      messageViewService as unknown as MessageViewService,
      eventEmitter as unknown as EventEmitter2,
      dataSource as unknown as DataSource,
    );

    userRepository.findById.mockImplementation(async (id: string) => {
      if (id === senderId) return sender;
      if (id === recipientId) return recipient;
      return null;
    });

    cityRepository.findById.mockImplementation(async (id: string) => {
      if (id === 'city-origin') return originCity;
      if (id === 'city-destination') return destinationCity;
      return null;
    });
  });

  it('creates an encrypted traveling message, reserves a crow and emits created', async () => {
    const view = await service.execute(
      { chatId, content: 'hello' },
      senderId,
    );

    expect(contentEncryptionService.encryptContent).toHaveBeenCalledWith(
      'hello',
    );
    expect(distanceService.calculate).toHaveBeenCalledWith(
      originCity.getCoordinate(),
      destinationCity.getCoordinate(),
    );
    expect(deliveryService.scheduleDelivery).toHaveBeenCalledWith(19);
    expect(userRepository.reserveCrow).toHaveBeenCalledWith(
      senderId,
      expect.anything(),
    );
    expect(messageRepository.create).toHaveBeenCalledTimes(1);

    const createdMessage = messageRepository.create.mock.calls[0][0];
    expect(createdMessage.getChatId()).toBe(chatId);
    expect(createdMessage.getSenderId()).toBe(senderId);
    expect(createdMessage.getEncryptedContent()).toBe('encrypted-hello');
    expect(createdMessage.getDistanceKm()).toBe(25);
    expect(createdMessage.getTravelTimeMinutes()).toBe(19);

    expect(eventEmitter.emit).toHaveBeenCalledWith(
      DOMAIN_EVENTS.MESSAGE_CREATED,
      expect.objectContaining({
        message: createdMessage,
        chat,
        senderName: 'Sender',
      }),
    );
    expect(messageViewService.toView).toHaveBeenCalledWith(
      createdMessage,
      senderId,
      'Sender',
    );
    expect(view).toEqual({ id: 'view-1' });
  });

  it('throws when sender is missing', async () => {
    userRepository.findById.mockResolvedValueOnce(null);

    await expect(
      service.execute({ chatId, content: 'hello' }, senderId),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('throws when sender or recipient has no city', async () => {
    const senderWithoutCity = UserEntity.create({
      id: senderId,
      name: 'Sender',
      email: 'sender@example.com',
      passwordHash: 'hash',
      role: 'user',
      status: 'active',
    });
    userRepository.findById.mockImplementation(async (id: string) => {
      if (id === senderId) return senderWithoutCity;
      if (id === recipientId) return recipient;
      return null;
    });

    await expect(
      service.execute({ chatId, content: 'hello' }, senderId),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('throws when no crow is available', async () => {
    userRepository.reserveCrow.mockResolvedValue(false);

    await expect(
      service.execute({ chatId, content: 'hello' }, senderId),
    ).rejects.toBeInstanceOf(ConflictException);

    expect(messageRepository.create).not.toHaveBeenCalled();
    expect(eventEmitter.emit).not.toHaveBeenCalled();
  });
});
