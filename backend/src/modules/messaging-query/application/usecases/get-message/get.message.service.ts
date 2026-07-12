import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import type IMessageRepository from '@/modules/messages/domain/repositories/interface-messages/message.repository.interface';
import type IUserRepository from '@/modules/users/domain/repositories/interface-users/user.repository.interface';
import { MESSAGE_REPOSITORY } from '@/modules/messages/infra/database/typeorm/tokens/message.token.repository';
import { USER_REPOSITORY } from '@/modules/users/infra/database/typeorm/tokens/user.token.repository';
import { MessageViewService, type MessageView } from '@/modules/messages/application/usecases/message-view/message.view.service';
import { ChatParticipantService } from '@/modules/chat/application/services/chat-participant.service';
import { buildSenderNamesByUserId } from '../../shared/build-sender-names';

@Injectable()
export class GetMessageService {
  private readonly logger = new Logger(GetMessageService.name);

  constructor(
    @Inject(MESSAGE_REPOSITORY)
    private readonly messageRepository: IMessageRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly chatParticipantService: ChatParticipantService,
    private readonly messageViewService: MessageViewService,
  ) {}

  async execute(
    messageId: string,
    authenticatedUserId: string,
  ): Promise<MessageView> {
    const message = await this.messageRepository.findById(messageId);

    if (!message) {
      this.logger.error('Message not found', { messageId });
      throw new NotFoundException('Message not found');
    }

    const chat = await this.chatParticipantService.requireById(
      message.getChatId(),
      authenticatedUserId,
      {
        forbiddenMessage:
          'You can only read messages from chats you participate in',
        logContext: { messageId },
      },
    );

    const senderNames = await buildSenderNamesByUserId(this.userRepository, [
      chat.getUserOneId(),
      chat.getUserTwoId(),
    ]);

    return this.messageViewService.toView(
      message,
      authenticatedUserId,
      senderNames[message.getSenderId()] ?? '',
    );
  }
}
