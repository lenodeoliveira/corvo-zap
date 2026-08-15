import { describe, expect, it } from 'vitest';
import { DistanceService } from '@/modules/delivery/application/usecases/distance.service';

describe('DistanceService', () => {
  const service = new DistanceService();

  it('returns zero distance and travel time for the same coordinates', () => {
    const result = service.calculate({ x: 10, y: 20 }, { x: 10, y: 20 });

    expect(result).toEqual({
      distanceKm: 0,
      travelTimeMinutes: 0,
    });
  });

  it('converts map units to km with scale 5 and raven speed 80 km/h', () => {
    // Euclidean distance 5 → 25 km → round((25 / 80) * 60) = 19 min
    const result = service.calculate({ x: 0, y: 0 }, { x: 3, y: 4 });

    expect(result).toEqual({
      distanceKm: 25,
      travelTimeMinutes: 19,
    });
  });

  it('rounds distance and travel time to nearest integers', () => {
    // Euclidean ≈ 1.414 → 7 km → round((7 / 80) * 60) = 5 min
    const result = service.calculate({ x: 0, y: 0 }, { x: 1, y: 1 });

    expect(result).toEqual({
      distanceKm: 7,
      travelTimeMinutes: 5,
    });
  });
});
