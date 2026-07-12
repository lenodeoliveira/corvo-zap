import { ApiError } from '@/api/client';
import { chatsService } from '@/services/chats.service';
import type { Chat } from '@/types/api';

function findChatWithUser(
  chats: Chat[],
  currentUserId: string,
  otherUserId: string,
): Chat | undefined {
  return chats.find(
    (chat) =>
      (chat.userOneId === currentUserId && chat.userTwoId === otherUserId) ||
      (chat.userOneId === otherUserId && chat.userTwoId === currentUserId),
  );
}

export async function getOrCreateChat(
  currentUserId: string,
  otherUserId: string,
  existingChats: Chat[] | undefined,
): Promise<Chat> {
  const existing = findChatWithUser(existingChats ?? [], currentUserId, otherUserId);

  if (existing) {
    return existing;
  }

  try {
    return await chatsService.create(currentUserId, otherUserId);
  } catch (error) {
    if (error instanceof ApiError && error.status === 400) {
      const chats = await chatsService.listMine();
      const found = findChatWithUser(chats, currentUserId, otherUserId);

      if (found) {
        return found;
      }
    }

    throw error;
  }
}
