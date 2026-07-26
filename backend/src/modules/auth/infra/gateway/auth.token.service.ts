import * as jwt from 'jsonwebtoken';
import type { IAuthToken } from '../../domain/gateways/auth.token.interface';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { AuthUserPayload } from '../../domain/@types/auth-user.interface';

@Injectable()
export class AuthTokenService implements IAuthToken<AuthUserPayload> {
  constructor(private readonly configService: ConfigService) {}

  generateToken(payload: AuthUserPayload): string {
    return jwt.sign(payload, this.configService.getOrThrow('JWT_SECRET'), { expiresIn: '1h' });
  }

  verifyToken(token: string): AuthUserPayload {
    return jwt.verify(token, this.configService.getOrThrow('JWT_SECRET'));
  }
}
