import { Inject, Injectable } from '@nestjs/common';
import type ICityRepository from '../../../domain/repositories/interface-cities/city.repository.interface';
import { CITY_REPOSITORY } from '../../../infra/database/typeorm/tokens/city.token.repository';

@Injectable()
export class ListCitiesService {
  constructor(
    @Inject(CITY_REPOSITORY)
    private readonly cityRepository: ICityRepository,
  ) {}

  async execute(): Promise<Record<string, unknown>[]> {
    const cities = await this.cityRepository.findAll();

    return cities.map((city) => city.toJSON());
  }
}
