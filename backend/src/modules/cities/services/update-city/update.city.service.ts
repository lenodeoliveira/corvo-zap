import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import type ICityRepository from '../../interfaces/city.repository.interface';
import { CITY_REPOSITORY } from '../../infra/tokens/city.token.repository';

interface UpdateCityProps {
  name: string;
  x: number;
  y: number;
}

@Injectable()
export class UpdateCityService {
  private readonly logger = new Logger(UpdateCityService.name);

  constructor(
    @Inject(CITY_REPOSITORY)
    private readonly cityRepository: ICityRepository,
  ) {}

  async execute(
    cityId: string,
    input: UpdateCityProps,
  ): Promise<Record<string, unknown>> {
    const city = await this.cityRepository.findById(cityId);

    if (!city) {
      this.logger.error('City not found', { cityId });
      throw new NotFoundException('City not found');
    }

    city.changeName(input.name);
    city.changeCoordinates(input.x, input.y);
    city.validate();

    await this.cityRepository.update(city);

    this.logger.log('City updated', { cityId: city.getId() });

    return city.toJSON();
  }
}
