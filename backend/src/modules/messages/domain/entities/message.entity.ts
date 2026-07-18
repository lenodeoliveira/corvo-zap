import { v4 as uuidv4 } from 'uuid';

export enum MessageStatus {
  TRAVELING = 'TRAVELING',
  DELIVERED = 'DELIVERED',
  READ = 'READ',
}

export interface MessageEntityProps {
  id?: string;
  chatId: string;
  senderId: string;
  status?: MessageStatus;
  encryptedContent: string;
  arrivalAt: Date;
  distanceKm: number;
  departureAt: Date;
  originCityId: string;
  destinationCityId: string;
  travelTimeMinutes: number;
  deliveredAt?: Date | null;
  readAt?: Date | null;
}

export class MessageEntity {
  private id: string;
  private chatId: string;
  private senderId: string;
  private encryptedContent: string;
  private status: MessageStatus;
  private arrivalAt: Date;
  private distanceKm: number;
  private departureAt: Date;
  private originCityId: string;
  private destinationCityId: string;
  private travelTimeMinutes: number;
  private deliveredAt: Date | null;
  private readAt: Date | null;

  private constructor(props: MessageEntityProps) {
    if (!props.chatId) {
      throw new Error('Chat id is required');
    }

    if (!props.senderId) {
      throw new Error('Sender id is required');
    }

    if (!props.encryptedContent?.trim()) {
      throw new Error('Encrypted content is required');
    }

    if (!props.arrivalAt) {
      throw new Error('Arrival date is required');
    }

    if (!props.departureAt) {
      throw new Error('Departure date is required');
    }

    if (props.distanceKm == null || props.distanceKm < 0) {
      throw new Error('Distance is required');
    }

    if (!props.originCityId) {
      throw new Error('Origin city id is required');
    }

    if (!props.destinationCityId) {
      throw new Error('Destination city id is required');
    }

    if (props.travelTimeMinutes == null || props.travelTimeMinutes < 0) {
      throw new Error('Travel time is required');
    }

    this.id = props.id || uuidv4();
    this.chatId = props.chatId;
    this.senderId = props.senderId;
    this.encryptedContent = props.encryptedContent.trim();
    this.status = props.status ?? MessageStatus.TRAVELING;
    this.arrivalAt = props.arrivalAt;
    this.distanceKm = props.distanceKm;
    this.departureAt = props.departureAt;
    this.originCityId = props.originCityId;
    this.destinationCityId = props.destinationCityId;
    this.travelTimeMinutes = props.travelTimeMinutes;
    this.deliveredAt = props.deliveredAt ?? null;
    this.readAt = props.readAt ?? null;
  }

  public getId(): string {
    return this.id;
  }

  public getChatId(): string {
    return this.chatId;
  }

  public getSenderId(): string {
    return this.senderId;
  }

  public getEncryptedContent(): string {
    return this.encryptedContent;
  }

  public getStatus(): MessageStatus {
    return this.status;
  }

  public getArrivalAt(): Date {
    return this.arrivalAt;
  }

  public getDistanceKm(): number {
    return this.distanceKm;
  }

  public getDepartureAt(): Date {
    return this.departureAt;
  }

  public getOriginCityId(): string {
    return this.originCityId;
  }

  public getDestinationCityId(): string {
    return this.destinationCityId;
  }

  public getTravelTimeMinutes(): number {
    return this.travelTimeMinutes;
  }

  public getDeliveredAt(): Date | null {
    return this.deliveredAt;
  }

  public getReadAt(): Date | null {
    return this.readAt;
  }

  public markAsDelivered(): void {
    if (this.status !== MessageStatus.TRAVELING) {
      return;
    }

    this.status = MessageStatus.DELIVERED;
    this.deliveredAt = new Date();
  }

  public markAsRead(readerId: string): void {
    if (readerId === this.senderId) {
      return;
    }

    if (this.status === MessageStatus.TRAVELING) {
      throw new Error('Message has not been delivered yet');
    }

    if (this.status === MessageStatus.READ) {
      return;
    }

    this.status = MessageStatus.READ;
    this.readAt = new Date();
  }

  public toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      chatId: this.chatId,
      senderId: this.senderId,
      encryptedContent: this.encryptedContent,
      status: this.status,
      arrivalAt: this.arrivalAt,
      distanceKm: this.distanceKm,
      departureAt: this.departureAt,
      originCityId: this.originCityId,
      destinationCityId: this.destinationCityId,
      travelTimeMinutes: this.travelTimeMinutes,
      deliveredAt: this.deliveredAt,
      readAt: this.readAt,
    };
  }

  public static send(props: MessageEntityProps): MessageEntity {
    return new MessageEntity(props);
  }

  validate(): void {
    if (!this.id) {
      throw new Error('Id is required');
    }
    if (!this.chatId) {
      throw new Error('Chat id is required');
    }
    if (!this.senderId) {
      throw new Error('Sender id is required');
    }
    if (!this.encryptedContent) {
      throw new Error('Encrypted content is required');
    }
    if (!this.arrivalAt) {
      throw new Error('Arrival date is required');
    }
    if (!this.departureAt) {
      throw new Error('Departure date is required');
    }
    if (this.distanceKm == null || this.distanceKm < 0) {
      throw new Error('Distance is required');
    }
    if (!this.originCityId) {
      throw new Error('Origin city id is required');
    }
    if (!this.destinationCityId) {
      throw new Error('Destination city id is required');
    }
    if (this.travelTimeMinutes == null || this.travelTimeMinutes < 0) {
      throw new Error('Travel time is required');
    }
    if (!Object.values(MessageStatus).includes(this.status)) {
      throw new Error('Invalid message status');
    }
  }
}
