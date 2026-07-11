import { Module } from "@nestjs/common";
import { DeliveryService } from "./services/delivery.service";
import { TrackingService } from "./services/tracking.service";
import { DistanceService } from "./services/distance.service";

@Module({
  providers: [DeliveryService, TrackingService, DistanceService],
  exports: [DeliveryService, TrackingService, DistanceService],
})
export class DeliveryModule {}  