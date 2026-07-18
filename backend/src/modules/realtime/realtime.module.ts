import { Module } from '@nestjs/common';
import { ChatModule } from '../chat/chat.module';
import { MessagesModule } from '../messages/messages.module';
import { UsersModule } from '../users/users.module';
import { ChatGateway } from './infra/gateways/chat.gateway';
import { WsJwtGuard } from './infra/guards/ws-jwt.guard';
import { MessageRealtimeService } from './application/services/message-realtime.service';
import { DeliverySchedulerService } from './application/services/delivery-scheduler.service';
import { MessageRealtimeListener } from './application/listeners/message-realtime.listener';
import { MessageDeliverySchedulerListener } from './application/listeners/message-delivery-scheduler.listener';

@Module({
  imports: [MessagesModule, ChatModule, UsersModule],
  providers: [
    WsJwtGuard,
    ChatGateway,
    MessageRealtimeService,
    DeliverySchedulerService,
    MessageRealtimeListener,
    MessageDeliverySchedulerListener,
  ],
  exports: [ChatGateway],
})
export class RealtimeModule {}
