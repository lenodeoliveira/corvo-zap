import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatModel } from './infra/database/typeorm/models/chat.model';
import { ChatControllers } from './interfaces/http/controllers/chat.controllers';
import { CreateChatService } from './application/usecases/create-chat/create.chat.service';
import { ListChatsByUserService } from './application/usecases/list-chats-by-user/list.chats.by.user.service';
import { CHAT_REPOSITORY } from './infra/database/typeorm/tokens/chat.token.repository';
import { ChatsRepository } from './infra/database/typeorm/repositories/chats.repository';
import { UsersModule } from '../users/users.module';
import { MessagesModule } from '../messages/messages.module';

@Module({
  imports: [TypeOrmModule.forFeature([ChatModel]), UsersModule, forwardRef(() => MessagesModule)],
  controllers: [ChatControllers],
  providers: [
    CreateChatService,
    ListChatsByUserService,
    {
      provide: CHAT_REPOSITORY,
      useClass: ChatsRepository,
    },
  ],
  exports: [CHAT_REPOSITORY],
})
export class ChatModule {}
