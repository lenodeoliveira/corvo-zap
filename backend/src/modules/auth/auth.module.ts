import { Global, Module } from '@nestjs/common';
import { AuthControllers } from './interfaces/http/controllers/auth.controllers';
import { AuthLoginService } from './application/usecases/auth-login/auth.login.service';
import { JwtAuthGuard } from './shared/infra/http/guards/jwt-auth.guard';
import { RolesGuard } from './shared/infra/http/guards/roles.guard';
import { AUTH_TOKEN_SERVICE } from './domain/tokens/auth-token.service.token';
import { AuthTokenService } from './infra/gateway/auth.token.service';
import { UsersModule } from '../users/users.module';
import { PasswordModule } from '../password/password.module';

@Global()
@Module({
  imports: [UsersModule, PasswordModule],
  controllers: [AuthControllers],
  providers: [
    AuthLoginService,
    JwtAuthGuard,
    RolesGuard,
    {
      provide: AUTH_TOKEN_SERVICE,
      useClass: AuthTokenService,
    },
  ],
  exports: [UsersModule, AUTH_TOKEN_SERVICE, JwtAuthGuard, RolesGuard],
})
export class AuthModule {}
