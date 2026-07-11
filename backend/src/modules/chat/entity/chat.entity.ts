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
    this.id = props.id || uuidv4();
    this.userOneId = props.userOneId;
    this.userTwoId = props.userTwoId;
  }
  
  public static create(props: ChatEntityProps): ChatEntity {
    return new ChatEntity({
      id: props.id || uuidv4(),
      userOneId: props.userOneId,
      userTwoId: props.userTwoId,
    });
  }
}