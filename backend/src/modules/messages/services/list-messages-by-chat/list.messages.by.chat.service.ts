import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import type IMessageRepository from '../../interfaces/message.repository.interface';
import type IChatRepository from '@/modules/chat/interfaces/chat.repository.interface';
import { MESSAGE_REPOSITORY } from '../../infra/tokens/message.token.repository';
import { CHAT_REPOSITORY } from '@/modules/chat/infra/tokens/chat.token.repository';

@Injectable()
export class ListMessagesByChatService {
  private readonly logger = new Logger(ListMessagesByChatService.name);

  constructor(
    @Inject(MESSAGE_REPOSITORY)
    private readonly messageRepository: IMessageRepository,
    @Inject(CHAT_REPOSITORY)
    private readonly chatRepository: IChatRepository,
  ) {}

  async execute(chatId: string): Promise<Record<string, unknown>[]> {
    const chat = await this.chatRepository.findById(chatId);

    if (!chat) {
      this.logger.error('Chat not found', { chatId });
      throw new NotFoundException('Chat not found');
    }

    const messages = await this.messageRepository.findByChatId(chatId);

    return messages.map((message) => message.toJSON());
  }
}
