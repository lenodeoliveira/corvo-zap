import {
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Socket } from 'socket.io';
import { AUTH_TOKEN_SERVICE } from '@/modules/auth/domain/tokens/auth-token.service.token';
import type { IAuthToken } from '@/modules/auth/domain/gateways/auth.token.interface';
import type { AuthUserPayload } from '@/modules/auth/domain/@types/auth-user.interface';

@Injectable()
export class WsJwtGuard {
  constructor(
    @Inject(AUTH_TOKEN_SERVICE)
    private readonly authTokenService: IAuthToken,
  ) {}

  validate(client: Socket): AuthUserPayload {
    const rawToken =
      (client.handshake.auth?.token as string | undefined) ??
      (client.handshake.headers?.authorization as string | undefined);

    if (!rawToken) {
      throw new UnauthorizedException('Token not provided');
    }

    const token = rawToken.startsWith('Bearer ')
      ? rawToken.slice('Bearer '.length)
      : rawToken;

    try {
      const payload = this.authTokenService.verifyToken(token) as AuthUserPayload;

      if (!payload?.id) {
        throw new UnauthorizedException('Invalid token payload');
      }

      return payload;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
