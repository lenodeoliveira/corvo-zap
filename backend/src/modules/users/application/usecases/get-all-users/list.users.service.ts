import { Inject, Injectable } from '@nestjs/common';
import type IUserRepository from '../../../domain/repositories/interface-users/user.repository.interface';
import { PaginatedUsers } from '../../../domain/repositories/interface-users/user-search.params';
import { USER_REPOSITORY } from '../../../infra/database/typeorm/tokens/user.token.repository';

type ListUsersInput = {
  search?: string;
  page?: number;
  limit?: number;
};

@Injectable()
export class ListUsersService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(input: ListUsersInput = {}): Promise<PaginatedUsers<Record<string, unknown>>> {
    const page = input.page ?? 1;
    const limit = input.limit ?? 20;

    const { users, total } = await this.userRepository.searchPaginated({
      search: input.search,
      page,
      limit,
    });

    return {
      data: users.map((user) => user.toJSON()),
      meta: {
        page,
        limit,
        total,
        totalPages: total === 0 ? 0 : Math.ceil(total / limit),
      },
    };
  }
}
