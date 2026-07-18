import type { ChatEntity } from '@/modules/chat/domain/entities/chat.entity';
import type { MessageEntity } from '@/modules/messages/domain/entities/message.entity';

export class MessageCreatedEvent {
  constructor(
    readonly message: MessageEntity,
    readonly chat: ChatEntity,
    readonly senderName: string,
  ) {}
}
