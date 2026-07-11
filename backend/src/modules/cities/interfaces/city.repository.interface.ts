import { CityEntity } from '@/modules/cities/entities/city.entity';

interface ICityRepository {
  create(city: CityEntity): Promise<void>;
  findAll(): Promise<CityEntity[]>;
  findById(id: string): Promise<CityEntity | null>;
  update(city: CityEntity): Promise<void>;
}

export default ICityRepository;
