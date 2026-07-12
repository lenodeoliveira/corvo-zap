import { ForbiddenException, Inject, Injectable, Logger } from '@nestjs/common';
import type IUserRepository from '@/modules/users/domain/repositories/interface-users/user.repository.interface';
import type IEncryption from '@/modules/password/domain/gateways/crypt.interface';
import { UserEntity } from '@/modules/users/domain/entities/user.entity';
import { CRYPT_SERVICE } from '@/modules/password/infra/gateway/crypt.token.service';
import { USER_REPOSITORY } from '@/modules/users/infra/database/typeorm/tokens/user.token.repository';
import { AUTH_TOKEN_SERVICE } from '../../../infra/gateway/auth.token';
import type { IAuthToken } from '../../../domain/gateways/auth.token.interface';

interface LoginProps {
  email: string;
  password: string;
}

@Injectable()
export class AuthLoginService {
  private readonly logger = new Logger(AuthLoginService.name);

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(CRYPT_SERVICE)
    private readonly cryptography: IEncryption,
    @Inject(AUTH_TOKEN_SERVICE)
    private readonly authTokenService: IAuthToken,
  ) {}

  async execute(input: LoginProps): Promise<{ user: UserEntity; token: string } | null> {
    const userFound = await this.userRepository.findByEmail(input.email);
    if (!userFound || userFound.length === 0) {
      this.logger.error('Error: user does not exists');
      throw new ForbiddenException('User not found');
    }

    const isPasswordValid = await this.cryptography.compare(
      input.password,
      userFound[0].getPassword(),
    );

    if (!isPasswordValid) {
      this.logger.error('Error: Invalid password');
      throw new ForbiddenException('Invalid password');
    }

    if (userFound[0].getStatus() !== 'active') {
      this.logger.error('Error: User is not active');
      throw new ForbiddenException('User is not active');
    }

    const token = this.authTokenService.generateToken({
      id: userFound[0].getId(),
      email: userFound[0].getEmail(),
    });

    return {
      user: userFound[0],
      token,
    };
  }
}
