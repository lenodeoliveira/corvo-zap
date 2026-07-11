import type ICityRepository from '@/modules/cities/interfaces/city.repository.interface';
import { CityEntity } from '@/modules/cities/entities/city.entity';
import { CityModel } from '@/modules/cities/infra/database/sqlite/model/city.model';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CityMapper } from '../mapper/city.mapper.model';

@Injectable()
export class CitiesRepository implements ICityRepository {
  constructor(
    @InjectRepository(CityModel)
    private readonly citiesRepository: Repository<CityModel>,
  ) {}

  async create(city: CityEntity): Promise<void> {
    const cityModel = CityMapper.toModel(city);

    await this.citiesRepository.save({
      id: cityModel.id,
      name: cityModel.name,
      x: cityModel.x,
      y: cityModel.y,
    });
  }

  async findAll(): Promise<CityEntity[]> {
    const cities = await this.citiesRepository.find({
      order: { name: 'ASC' },
    });

    return CityMapper.toDomainList(cities);
  }

  async findById(id: string): Promise<CityEntity | null> {
    const city = await this.citiesRepository.findOne({
      where: { id },
    });

    if (!city) {
      return null;
    }

    return CityMapper.toDomain(city);
  }

  async update(city: CityEntity): Promise<void> {
    const cityModel = CityMapper.toModel(city);

    await this.citiesRepository.save({
      id: cityModel.id,
      name: cityModel.name,
      x: cityModel.x,
      y: cityModel.y,
    });
  }
}
