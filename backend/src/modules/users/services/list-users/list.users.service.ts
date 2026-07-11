import { Inject, Injectable } from '@nestjs/common';
import type IUserRepository from '../../interfaces/user.repository.interface';
import { USER_REPOSITORY } from '../../infra/tokens/user.token.repository';

@Injectable()
export class ListUsersService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(): Promise<Record<string, unknown>[]> {
    const users = await this.userRepository.findAll();

    return users.map((user) => user.toJSON());
  }
}
