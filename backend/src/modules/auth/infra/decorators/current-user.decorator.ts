import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { AuthUserPayload } from '../../interfaces/auth-user.interface';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthUserPayload => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
