import type IUserRepository from "src/modules/users/interfaces/user.repository.interface";
import { ILike, Repository } from "typeorm";
import { UserModel } from "@/modules/users/infra/database/sqlite/model/user.model";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/modules/users/entities/user.entity";
import { UserMapper } from "../mapper/user.mapper.model";

@Injectable()
export class UsersRepository implements IUserRepository {
    constructor(
        @InjectRepository(UserModel)
        private readonly usersRepository: Repository<UserModel>,
    ) { }

   async create(user: UserEntity): Promise<void> {
        const userModel = UserMapper.toModel(user)

        await this.usersRepository.save({
            idUser: userModel.idUser,
            name: userModel.name,
            email: userModel.email,
            password: userModel.password,
            role: userModel.role,
            status: userModel.status,
            cityId: userModel.cityId,
        });

        return;
    }

    async findByEmail(email: string): Promise<UserEntity[] | null> {
        const user = await this.usersRepository.findOne({
            where: {
                email: email
            },
        })
        if(!user) return null

        const userEntity = UserMapper.toDomain([user])

        return userEntity
    }

    async findAll(): Promise<UserEntity[]> {
        const users = await this.usersRepository.find();

        return UserMapper.toDomain(users);
    }

    async findById(id: string): Promise<UserEntity | null> {
        const user = await this.usersRepository.findOne({
            where: {
                idUser: id,
            },
        });

        if (!user) {
            return null;
        }

        const [userEntity] = UserMapper.toDomain([user]);

        return userEntity ?? null;
    }
}