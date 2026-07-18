import type { Message } from '@/types/api';

export function mergeMessageIntoList(
  messages: Message[] | undefined,
  incoming: Message,
): Message[] {
  const next = messages ? [...messages] : [];
  const index = next.findIndex((message) => message.id === incoming.id);

  if (index === -1) {
    next.push(incoming);
  } else {
    next[index] = incoming;
  }

  return next.sort(
    (left, right) =>
      new Date(left.departureAt).getTime() - new Date(right.departureAt).getTime(),
  );
}
