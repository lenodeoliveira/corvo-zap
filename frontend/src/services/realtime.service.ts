import { io, type Socket } from 'socket.io-client';

import { REALTIME_EVENTS, type RealtimeEventPayload } from '@/realtime/realtime.events';
import { env } from '@/utils/env';

type MessageEventHandler = (payload: RealtimeEventPayload) => void;

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
    socket?.emit('joinChat', { chatId });
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
