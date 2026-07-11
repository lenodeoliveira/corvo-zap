import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import type IChatRepository from '../../interfaces/chat.repository.interface';
import type IUserRepository from '@/modules/users/interfaces/user.repository.interface';
import { CHAT_REPOSITORY } from '../../infra/tokens/chat.token.repository';
import { USER_REPOSITORY } from '@/modules/users/infra/tokens/user.token.repository';
import { MESSAGE_REPOSITORY } from '@/modules/messages/infra/tokens/message.token.repository';
import type IMessageRepository from '@/modules/messages/interfaces/message.repository.interface';
import { MessageViewService } from '@/modules/messages/services/message-view/message.view.service';
import { buildSenderNamesByUserId } from '@/modules/messages/services/message-view/build-sender-names';

@Injectable()
export class ListChatsByUserService {
  private readonly logger = new Logger(ListChatsByUserService.name);

  constructor(
    @Inject(CHAT_REPOSITORY)
    private readonly chatRepository: IChatRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(MESSAGE_REPOSITORY)
    private readonly messageRepository: IMessageRepository,
    private readonly messageViewService: MessageViewService,
  ) {}

  async execute(authenticatedUserId: string): Promise<Record<string, unknown>[]> {
    const user = await this.userRepository.findById(authenticatedUserId);

    if (!user) {
      this.logger.error('User not found', { userId: authenticatedUserId });
      throw new NotFoundException('User not found');
    }

    const chats = await this.chatRepository.findByUserId(authenticatedUserId);

    return Promise.all(
      chats.map(async (chat) => {
        const messages = await this.messageRepository.findByChatId(
          chat.getId(),
        );
        const senderNames = await buildSenderNamesByUserId(this.userRepository, [
          chat.getUserOneId(),
          chat.getUserTwoId(),
        ]);

        return {
          ...chat.toJSON(),
          messages: messages.map((message) =>
            this.messageViewService.toView(
              message,
              authenticatedUserId,
              senderNames[message.getSenderId()] ?? '',
            ),
          ),
        };
      }),
    );
  }
}
