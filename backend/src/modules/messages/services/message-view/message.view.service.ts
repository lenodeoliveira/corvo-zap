import { Injectable } from '@nestjs/common';
import { MessageEntity } from '../../entities/message.entity';
import { DeliveryStatus } from '@/modules/delivery/services/delivery.service';
import { TrackingService } from '@/modules/delivery/services/tracking.service';
import { CryptoMessageService } from '@/modules/crypto/crypto.message.service';

export interface MessageTracking {
  status: DeliveryStatus;
  progress: number;
  distanceKm: number;
  arrivalAt: Date;
  remainingMinutes: number;
  deliveredAt: Date | null;
}

export interface MessageView {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  canRead: boolean;
  departureAt: Date;
  originCityId: string;
  destinationCityId: string;
  travelTimeMinutes: number;
  content: string;
  tracking: MessageTracking;
}

@Injectable()
export class MessageViewService {
  constructor(
    private readonly trackingService: TrackingService,
    private readonly cryptoMessageService: CryptoMessageService,
  ) {}

  toView(
    message: MessageEntity,
    viewerUserId: string,
    senderName: string,
  ): MessageView {
    const isSender = message.getSenderId() === viewerUserId;
    const tracking = this.buildTracking(message);

    const base = {
      id: message.getId(),
      chatId: message.getChatId(),
      senderId: message.getSenderId(),
      senderName,
      canRead: tracking.status === DeliveryStatus.DELIVERED,
      departureAt: message.getDepartureAt(),
      originCityId: message.getOriginCityId(),
      destinationCityId: message.getDestinationCityId(),
      travelTimeMinutes: message.getTravelTimeMinutes(),
      tracking,
    };

    if (isSender) {
      return {
        ...base,
        content: this.cryptoMessageService.decrypt(
          message.getEncryptedContent(),
        ),
      };
    }

    if (tracking.status === DeliveryStatus.TRAVELING) {
      return {
        ...base,
        content: 'Your raven is still flying.',
      };
    }

    return {
      ...base,
      content: this.cryptoMessageService.decrypt(
        message.getEncryptedContent(),
      ),
    };
  }

  private buildTracking(message: MessageEntity): MessageTracking {
    const tracking = this.trackingService.track({
      distanceKm: message.getDistanceKm(),
      travelTimeMinutes: message.getTravelTimeMinutes(),
      departureAt: message.getDepartureAt(),
      arrivalAt: message.getArrivalAt(),
    });

    return {
      status: tracking.status,
      progress: tracking.progress,
      distanceKm: message.getDistanceKm(),
      arrivalAt: message.getArrivalAt(),
      remainingMinutes: tracking.remainingMinutes,
      deliveredAt:
        tracking.status === DeliveryStatus.DELIVERED
          ? message.getArrivalAt()
          : null,
    };
  }
}
