import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { HttpException, Logger } from '@nestjs/common';
import type { Server, Socket } from 'socket.io';
import type { AuthUserPayload } from '@/modules/auth/domain/@types/auth-user.interface';
import { ChatParticipantService } from '@/modules/chat/application/services/chat-participant.service';
import { MarkMessageAsReadService } from '@/modules/messages/application/usecases/mark-message-as-read/mark.message.as.read.service';
import type { MessageView } from '@/modules/messages/application/usecases/message-view/message.view.service';
import { WsJwtGuard } from '../guards/ws-jwt.guard';
import {
  REALTIME_CLIENT_EVENTS,
  type RealtimeEventPayload,
} from '../../constants/realtime.events';

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
    private readonly markMessageAsReadService: MarkMessageAsReadService,
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

  @SubscribeMessage(REALTIME_CLIENT_EVENTS.JOIN_CHAT)
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

  @SubscribeMessage(REALTIME_CLIENT_EVENTS.MARK_MESSAGE_READ)
  async handleMarkMessageRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { messageId: string },
  ): Promise<{ ok: true; message: MessageView }> {
    const user = client.data.user as AuthUserPayload;

    if (!payload?.messageId?.trim()) {
      throw new WsException('messageId is required');
    }

    try {
      const message = await this.markMessageAsReadService.execute(
        payload.messageId,
        user.id,
      );

      return { ok: true, message };
    } catch (error) {
      if (error instanceof HttpException) {
        throw new WsException(error.getResponse());
      }

      this.logger.error('Failed to mark message as read via WebSocket', {
        messageId: payload.messageId,
        userId: user.id,
        error: error instanceof Error ? error.message : 'unknown',
      });

      throw new WsException('Failed to mark message as read');
    }
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
