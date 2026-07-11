import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('tb_cities')
export class CityModel {
  @PrimaryColumn()
  id!: string;

  @Column()
  name!: string;

  @Column({ type: 'real' })
  x!: number;

  @Column({ type: 'real' })
  y!: number;
}
