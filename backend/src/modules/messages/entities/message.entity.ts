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
  content: string;
  status?: MessageStatus;
}

export class MessageEntity {
  private id: string;
  private chatId: string;
  private senderId: string;
  private content: string;
  private status: MessageStatus;

  private constructor(props: MessageEntityProps) {
    if (!props.chatId) {
      throw new Error('Chat id is required');
    }

    if (!props.senderId) {
      throw new Error('Sender id is required');
    }

    if (!props.content?.trim()) {
      throw new Error('Content is required');
    }

    this.id = props.id || uuidv4();
    this.chatId = props.chatId;
    this.senderId = props.senderId;
    this.content = props.content.trim();
    this.status = props.status ?? MessageStatus.TRAVELING;
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

  public getContent(): string {
    return this.content;
  }

  public getStatus(): MessageStatus {
    return this.status;
  }

  public toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      chatId: this.chatId,
      senderId: this.senderId,
      content: this.content,
      status: this.status,
    };
  }

  public static create(props: MessageEntityProps): MessageEntity {
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
    if (!this.content) {
      throw new Error('Content is required');
    }
    if (!Object.values(MessageStatus).includes(this.status)) {
      throw new Error('Invalid message status');
    }
  }
}
