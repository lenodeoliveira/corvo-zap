import { UserEntity } from "src/modules/users/entities/user.entity";
import { UserModel } from "../model/user.model";
import { DeepPartial } from "typeorm";

export class UserMapper {
    static toModel(entity: UserEntity): DeepPartial<UserModel>{
        return {
            idUser: entity.getId(),
            name: entity.getName(),
            email: entity.getEmail(),
            password: entity.getPassword()
        }
    } 

    static toDomain(models: UserModel[]): UserEntity[] | [] {
        if (!models?.length) return []


        const users = models.map(model => {
            console.log('model', model.role, model.status)
            return UserEntity.create({
                id: model.idUser,
                name: model.name,
                email: model.email,
                passwordHash: model.password,
                role: model!.role!,
                status: model!.status!
            })
        })

        return users;
    }
}