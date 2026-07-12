import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatModel } from './infra/database/typeorm/models/chat.model';
import { ChatControllers } from './interfaces/http/controllers/chat.controllers';
import { CreateChatService } from './application/usecases/create-chat/create.chat.service';
import { ChatParticipantService } from './application/services/chat-participant.service';
import { CHAT_REPOSITORY } from './infra/database/typeorm/tokens/chat.token.repository';
import { ChatsRepository } from './infra/database/typeorm/repositories/chats.repository';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([ChatModel]), UsersModule],
  controllers: [ChatControllers],
  providers: [
    CreateChatService,
    ChatParticipantService,
    {
      provide: CHAT_REPOSITORY,
      useClass: ChatsRepository,
    },
  ],
  exports: [CHAT_REPOSITORY, ChatParticipantService],
})
export class ChatModule {}
