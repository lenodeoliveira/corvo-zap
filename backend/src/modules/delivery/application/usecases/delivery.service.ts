import { Injectable } from '@nestjs/common';

export interface DeliverySchedule {
  departureAt: Date;
  arrivalAt: Date;
}

@Injectable()
export class DeliveryService {
  scheduleDelivery(travelTimeMinutes: number): DeliverySchedule {
    const departureAt = new Date();
    const arrivalAt = new Date(departureAt.getTime() + travelTimeMinutes * 60000);

    return {
      departureAt,
      arrivalAt,
    };
  }
}
