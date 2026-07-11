import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('tb_messages')
export class MessageModel {
  @PrimaryColumn()
  id!: string;

  @Column({ name: 'chat_id' })
  chatId!: string;

  @Column({ name: 'sender_id' })
  senderId!: string;

  @Column()
  content!: string;

  @Column({ default: 'TRAVELING' })
  status!: string;

  @Column({ name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ name: 'updated_at', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;
}
