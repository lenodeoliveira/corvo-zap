import { v4 as uuidv4 } from 'uuid';

export interface UserEntityProps {
  id?: string;
  name: string;
  email: string;
  passwordHash: string;
  role: string;
  status: string;
}

export class UserEntity {
  private id: string;
  private name: string;
  private email: string;
  private role: string;
  private status: string;
  private passwordHash: string;

  private constructor(props: UserEntityProps) {
    this.id = props.id || uuidv4();
    this.name = props.name;
    this.email = props.email;
    this.passwordHash = props.passwordHash;
    this.role = props.role;
    this.status = props.status;
  }

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }
  
  public getEmail(): string {
    return this.email;
  }

  public getPassword(): string {
    return this.passwordHash;
  }

  public changeName(name: string): void {
    this.name = name;
  }

  public changeEmail(email: string): void {
    this.email = email;
  }

  public changePassword(password: string): void {
    this.passwordHash = password;
  }

  public getRole(): string {
    return this.role;
  }

  public getStatus(): string {
    return this.status;
  }

  public toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
    };
  }

  public static create(props: UserEntityProps): UserEntity {
    return new UserEntity(props);
  }

  validate(): void {
    if (!this.id) {
      throw new Error('Id is required');
    }
    if (!this.name) {
      throw new Error('Name is required');
    }
    if (!this.email) {
      throw new Error('Email is required');
    }
    if (!this.passwordHash) {
      throw new Error('Password is required');
    }
  }
}
