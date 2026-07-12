import * as jwt from 'jsonwebtoken';
import type { IAuthToken } from '../../domain/gateways/auth.token.interface';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthTokenService implements IAuthToken {
  constructor(private readonly configService: ConfigService) {}

  generateToken(payload: Record<string, unknown>): string {
    return jwt.sign(payload, this.configService.getOrThrow('JWT_SECRET'), { expiresIn: '1h' });
  }

  verifyToken(token: string): unknown {
    return jwt.verify(token, this.configService.getOrThrow('JWT_SECRET'));
  }
}
