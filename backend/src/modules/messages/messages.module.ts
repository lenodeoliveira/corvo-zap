import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageModel } from './infra/database/typeorm/models/message.model';
import { MessageControllers } from './interfaces/http/controllers/message.controllers';
import { CreateMessageService } from './application/usecases/create-message/create.message.service';
import { MessageViewService } from './application/usecases/message-view/message.view.service';
import { MESSAGE_REPOSITORY } from './infra/database/typeorm/tokens/message.token.repository';
import { MessagesRepository } from './infra/database/typeorm/repositories/messages.repository';
import { ChatModule } from '../chat/chat.module';
import { UsersModule } from '../users/users.module';
import { DeliveryModule } from '../delivery/delivery.module';
import { CryptoModule } from '../crypto/crypto.module';
import { CitiesModule } from '../cities/cities.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MessageModel]),
    ChatModule,
    UsersModule,
    DeliveryModule,
    CryptoModule,
    CitiesModule,
  ],
  controllers: [MessageControllers],
  providers: [
    CreateMessageService,
    MessageViewService,
    {
      provide: MESSAGE_REPOSITORY,
      useClass: MessagesRepository,
    },
  ],
  exports: [MESSAGE_REPOSITORY, MessageViewService],
})
export class MessagesModule {}
