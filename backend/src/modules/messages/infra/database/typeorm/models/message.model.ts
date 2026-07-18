import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('tb_messages')
export class MessageModel {
  @PrimaryColumn()
  id!: string;

  @Column({ name: 'chat_id' })
  chatId!: string;

  @Column({ name: 'sender_id' })
  senderId!: string;

  @Column({ name: 'encrypted_content' })
  encryptedContent!: string;

  @Column({ default: 'TRAVELING' })
  status!: string;

  @Column({ name: 'arrival_at', type: 'datetime' })
  arrivalAt!: Date;

  @Column({ name: 'distance_km', type: 'real' })
  distanceKm!: number;

  @Column({ name: 'departure_at', type: 'datetime' })
  departureAt!: Date;

  @Column({ name: 'origin_city_id' })
  originCityId!: string;

  @Column({ name: 'destination_city_id' })
  destinationCityId!: string;

  @Column({ name: 'travel_time_minutes', type: 'integer' })
  travelTimeMinutes!: number;

  @Column({ name: 'delivered_at', type: 'datetime', nullable: true })
  deliveredAt?: Date | null;

  @Column({ name: 'read_at', type: 'datetime', nullable: true })
  readAt?: Date | null;

  @Column({ name: 'created_at', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ name: 'updated_at', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;
}
