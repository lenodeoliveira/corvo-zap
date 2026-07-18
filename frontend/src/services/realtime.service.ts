import { io, type Socket } from 'socket.io-client';

import {
  REALTIME_CLIENT_EVENTS,
  REALTIME_EVENTS,
  type RealtimeEventPayload,
} from '@/realtime/realtime.events';
import { env } from '@/utils/env';
import type { Message } from '@/types/api';

type MessageEventHandler = (payload: RealtimeEventPayload) => void;

type MarkMessageReadResponse = {
  ok: true;
  message: Message;
};

let socket: Socket | null = null;

export const realtimeService = {
  connect(token: string): Socket {
    if (socket?.connected) {
      return socket;
    }

    socket?.disconnect();

    socket = io(`${env.apiUrl}/realtime`, {
      auth: { token: `Bearer ${token}` },
      transports: ['websocket'],
    });

    return socket;
  },

  disconnect(): void {
    socket?.disconnect();
    socket = null;
  },

  getSocket(): Socket | null {
    return socket;
  },

  isConnected(): boolean {
    return socket?.connected ?? false;
  },

  joinChat(chatId: string): void {
    socket?.emit(REALTIME_CLIENT_EVENTS.JOIN_CHAT, { chatId });
  },

  markMessageRead(messageId: string): Promise<MarkMessageReadResponse | undefined> {
    return new Promise((resolve) => {
      if (!socket?.connected) {
        resolve(undefined);
        return;
      }

      socket.emit(
        REALTIME_CLIENT_EVENTS.MARK_MESSAGE_READ,
        { messageId },
        (response: MarkMessageReadResponse | undefined) => {
          resolve(response);
        },
      );
    });
  },

  onMessageCreated(handler: MessageEventHandler): void {
    socket?.on(REALTIME_EVENTS.MESSAGE_CREATED, handler);
  },

  offMessageCreated(handler: MessageEventHandler): void {
    socket?.off(REALTIME_EVENTS.MESSAGE_CREATED, handler);
  },

  onMessageDelivered(handler: MessageEventHandler): void {
    socket?.on(REALTIME_EVENTS.MESSAGE_DELIVERED, handler);
  },

  offMessageDelivered(handler: MessageEventHandler): void {
    socket?.off(REALTIME_EVENTS.MESSAGE_DELIVERED, handler);
  },

  onMessageRead(handler: MessageEventHandler): void {
    socket?.on(REALTIME_EVENTS.MESSAGE_READ, handler);
  },

  offMessageRead(handler: MessageEventHandler): void {
    socket?.off(REALTIME_EVENTS.MESSAGE_READ, handler);
  },

  onConnect(handler: () => void): void {
    socket?.on('connect', handler);
  },

  offConnect(handler: () => void): void {
    socket?.off('connect', handler);
  },

  onDisconnect(handler: () => void): void {
    socket?.on('disconnect', handler);
  },

  offDisconnect(handler: () => void): void {
    socket?.off('disconnect', handler);
  },
};
