import { Injectable } from '@nestjs/common';

interface TrackingProps {
  distanceKm: number;
  travelTimeMinutes: number;
  departureAt: Date;
  arrivalAt: Date;
}

export interface TrackingProgress {
  progress: number;
  traveledDistanceKm: number;
  remainingDistanceKm: number;
  remainingMinutes: number;
}

@Injectable()
export class TrackingService {
  track(props: TrackingProps): TrackingProgress {
    const total = props.arrivalAt.getTime() - props.departureAt.getTime();
    const elapsed = Date.now() - props.departureAt.getTime();

    const progress = Math.max(0, Math.min(elapsed / total, 1));

    return {
      progress: Math.round(progress * 100),
      traveledDistanceKm: Math.round(props.distanceKm * progress),
      remainingDistanceKm: Math.round(
        props.distanceKm - props.distanceKm * progress,
      ),
      remainingMinutes: Math.max(
        0,
        Math.ceil((props.arrivalAt.getTime() - Date.now()) / 60000),
      ),
    };
  }
}
