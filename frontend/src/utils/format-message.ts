import type { MessageTracking } from '@/types/api';

export function formatMessageTime(date: string): string {
  return new Date(date).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatArrivalLabel(date: string): string {
  const target = new Date(date);
  const today = new Date();
  const time = target.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  if (target.toDateString() === today.toDateString()) {
    return `Hoje, ${time}`;
  }

  return target.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatRemainingTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours > 0) {
    return `${hours}h ${remainingMinutes.toString().padStart(2, '0')}min`;
  }

  return `${remainingMinutes}min`;
}

export function getDistanceProgress(tracking: MessageTracking): {
  traveledKm: number;
  totalKm: number;
} {
  const totalKm = tracking.distanceKm;
  const traveledKm = Math.round((totalKm * tracking.progress) / 100);

  return { traveledKm, totalKm };
}
