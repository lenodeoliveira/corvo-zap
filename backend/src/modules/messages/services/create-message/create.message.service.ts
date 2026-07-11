import {
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import type IMessageRepository from '../../interfaces/message.repository.interface';
import type IChatRepository from '@/modules/chat/interfaces/chat.repository.interface';
import type IUserRepository from '@/modules/users/interfaces/user.repository.interface';
import { MessageEntity } from '../../entities/message.entity';
import { MESSAGE_REPOSITORY } from '../../infra/tokens/message.token.repository';
import { CHAT_REPOSITORY } from '@/modules/chat/infra/tokens/chat.token.repository';
import { USER_REPOSITORY } from '@/modules/users/infra/tokens/user.token.repository';

interface CreateMessageProps {
  chatId: string;
  content: string;
}

@Injectable()
export class CreateMessageService {
  private readonly logger = new Logger(CreateMessageService.name);

  constructor(
    @Inject(MESSAGE_REPOSITORY)
    private readonly messageRepository: IMessageRepository,
    @Inject(CHAT_REPOSITORY)
    private readonly chatRepository: IChatRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(
    input: CreateMessageProps,
    authenticatedUserId: string,
  ): Promise<Record<string, unknown>> {
    const chat = await this.chatRepository.findById(input.chatId);

    if (!chat) {
      this.logger.error('Chat not found', { chatId: input.chatId });
      throw new NotFoundException('Chat not found');
    }

    const sender = await this.userRepository.findById(authenticatedUserId);

    if (!sender) {
      this.logger.error('Sender not found', { senderId: authenticatedUserId });
      throw new NotFoundException('Sender not found');
    }

    const isParticipant =
      chat.getUserOneId() === authenticatedUserId ||
      chat.getUserTwoId() === authenticatedUserId;

    if (!isParticipant) {
      this.logger.error('Authenticated user is not a participant of this chat', {
        chatId: input.chatId,
        authenticatedUserId,
      });
      throw new ForbiddenException('You can only send messages in chats you participate in');
    }

    const message = MessageEntity.create({
      chatId: input.chatId,
      senderId: authenticatedUserId,
      content: input.content,
    });

    await this.messageRepository.create(message);

    return message.toJSON();
  }
}
