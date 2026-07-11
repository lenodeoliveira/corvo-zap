import { UserEntity } from "../entities/user.entity";
import { UserModel } from "../infra/database/sqlite/model/user.model";

interface IUserRepository {
  findByEmail(email: string): Promise<UserEntity[] | null>;
  findById(id: string): Promise<UserEntity | null>;
  findAll(): Promise<UserEntity[]>;
  create(user: UserEntity): Promise<void>;
}

export default IUserRepository;