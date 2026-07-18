import {
  Inject,
  Injectable,
} from '@nestjs/common';
import type IMessageRepository from '@/modules/messages/domain/repositories/interface-messages/message.repository.interface';
import type IUserRepository from '@/modules/users/domain/repositories/interface-users/user.repository.interface';
import { MESSAGE_REPOSITORY } from '@/modules/messages/domain/tokens/message.repository.token';
import { USER_REPOSITORY } from '@/modules/users/domain/tokens/user.repository.token';
import { MessageViewService, type MessageView } from '@/modules/messages/application/usecases/message-view/message.view.service';
import { ChatParticipantService } from '@/modules/chat/application/services/chat-participant.service';
import { buildSenderNamesByUserId } from '../../shared/build-sender-names';

@Injectable()
export class ListMessagesByChatService {
  constructor(
    @Inject(MESSAGE_REPOSITORY)
    private readonly messageRepository: IMessageRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly chatParticipantService: ChatParticipantService,
    private readonly messageViewService: MessageViewService,
  ) {}

  async execute(
    chatId: string,
    authenticatedUserId: string,
  ): Promise<MessageView[]> {
    const chat = await this.chatParticipantService.requireById(
      chatId,
      authenticatedUserId,
      {
        forbiddenMessage:
          'You can only list messages from chats you participate in',
      },
    );

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
