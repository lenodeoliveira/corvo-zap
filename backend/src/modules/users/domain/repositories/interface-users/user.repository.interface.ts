import { UserEntity } from "../../entities/user.entity";
import { UserSearchParams } from "./user-search.params";
import type { EntityManager } from 'typeorm';

interface IUserRepository {
  findByEmail(email: string): Promise<UserEntity[] | null>;
  findById(id: string): Promise<UserEntity | null>;
  searchPaginated(
    params: UserSearchParams,
  ): Promise<{ users: UserEntity[]; total: number }>;
  create(user: UserEntity): Promise<void>;
  reserveCrow(id: string, manager?: EntityManager): Promise<boolean>;
  restoreCrow(id: string, manager?: EntityManager): Promise<void>;
}

export default IUserRepository;