import { api } from '@/api/client';
import type { Message } from '@/types/api';

export const messagesService = {
  listByChat: (chatId: string) => api.get<Message[]>(`/messages/chat/${chatId}`),

  getById: (id: string) => api.get<Message>(`/messages/${id}`),

  send: (chatId: string, content: string) =>
    api.post<Message>('/messages', { chatId, content }),
};
