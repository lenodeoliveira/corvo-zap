import { UserEntity } from "src/modules/users/domain/entities/user.entity";
import { UserModel } from "@/modules/users/infra/database/typeorm/models/user.model";
import { DeepPartial } from "typeorm";

export class UserMapper {
    static toModel(entity: UserEntity): DeepPartial<UserModel>{
        return {
            idUser: entity.getId(),
            name: entity.getName(),
            email: entity.getEmail(),
            password: entity.getPassword(),
            cityId: entity.getCityId(),
        }
    } 

    static toDomain(models: UserModel[]): UserEntity[] | [] {
        if (!models?.length) return []


        const users = models.map(model => {
            return UserEntity.create({
                id: model.idUser,
                name: model.name,
                email: model.email,
                passwordHash: model.password,
                role: model!.role!,
                status: model!.status!,
                cityId: model.cityId,
            })
        })

        return users;
    }
}