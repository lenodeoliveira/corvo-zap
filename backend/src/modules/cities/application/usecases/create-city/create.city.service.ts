import { Inject, Injectable, Logger } from '@nestjs/common';
import type ICityRepository from '../../../domain/repositories/interface-cities/city.repository.interface';
import { CityEntity } from '../../../domain/entities/city.entity';
import { CITY_REPOSITORY } from '@/modules/cities/domain/tokens/city.repository.token';

interface CreateCityProps {
  name: string;
  x: number;
  y: number;
}

@Injectable()
export class CreateCityService {
  private readonly logger = new Logger(CreateCityService.name);

  constructor(
    @Inject(CITY_REPOSITORY)
    private readonly cityRepository: ICityRepository,
  ) {}

  async execute(input: CreateCityProps): Promise<Record<string, unknown>> {
    const city = CityEntity.create({
      name: input.name,
      x: input.x,
      y: input.y,
    });

    city.validate();

    await this.cityRepository.create(city);

    this.logger.log('City created', { cityId: city.getId() });

    return city.toJSON();
  }
}
