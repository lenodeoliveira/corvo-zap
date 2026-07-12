import { UserEntity } from "../../entities/user.entity";
import { UserSearchParams } from "./user-search.params";

interface IUserRepository {
  findByEmail(email: string): Promise<UserEntity[] | null>;
  findById(id: string): Promise<UserEntity | null>;
  searchPaginated(
    params: UserSearchParams,
  ): Promise<{ users: UserEntity[]; total: number }>;
  create(user: UserEntity): Promise<void>;
}

export default IUserRepository;