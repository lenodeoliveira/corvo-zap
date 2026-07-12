import type { Chat, User } from '@/types/api';

export function getUsersWithoutChat(
  users: User[],
  chats: Chat[],
  currentUserId: string,
): User[] {
  const participantIds = new Set(
    chats.map((chat) =>
      chat.userOneId === currentUserId ? chat.userTwoId : chat.userOneId,
    ),
  );

  return users.filter((user) => user.id !== currentUserId && !participantIds.has(user.id));
}
