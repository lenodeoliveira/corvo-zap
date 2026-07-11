import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModel } from "./infra/database/sqlite/model/user.model";
import { UsersControllers } from "./http/controllers/user.controllers";
import { CreateUserService } from "./services/create-user/create.user.service";
import { USER_REPOSITORY } from "./infra/tokens/user.token.repository";
import { UsersRepository } from "./infra/database/sqlite/repository/users.repository";
import { CRYPT_SERVICE } from "./infra/tokens/crypt.token.service";
import { CryptInfraService } from "./infra/services/crypt.infra.service";
import { AuthLoginService } from "./services/auth-service/auth.login.service";
import { AUTH_TOKEN_SERVICE } from "./infra/tokens/auth.token.service";
import { AuthTokenService } from "./infra/services/auth.token.service";
import { JwtAuthGuard } from "./infra/guards/jwt-auth.guard";
import { RolesGuard } from "./infra/guards/roles.guard";

@Module({
    imports: [TypeOrmModule.forFeature([UserModel])],
    controllers: [UsersControllers],
    providers: [ 
        AuthLoginService,
        CreateUserService,
        JwtAuthGuard,
        RolesGuard,
        {
            provide: USER_REPOSITORY,
            useClass: UsersRepository
        },
        {
            provide: CRYPT_SERVICE,
            useClass: CryptInfraService
        },
        {
            provide: AUTH_TOKEN_SERVICE,
            useClass: AuthTokenService
        }
    ],
    exports: [USER_REPOSITORY, AUTH_TOKEN_SERVICE, JwtAuthGuard, RolesGuard]
})

export class UsersModule { }