import { Injectable } from '@nestjs/common';
import {
  MessageEntity,
  MessageStatus,
} from '../../../domain/entities/message.entity';
import { TrackingService } from '@/modules/delivery/application/usecases/tracking.service';
import { CryptoMessageService } from '@/modules/crypto/domain/service/crypto.message.service';

export interface MessageTracking {
  status: MessageStatus;
  progress: number;
  distanceKm: number;
  arrivalAt: Date;
  remainingMinutes: number;
  deliveredAt: Date | null;
  readAt: Date | null;
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
    const canRead =
      tracking.status === MessageStatus.DELIVERED ||
      tracking.status === MessageStatus.READ;

    const base = {
      id: message.getId(),
      chatId: message.getChatId(),
      senderId: message.getSenderId(),
      senderName,
      canRead,
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

    if (tracking.status === MessageStatus.TRAVELING) {
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
    const status = message.getStatus();

    if (status === MessageStatus.TRAVELING) {
      const tracking = this.trackingService.track({
        distanceKm: message.getDistanceKm(),
        travelTimeMinutes: message.getTravelTimeMinutes(),
        departureAt: message.getDepartureAt(),
        arrivalAt: message.getArrivalAt(),
      });

      return {
        status,
        progress: tracking.progress,
        distanceKm: message.getDistanceKm(),
        arrivalAt: message.getArrivalAt(),
        remainingMinutes: tracking.remainingMinutes,
        deliveredAt: null,
        readAt: null,
      };
    }

    return {
      status,
      progress: 100,
      distanceKm: message.getDistanceKm(),
      arrivalAt: message.getArrivalAt(),
      remainingMinutes: 0,
      deliveredAt: message.getDeliveredAt(),
      readAt: message.getReadAt(),
    };
  }
}
