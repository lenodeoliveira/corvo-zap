import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DeliveryService } from '@/modules/delivery/application/usecases/delivery.service';

describe('DeliveryService', () => {
  const service = new DeliveryService();

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-15T12:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('schedules arrival as departure plus travel time in minutes', () => {
    const schedule = service.scheduleDelivery(90);

    expect(schedule.departureAt).toEqual(new Date('2026-08-15T12:00:00.000Z'));
    expect(schedule.arrivalAt).toEqual(new Date('2026-08-15T13:30:00.000Z'));
  });

  it('allows zero travel time (same-city delivery)', () => {
    const schedule = service.scheduleDelivery(0);

    expect(schedule.departureAt).toEqual(schedule.arrivalAt);
  });
});
