import { v4 as uuidv4 } from 'uuid';

export interface ChatEntityProps {
  id?: string;
  userOneId: string;
  userTwoId: string;
}

export class ChatEntity {
  private id: string;
  private userOneId: string;
  private userTwoId: string;

  private constructor(props: ChatEntityProps) {
    if (!props.userOneId || !props.userTwoId) {
      throw new Error('User one and user two are required');
    }

    if (props.userOneId === props.userTwoId) {
      throw new Error('Users must be different');
    }

    this.id = props.id || uuidv4();
    this.userOneId = props.userOneId;
    this.userTwoId = props.userTwoId;
  }

  public getId(): string {
    return this.id;
  }

  public getUserOneId(): string {
    return this.userOneId;
  }

  public getUserTwoId(): string {
    return this.userTwoId;
  }

  public toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      userOneId: this.userOneId,
      userTwoId: this.userTwoId,
    };
  }

  public static create(props: ChatEntityProps): ChatEntity {
    return new ChatEntity(props);
  }

  validate(): void {
    if (!this.id) {
      throw new Error('Id is required');
    }
    if (!this.userOneId) {
      throw new Error('User one is required');
    }
    if (!this.userTwoId) {
      throw new Error('User two is required');
    }
  }
}
