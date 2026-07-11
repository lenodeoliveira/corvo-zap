import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import type IChatRepository from '../../interfaces/chat.repository.interface';
import type IUserRepository from '@/modules/users/interfaces/user.repository.interface';
import { ChatEntity } from '../../entities/chat.entity';
import { CHAT_REPOSITORY } from '../../infra/tokens/chat.token.repository';
import { USER_REPOSITORY } from '@/modules/users/infra/tokens/user.token.repository';

interface CreateChatProps {
  userOneId: string;
  userTwoId: string;
}

@Injectable()
export class CreateChatService {
  private readonly logger = new Logger(CreateChatService.name);

  constructor(
    @Inject(CHAT_REPOSITORY)
    private readonly chatRepository: IChatRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(
    input: CreateChatProps,
    authenticatedUserId: string,
  ): Promise<Record<string, unknown>> {
    const isAuthenticatedUserParticipant =
      input.userOneId === authenticatedUserId ||
      input.userTwoId === authenticatedUserId;

    if (!isAuthenticatedUserParticipant) {
      this.logger.error('Authenticated user is not a participant of this chat', {
        authenticatedUserId,
        userOneId: input.userOneId,
        userTwoId: input.userTwoId,
      });
      throw new ForbiddenException('You can only create chats that you participate in');
    }

    if (input.userOneId === input.userTwoId) {
      this.logger.error('Users must be different');
      throw new BadRequestException('Users must be different');
    }

    const userOne = await this.userRepository.findById(input.userOneId);
    const userTwo = await this.userRepository.findById(input.userTwoId);

    if (!userOne || !userTwo) {
      this.logger.error('One or both users were not found', {
        userOneId: input.userOneId,
        userTwoId: input.userTwoId,
      });
      throw new NotFoundException('One or both users were not found');
    }

    const chatAlreadyExists = await this.chatRepository.findByParticipants(
      input.userOneId,
      input.userTwoId,
    );

    if (chatAlreadyExists) {
      this.logger.error('Chat already exists between these users', {
        chat: chatAlreadyExists.toJSON(),
      });
      throw new BadRequestException('Chat already exists between these users');
    }

    const chat = ChatEntity.create({
      userOneId: input.userOneId,
      userTwoId: input.userTwoId,
    });

    await this.chatRepository.create(chat);

    return chat.toJSON();
  }
}
