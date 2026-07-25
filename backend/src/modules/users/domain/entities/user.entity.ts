import { v4 as uuidv4 } from 'uuid';

export interface UserEntityProps {
  id?: string;
  name: string;
  email: string;
  passwordHash: string;
  role: string;
  status: string;
  cityId?: string;
  availableCrows?: number;
}

export class UserEntity {
  private id: string;
  private name: string;
  private email: string;
  private role: string;
  private status: string;
  private passwordHash: string;
  private cityId?: string;
  private availableCrows: number;

  private constructor(props: UserEntityProps) {
    this.id = props.id || uuidv4();
    this.name = props.name;
    this.email = props.email;
    this.passwordHash = props.passwordHash;
    this.role = props.role;
    this.status = props.status;
    this.cityId = props.cityId;
    this.availableCrows = props.availableCrows ?? 3;
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

  public getCityId(): string | undefined {
    return this.cityId;
  }

  public changeCityId(cityId: string): void {
    this.cityId = cityId;
  }

  public getAvailableCrows(): number {
    return this.availableCrows;
  }

  public incrementAvailableCrows(): void {
    this.availableCrows++;
    if (this.availableCrows > 3) {
      this.availableCrows = 3;
    }
  }

  public resetAvailableCrows(): void {
    this.availableCrows = 3;
  }

  public isAvailableCrows(): boolean {
    return this.availableCrows > 0;
  }

  public decrementAvailableCrowsIfAvailable(): void {
    if (this.isAvailableCrows()) {
      this.availableCrows--;
    }
  }

  public decrementAvailableCrows(): void {
    this.availableCrows--;
  }

  public toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      cityId: this.cityId,
      availableCrows: this.availableCrows,
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
