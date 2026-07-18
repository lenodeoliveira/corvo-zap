export const REALTIME_EVENTS = {
  MESSAGE_CREATED: 'message.created',
  MESSAGE_DELIVERED: 'message.delivered',
  MESSAGE_READ: 'message.read',
} as const;

export const REALTIME_CLIENT_EVENTS = {
  JOIN_CHAT: 'joinChat',
  MARK_MESSAGE_READ: 'markMessageRead',
} as const;

export type RealtimeEventPayload = {
  chatId: string;
  message: Record<string, unknown>;
};
