import type IMessageRepository from '@/modules/messages/domain/repositories/interface-messages/message.repository.interface';
import { MessageEntity } from '@/modules/messages/domain/entities/message.entity';
import { MessageModel } from '@/modules/messages/infra/database/typeorm/models/message.model';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageMapper } from '../../mapper/message.mapper.model';

@Injectable()
export class MessagesRepository implements IMessageRepository {
  constructor(
    @InjectRepository(MessageModel)
    private readonly messagesRepository: Repository<MessageModel>,
  ) {}

  async create(message: MessageEntity): Promise<void> {
    const messageModel = MessageMapper.toModel(message);

    await this.messagesRepository.save({
      id: messageModel.id,
      chatId: messageModel.chatId,
      senderId: messageModel.senderId,
      encryptedContent: messageModel.encryptedContent,
      status: messageModel.status,
      arrivalAt: messageModel.arrivalAt,
      distanceKm: messageModel.distanceKm,
      departureAt: messageModel.departureAt,
      originCityId: messageModel.originCityId,
      destinationCityId: messageModel.destinationCityId,
      travelTimeMinutes: messageModel.travelTimeMinutes,
    });
  }

  async findById(id: string): Promise<MessageEntity | null> {
    const message = await this.messagesRepository.findOne({
      where: { id },
    });

    if (!message) {
      return null;
    }

    return MessageMapper.toDomain([message])[0];
  }

  async findByChatId(chatId: string): Promise<MessageEntity[]> {
    const messages = await this.messagesRepository.find({
      where: { chatId },
      order: { createdAt: 'ASC' },
    });

    return MessageMapper.toDomain(messages);
  }
}
