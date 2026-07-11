import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageModel } from './infra/database/sqlite/model/message.model';
import { MessageControllers } from './http/controllers/message.controllers';
import { CreateMessageService } from './services/create-message/create.message.service';
import { GetMessageService } from './services/get-message/get.message.service';
import { ListMessagesByChatService } from './services/list-messages-by-chat/list.messages.by.chat.service';
import { MessageViewService } from './services/message-view/message.view.service';
import { MESSAGE_REPOSITORY } from './infra/tokens/message.token.repository';
import { MessagesRepository } from './infra/database/sqlite/repository/messages.repository';
import { ChatModule } from '../chat/chat.module';
import { UsersModule } from '../users/users.module';
import { DeliveryModule } from '../delivery/delivery.module';
import { CryptoModule } from '../crypto/crypto.module';
import { CitiesModule } from '../cities/cities.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MessageModel]),
    forwardRef(() => ChatModule),
    UsersModule,
    DeliveryModule,
    CryptoModule,
    CitiesModule,
  ],
  controllers: [MessageControllers],
  providers: [
    CreateMessageService,
    GetMessageService,
    ListMessagesByChatService,
    MessageViewService,
    {
      provide: MESSAGE_REPOSITORY,
      useClass: MessagesRepository,
    },
  ],
  exports: [MESSAGE_REPOSITORY, MessageViewService],
})
export class MessagesModule {}
