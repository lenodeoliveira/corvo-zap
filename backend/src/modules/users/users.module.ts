import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from './infra/database/sqlite/model/user.model';
import { UsersControllers } from './http/controllers/user.controllers';
import { CreateUserService } from './services/create-user/create.user.service';
import { USER_REPOSITORY } from './infra/tokens/user.token.repository';
import { UsersRepository } from './infra/database/sqlite/repository/users.repository';
import { ListUsersService } from './services/list-users/list.users.service';
import { PasswordModule } from '../password/password.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserModel]), PasswordModule],
  controllers: [UsersControllers],
  providers: [
    CreateUserService,
    ListUsersService,
    {
      provide: USER_REPOSITORY,
      useClass: UsersRepository,
    },
  ],
  exports: [USER_REPOSITORY],
})
export class UsersModule {}
