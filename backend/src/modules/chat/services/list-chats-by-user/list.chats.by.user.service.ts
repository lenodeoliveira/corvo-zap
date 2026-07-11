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

@Injectable()
export class ListChatsByUserService {
  private readonly logger = new Logger(ListChatsByUserService.name);

  constructor(
    @Inject(CHAT_REPOSITORY)
    private readonly chatRepository: IChatRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(authenticatedUserId: string): Promise<Record<string, unknown>[]> {
    const user = await this.userRepository.findById(authenticatedUserId);

    console.log('user', authenticatedUserId);

    if (!user) {
      this.logger.error('User not found', { userId: authenticatedUserId });
      throw new NotFoundException('User not found');
    }

    const chats = await this.chatRepository.findByUserId(authenticatedUserId);

    return chats.map((chat) => chat.toJSON());
  }
}
