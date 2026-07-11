import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('tb_users')
export class UserModel {
    @PrimaryColumn()
    idUser!: string;

    @Column({name: 'name'})
    name!: string;

    @Column({name: 'email'})
    email!: string;

    @Column({name: 'password'})
    password!: string;

    @Column({ name: 'role', nullable: true, default: 'user' })
    role?: string;

    @Column({ name: 'status', nullable: true, default: 'active' })
    status?: string;

    @Column({ name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
    createdAt!: Date;

    @Column({ name: 'updated_at', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt!: Date;

}
