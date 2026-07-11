import { Injectable } from "@nestjs/common";

export enum DeliveryStatus {
    TRAVELING = 'TRAVELING',
    DELIVERED = 'DELIVERED'
}

export interface Delivery {
    departureAt: Date
    arrivalAt: Date
    status: DeliveryStatus
}

@Injectable()
export class DeliveryService {
    scheduleDelivery(travelTimeMinutes: number): Delivery {
        const departureAt = new Date();
        const arrivalAt = new Date(departureAt.getTime() + travelTimeMinutes * 60000);
        return {
            departureAt,
            arrivalAt,
            status: DeliveryStatus.TRAVELING,
        };
    }

    getStatus(arrivalAt: Date): DeliveryStatus {
        return arrivalAt <= new Date()
        ? DeliveryStatus.DELIVERED
        : DeliveryStatus.TRAVELING;
    }
}