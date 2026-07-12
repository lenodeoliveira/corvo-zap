import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from './infra/database/typeorm/models/user.model';
import { UsersControllers } from './interfaces/http/controllers/user.controllers';
import { CreateUserService } from './application/usecases/create-users/create.user.service';
import { USER_REPOSITORY } from './infra/database/typeorm/tokens/user.token.repository';
import { UsersRepository } from './infra/database/typeorm/repositories/users.repository';
import { ListUsersService } from './application/usecases/get-all-users/list.users.service';
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
