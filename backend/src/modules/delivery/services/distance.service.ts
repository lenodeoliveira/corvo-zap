import { Injectable } from '@nestjs/common';

export interface Coordinate {
  x: number;
  y: number;
}

export interface DistanceResult {
  distanceKm: number;
  travelTimeMinutes: number;
}

@Injectable()
export class DistanceService {
  private static readonly MAP_SCALE = 5; // 1 unidade = 5 km
  private static readonly RAVEN_SPEED_KMH = 80;

  calculate(
    origin: Coordinate,
    destination: Coordinate,
  ): DistanceResult {
    const distance = this.calculateEuclideanDistance(origin, destination);

    const distanceKm = this.calculateDistanceKm(distance);

    const travelTimeMinutes =
      this.calculateTravelTimeMinutes(distanceKm);

    return {
      distanceKm,
      travelTimeMinutes,
    };
  }

  private calculateEuclideanDistance(
    origin: Coordinate,
    destination: Coordinate,
  ): number {
    const dx = destination.x - origin.x;
    const dy = destination.y - origin.y;

    return Math.sqrt(dx ** 2 + dy ** 2);
  }

  private calculateDistanceKm(distance: number): number {
    return Math.round(distance * DistanceService.MAP_SCALE);
  }

  private calculateTravelTimeMinutes(distanceKm: number): number {
    return Math.round(
      (distanceKm / DistanceService.RAVEN_SPEED_KMH) * 60,
    );
  }
}