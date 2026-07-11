import { v4 as uuidv4 } from 'uuid';

export interface CityEntityProps {
  id?: string;
  name: string;
  x: number;
  y: number;
}

export class CityEntity {
  private id: string;
  private name: string;
  private x: number;
  private y: number;

  private constructor(props: CityEntityProps) {
    this.id = props.id || uuidv4();
    this.name = props.name;
    this.x = props.x;
    this.y = props.y;
  }

  getCoordinate(): { x: number, y: number, id: string } {
    return { x: this.x, y: this.y, id: this.id };
  }

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getX(): number {
    return this.x;
  }

  public getY(): number {
    return this.y;
  }

  public changeName(name: string): void {
    this.name = name;
  }

  public changeCoordinates(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }

  public toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      name: this.name,
      x: this.x,
      y: this.y,
    };
  }

  public static create(props: CityEntityProps): CityEntity {
    return new CityEntity(props);
  }

  validate(): void {
    if (!this.id) {
      throw new Error('Id is required');
    }
    if (!this.name) {
      throw new Error('Name is required');
    }
    if (this.x === undefined || this.x === null) {
      throw new Error('X coordinate is required');
    }
    if (this.y === undefined || this.y === null) {
      throw new Error('Y coordinate is required');
    }
  }
}
