import { CityEntity } from '@/modules/cities/entities/city.entity';
import { CityModel } from '../model/city.model';
import { DeepPartial } from 'typeorm';

export class CityMapper {
  static toModel(entity: CityEntity): DeepPartial<CityModel> {
    return {
      id: entity.getId(),
      name: entity.getName(),
      x: entity.getX(),
      y: entity.getY(),
    };
  }

  static toDomain(model: CityModel): CityEntity {
    return CityEntity.create({
      id: model.id,
      name: model.name,
      x: model.x,
      y: model.y,
    });
  }

  static toDomainList(models: CityModel[]): CityEntity[] {
    if (!models?.length) {
      return [];
    }

    return models.map((model) => CityMapper.toDomain(model));
  }
}
