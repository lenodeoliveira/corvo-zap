import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import type IChatRepository from '@/modules/chat/domain/repositories/interface-chat/chat.repository.interface';
import type IUserRepository from '@/modules/users/domain/repositories/interface-users/user.repository.interface';
import { CHAT_REPOSITORY } from '@/modules/chat/domain/tokens/chat.repository.token';
import { USER_REPOSITORY } from '@/modules/users/domain/tokens/user.repository.token';
import { MESSAGE_REPOSITORY } from '@/modules/messages/domain/tokens/message.repository.token';
import type IMessageRepository from '@/modules/messages/domain/repositories/interface-messages/message.repository.interface';
import { MessageViewService } from '@/modules/messages/application/usecases/message-view/message.view.service';
import { buildSenderNamesByUserId } from '../../shared/build-sender-names';

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
        const otherParticipantId =
          chat.getUserOneId() === authenticatedUserId
            ? chat.getUserTwoId()
            : chat.getUserOneId();

        return {
          ...chat.toJSON(),
          otherParticipantName: senderNames[otherParticipantId] ?? '',
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
