import type { Chat, Message } from '@/types/api';

export function getOtherParticipantId(chat: Chat, currentUserId: string): string {
  return chat.userOneId === currentUserId ? chat.userTwoId : chat.userOneId;
}

export function getParticipantName(
  chat: Chat,
  currentUserId: string,
  fallback = 'Contato',
): string {
  if (chat.otherParticipantName?.trim()) {
    return chat.otherParticipantName;
  }

  const otherParticipantId = getOtherParticipantId(chat, currentUserId);
  const messageFromParticipant = chat.messages?.find(
    (message) => message.senderId === otherParticipantId,
  );

  if (messageFromParticipant?.senderName) {
    return messageFromParticipant.senderName;
  }

  const messageFromOther = chat.messages?.find(
    (message) => message.senderId !== currentUserId,
  );

  return messageFromOther?.senderName ?? fallback;
}

export function getLastMessage(chat: Chat): Message | undefined {
  const messages = chat.messages ?? [];

  if (messages.length === 0) {
    return undefined;
  }

  return [...messages].sort(
    (left, right) =>
      new Date(right.departureAt).getTime() - new Date(left.departureAt).getTime(),
  )[0];
}

export function getMessagePreview(
  message: Message | undefined,
  currentUserId: string,
): string {
  if (!message) {
    return 'Nenhuma mensagem ainda';
  }

  const isFromCurrentUser = message.senderId === currentUserId;
  const isTraveling = message.tracking.status === 'TRAVELING';

  if (!isFromCurrentUser && isTraveling) {
    return 'Você está prestes a receber um corvo, aguarde ele chegar';
  }

  if (isFromCurrentUser && isTraveling) {
    return message.content?.trim() || 'Mensagem enviada';
  }

  return message.content?.trim() || 'Mensagem entregue';
}

export function isIncomingTravelingMessage(
  message: Message | undefined,
  currentUserId: string,
): boolean {
  if (!message) {
    return false;
  }

  return (
    message.senderId !== currentUserId && message.tracking.status === 'TRAVELING'
  );
}

export function formatChatTimestamp(message: Message | undefined): string | null {
  if (!message) {
    return null;
  }

  const referenceDate =
    message.tracking.status === 'READ' && message.tracking.readAt
      ? new Date(message.tracking.readAt)
      : message.tracking.status === 'DELIVERED' && message.tracking.deliveredAt
        ? new Date(message.tracking.deliveredAt)
        : new Date(message.departureAt);

  const now = new Date();
  const diffMs = now.getTime() - referenceDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return referenceDate.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  if (diffDays === 1) {
    return 'Ontem';
  }

  return `${diffDays}d`;
}

export function filterChats(
  chats: Chat[],
  searchQuery: string,
  currentUserId: string,
): Chat[] {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  if (!normalizedQuery) {
    return chats;
  }

  return chats.filter((chat) => {
    const participantName = getParticipantName(chat, currentUserId).toLowerCase();
    const lastMessage = getLastMessage(chat);
    const preview = getMessagePreview(lastMessage, currentUserId).toLowerCase();

    return (
      participantName.includes(normalizedQuery) || preview.includes(normalizedQuery)
    );
  });
}
