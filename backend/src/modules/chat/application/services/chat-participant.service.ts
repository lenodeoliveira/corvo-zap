import {
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ChatEntity } from '../../domain/entities/chat.entity';
import type IChatRepository from '../../domain/repositories/interface-chat/chat.repository.interface';
import { CHAT_REPOSITORY } from '@/modules/chat/domain/tokens/chat.repository.token';

interface RequireParticipantOptions {
  forbiddenMessage: string;
  logContext?: Record<string, unknown>;
}

@Injectable()
export class ChatParticipantService {
  private readonly logger = new Logger(ChatParticipantService.name);

  constructor(
    @Inject(CHAT_REPOSITORY)
    private readonly chatRepository: IChatRepository,
  ) {}

  async requireById(
    chatId: string,
    userId: string,
    options: RequireParticipantOptions,
  ): Promise<ChatEntity> {
    const chat = await this.chatRepository.findById(chatId);

    if (!chat) {
      this.logger.error('Chat not found', { chatId });
      throw new NotFoundException('Chat not found');
    }

    this.requireParticipant(chat, userId, options);

    return chat;
  }

  requireParticipant(
    chat: ChatEntity,
    userId: string,
    options: RequireParticipantOptions,
  ): void {
    if (chat.hasParticipant(userId)) {
      return;
    }

    this.logger.error('Authenticated user is not a participant of this chat', {
      chatId: chat.getId(),
      authenticatedUserId: userId,
      ...options.logContext,
    });
    throw new ForbiddenException(options.forbiddenMessage);
  }
}
