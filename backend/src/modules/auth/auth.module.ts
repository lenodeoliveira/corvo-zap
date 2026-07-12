import { Global, Module } from '@nestjs/common';
import { AuthControllers } from './http/controllers/auth.controllers';
import { AuthLoginService } from './services/auth-login/auth.login.service';
import { JwtAuthGuard } from './infra/guards/jwt-auth.guard';
import { RolesGuard } from './infra/guards/roles.guard';
import { AUTH_TOKEN_SERVICE } from './infra/tokens/auth.token.service';
import { AuthTokenService } from './infra/services/auth.token.service';
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
