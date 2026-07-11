import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageModel } from './infra/database/sqlite/model/message.model';
import { MessageControllers } from './http/controllers/message.controllers';
import { CreateMessageService } from './services/create-message/create.message.service';
import { ListMessagesByChatService } from './services/list-messages-by-chat/list.messages.by.chat.service';
import { MESSAGE_REPOSITORY } from './infra/tokens/message.token.repository';
import { MessagesRepository } from './infra/database/sqlite/repository/messages.repository';
import { ChatModule } from '../chat/chat.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MessageModel]),
    ChatModule,
    UsersModule,
  ],
  controllers: [MessageControllers],
  providers: [
    CreateMessageService,
    ListMessagesByChatService,
    {
      provide: MESSAGE_REPOSITORY,
      useClass: MessagesRepository,
    },
  ],
  exports: [MESSAGE_REPOSITORY],
})
export class MessagesModule {}
