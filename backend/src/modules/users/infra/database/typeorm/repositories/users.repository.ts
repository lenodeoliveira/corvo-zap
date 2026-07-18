import type IUserRepository from "@/modules/users/domain/repositories/interface-users/user.repository.interface";
import { UserSearchParams } from "@/modules/users/domain/repositories/interface-users/user-search.params";
import { Repository } from "typeorm";
import { UserModel } from "@/modules/users/infra/database/typeorm/models/user.model";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "@/modules/users/domain/entities/user.entity";
import { UserMapper } from "../../mapper/user.mapper.model";

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

    async searchPaginated(
        params: UserSearchParams,
    ): Promise<{ users: UserEntity[]; total: number }> {
        const { search, page, limit } = params;
        const queryBuilder = this.usersRepository.createQueryBuilder('user');

        if (search?.trim()) {
            const term = `%${search.trim().toLowerCase()}%`;
            queryBuilder.where(
                'LOWER(user.name) LIKE :term OR LOWER(user.email) LIKE :term',
                { term },
            );
        }

        queryBuilder
            .orderBy('user.name', 'ASC')
            .skip((page - 1) * limit)
            .take(limit);

        const [users, total] = await queryBuilder.getManyAndCount();

        return {
            users: UserMapper.toDomain(users),
            total,
        };
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