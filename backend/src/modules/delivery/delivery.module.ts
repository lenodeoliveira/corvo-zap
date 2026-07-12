import { Module } from '@nestjs/common';
import { DeliveryService } from './application/usecases/delivery.service';
import { TrackingService } from './application/usecases/tracking.service';
import { DistanceService } from './application/usecases/distance.service';

@Module({
  providers: [DeliveryService, TrackingService, DistanceService],
  exports: [DeliveryService, TrackingService, DistanceService],
})
export class DeliveryModule {}
