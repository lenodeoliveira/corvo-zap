import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import type ICityRepository from '../../interfaces/city.repository.interface';
import { CITY_REPOSITORY } from '../../infra/tokens/city.token.repository';

@Injectable()
export class GetCityService {
  private readonly logger = new Logger(GetCityService.name);

  constructor(
    @Inject(CITY_REPOSITORY)
    private readonly cityRepository: ICityRepository,
  ) {}

  async execute(cityId: string): Promise<Record<string, unknown>> {
    const city = await this.cityRepository.findById(cityId);

    if (!city) {
      this.logger.error('City not found', { cityId });
      throw new NotFoundException('City not found');
    }

    return city.toJSON();
  }
}
