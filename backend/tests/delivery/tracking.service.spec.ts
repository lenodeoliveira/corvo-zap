import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TrackingService } from '@/modules/delivery/application/usecases/tracking.service';

describe('TrackingService', () => {
  const service = new TrackingService();

  const departureAt = new Date('2026-08-15T12:00:00.000Z');
  const arrivalAt = new Date('2026-08-15T14:00:00.000Z'); // 120 minutes
  const props = {
    distanceKm: 100,
    travelTimeMinutes: 120,
    departureAt,
    arrivalAt,
  };

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns zero progress at departure', () => {
    vi.setSystemTime(departureAt);

    expect(service.track(props)).toEqual({
      progress: 0,
      traveledDistanceKm: 0,
      remainingDistanceKm: 100,
      remainingMinutes: 120,
    });
  });

  it('returns mid-flight progress halfway through the journey', () => {
    vi.setSystemTime(new Date('2026-08-15T13:00:00.000Z'));

    expect(service.track(props)).toEqual({
      progress: 50,
      traveledDistanceKm: 50,
      remainingDistanceKm: 50,
      remainingMinutes: 60,
    });
  });

  it('caps progress at 100 after arrival', () => {
    vi.setSystemTime(new Date('2026-08-15T15:00:00.000Z'));

    expect(service.track(props)).toEqual({
      progress: 100,
      traveledDistanceKm: 100,
      remainingDistanceKm: 0,
      remainingMinutes: 0,
    });
  });

  it('clamps progress to zero before departure', () => {
    vi.setSystemTime(new Date('2026-08-15T11:00:00.000Z'));

    expect(service.track(props)).toEqual({
      progress: 0,
      traveledDistanceKm: 0,
      remainingDistanceKm: 100,
      remainingMinutes: 180,
    });
  });
});
