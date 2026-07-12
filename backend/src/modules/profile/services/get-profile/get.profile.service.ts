import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import type ICityRepository from '@/modules/cities/interfaces/city.repository.interface';
import { CITY_REPOSITORY } from '@/modules/cities/infra/tokens/city.token.repository';
import type IUserRepository from '@/modules/users/interfaces/user.repository.interface';
import { USER_REPOSITORY } from '@/modules/users/infra/tokens/user.token.repository';

@Injectable()
export class GetProfileService {
  private readonly logger = new Logger(GetProfileService.name);

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(CITY_REPOSITORY)
    private readonly cityRepository: ICityRepository,
  ) {}

  async execute(authenticatedUserId: string): Promise<Record<string, unknown>> {
    const user = await this.userRepository.findById(authenticatedUserId);

    if (!user) {
      this.logger.error('User not found', { userId: authenticatedUserId });
      throw new NotFoundException('User not found');
    }

    const cityId = user.getCityId();
    const city = cityId
      ? await this.cityRepository.findById(cityId)
      : null;

    if (cityId && !city) {
      this.logger.warn('City not found for user profile', {
        userId: authenticatedUserId,
        cityId,
      });
    }

    return {
      ...user.toJSON(),
      city: city ? city.toJSON() : null,
    };
  }
}
