import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatModel } from './infra/database/sqlite/model/chat.model';
import { ChatControllers } from './http/controllers/chat.controllers';
import { CreateChatService } from './services/create-chat/create.chat.service';
import { ListChatsByUserService } from './services/list-chats-by-user/list.chats.by.user.service';
import { CHAT_REPOSITORY } from './infra/tokens/chat.token.repository';
import { ChatsRepository } from './infra/database/sqlite/repository/chats.repository';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([ChatModel]), UsersModule],
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
