import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { USER_REPOSITORY } from '@/modules/users/infra/tokens/user.token.repository';
import type IUserRepository from '@/modules/users/interfaces/user.repository.interface';
import type { AuthUserPayload } from '../../interfaces/auth-user.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userPayload = request.user as AuthUserPayload;

    if (!userPayload?.id) {
      throw new ForbiddenException('User not authenticated');
    }

    const user = await this.userRepository.findById(userPayload.id);

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    if (!requiredRoles.includes(user.getRole())) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
