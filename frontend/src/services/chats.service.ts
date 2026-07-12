import { api } from '@/api/client';
import type { Chat } from '@/types/api';

export const chatsService = {
  listMine: () => api.get<Chat[]>('/chats/me'),

  create: (userOneId: string, userTwoId: string) =>
    api.post<Chat>('/chats', { userOneId, userTwoId }),
};
