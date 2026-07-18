import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import type { Server, Socket } from 'socket.io';
import type { AuthUserPayload } from '@/modules/auth/domain/@types/auth-user.interface';
import { ChatParticipantService } from '@/modules/chat/application/services/chat-participant.service';
import { WsJwtGuard } from '../guards/ws-jwt.guard';
import type { RealtimeEventPayload } from '../../constants/realtime.events';

@WebSocketGateway({
  namespace: '/realtime',
  cors: {
    origin: true,
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(ChatGateway.name);

  @WebSocketServer()
  private server!: Server;

  constructor(
    private readonly wsJwtGuard: WsJwtGuard,
    private readonly chatParticipantService: ChatParticipantService,
  ) {}

  handleConnection(client: Socket): void {
    try {
      const user = this.wsJwtGuard.validate(client);
      client.data.user = user;
      client.join(this.getUserRoom(user.id));
      this.logger.debug(`Client connected: user=${user.id}`);
    } catch (error) {
      this.logger.warn('WebSocket connection rejected', {
        reason: error instanceof Error ? error.message : 'unknown',
      });
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket): void {
    const user = client.data.user as AuthUserPayload | undefined;

    if (user?.id) {
      this.logger.debug(`Client disconnected: user=${user.id}`);
    }
  }

  @SubscribeMessage('joinChat')
  async handleJoinChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { chatId: string },
  ): Promise<{ ok: boolean }> {
    const user = client.data.user as AuthUserPayload;

    await this.chatParticipantService.requireById(payload.chatId, user.id, {
      forbiddenMessage: 'You can only join chats you participate in',
    });

    client.join(this.getChatRoom(payload.chatId));

    return { ok: true };
  }

  emitToUser(
    userId: string,
    event: string,
    payload: RealtimeEventPayload,
  ): void {
    this.server.to(this.getUserRoom(userId)).emit(event, payload);
  }

  emitToChat(
    chatId: string,
    event: string,
    payload: RealtimeEventPayload,
  ): void {
    this.server.to(this.getChatRoom(chatId)).emit(event, payload);
  }

  private getUserRoom(userId: string): string {
    return `user:${userId}`;
  }

  private getChatRoom(chatId: string): string {
    return `chat:${chatId}`;
  }
}
