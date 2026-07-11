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
import { MESSAGE_REPOSITORY } from '../../infra/tokens/message.token.repository';
import { CHAT_REPOSITORY } from '@/modules/chat/infra/tokens/chat.token.repository';
import { USER_REPOSITORY } from '@/modules/users/infra/tokens/user.token.repository';
import { MessageViewService, type MessageView } from '../message-view/message.view.service';
import { buildSenderNamesByUserId } from '../message-view/build-sender-names';

@Injectable()
export class ListMessagesByChatService {
  private readonly logger = new Logger(ListMessagesByChatService.name);

  constructor(
    @Inject(MESSAGE_REPOSITORY)
    private readonly messageRepository: IMessageRepository,
    @Inject(CHAT_REPOSITORY)
    private readonly chatRepository: IChatRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly messageViewService: MessageViewService,
  ) {}

  async execute(
    chatId: string,
    authenticatedUserId: string,
  ): Promise<MessageView[]> {
    const chat = await this.chatRepository.findById(chatId);

    if (!chat) {
      this.logger.error('Chat not found', { chatId });
      throw new NotFoundException('Chat not found');
    }

    const isParticipant =
      chat.getUserOneId() === authenticatedUserId ||
      chat.getUserTwoId() === authenticatedUserId;

    if (!isParticipant) {
      this.logger.error('Authenticated user is not a participant of this chat', {
        chatId,
        authenticatedUserId,
      });
      throw new ForbiddenException('You can only list messages from chats you participate in');
    }

    const messages = await this.messageRepository.findByChatId(chatId);
    const senderNames = await buildSenderNamesByUserId(this.userRepository, [
      chat.getUserOneId(),
      chat.getUserTwoId(),
    ]);

    return messages.map((message) =>
      this.messageViewService.toView(
        message,
        authenticatedUserId,
        senderNames[message.getSenderId()] ?? '',
      ),
    );
  }
}
