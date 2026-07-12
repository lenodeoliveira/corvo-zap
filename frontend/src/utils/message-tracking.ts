import type { Chat, Message, MessageTracking } from '@/types/api';

export type LiveTracking = Pick<
  MessageTracking,
  'status' | 'progress' | 'remainingMinutes' | 'distanceKm'
>;

export function computeLiveTracking(
  departureAt: string,
  arrivalAt: string,
  distanceKm: number,
): LiveTracking {
  const departureMs = new Date(departureAt).getTime();
  const arrivalMs = new Date(arrivalAt).getTime();
  const total = arrivalMs - departureMs;
  const elapsed = Date.now() - departureMs;
  const progressRatio = total <= 0 ? 1 : Math.max(0, Math.min(elapsed / total, 1));

  return {
    status: progressRatio >= 1 ? 'DELIVERED' : 'TRAVELING',
    progress: Math.round(progressRatio * 100),
    remainingMinutes: Math.max(0, Math.ceil((arrivalMs - Date.now()) / 60_000)),
    distanceKm,
  };
}

function getRefetchIntervalFromArrivalTimes(arrivalTimesMs: number[]): number | false {
  if (arrivalTimesMs.length === 0) {
    return false;
  }

  const now = Date.now();
  const minRemainingMs = Math.min(
    ...arrivalTimesMs.map((arrivalMs) => Math.max(0, arrivalMs - now)),
  );

  if (minRemainingMs <= 60_000) {
    return 3_000;
  }

  if (minRemainingMs <= 5 * 60_000) {
    return 10_000;
  }

  return 30_000;
}

function getTravelingArrivalTimes(messages: Message[]): number[] {
  return messages
    .filter((message) => {
      const live = computeLiveTracking(
        message.departureAt,
        message.tracking.arrivalAt,
        message.tracking.distanceKm,
      );

      return live.status === 'TRAVELING';
    })
    .map((message) => new Date(message.tracking.arrivalAt).getTime());
}

export function getMessagesRefetchInterval(messages: Message[] | undefined): number | false {
  if (!messages?.length) {
    return false;
  }

  return getRefetchIntervalFromArrivalTimes(getTravelingArrivalTimes(messages));
}

export function getChatsRefetchInterval(chats: Chat[] | undefined): number | false {
  if (!chats?.length) {
    return false;
  }

  const arrivalTimesMs = chats.flatMap((chat) =>
    getTravelingArrivalTimes(chat.messages ?? []),
  );

  if (arrivalTimesMs.length === 0) {
    return false;
  }

  const now = Date.now();
  const minRemainingMs = Math.min(
    ...arrivalTimesMs.map((arrivalMs) => Math.max(0, arrivalMs - now)),
  );

  if (minRemainingMs <= 60_000) {
    return 5_000;
  }

  if (minRemainingMs <= 5 * 60_000) {
    return 15_000;
  }

  return 30_000;
}
