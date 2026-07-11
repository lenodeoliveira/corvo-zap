import { UserEntity } from "../entities/user.entity";
import { UserModel } from "../infra/database/sqlite/model/user.model";

interface IUserRepository {
  findByEmail(email: string): Promise<UserEntity[] | null>;
  create(user: UserEntity): Promise<void>;
}

export default IUserRepository;