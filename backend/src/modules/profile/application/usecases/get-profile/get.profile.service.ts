import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import type ICityRepository from '@/modules/cities/domain/repositories/interface-cities/city.repository.interface';
import { CITY_REPOSITORY } from '@/modules/cities/domain/tokens/city.repository.token';
import type IUserRepository from '@/modules/users/domain/repositories/interface-users/user.repository.interface';
import { USER_REPOSITORY } from '@/modules/users/domain/tokens/user.repository.token';

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
