import { Module } from '@nestjs/common';
import { ChatModule } from '../chat/chat.module';
import { MessagesModule } from '../messages/messages.module';
import { UsersModule } from '../users/users.module';
import { ListChatsByUserService } from './application/usecases/list-chats-by-user/list.chats.by.user.service';
import { ListMessagesByChatService } from './application/usecases/list-messages-by-chat/list.messages.by.chat.service';
import { GetMessageService } from './application/usecases/get-message/get.message.service';
import { ChatQueryControllers } from './interfaces/http/controllers/chat-query.controllers';
import { MessageQueryControllers } from './interfaces/http/controllers/message-query.controllers';

@Module({
  imports: [ChatModule, MessagesModule, UsersModule],
  controllers: [ChatQueryControllers, MessageQueryControllers],
  providers: [
    ListChatsByUserService,
    ListMessagesByChatService,
    GetMessageService,
  ],
})
export class MessagingQueryModule {}
