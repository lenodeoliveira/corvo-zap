import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityModel } from './infra/database/typeorm/models/city.model';
import { CityControllers } from './interfaces/http/controllers/city.controllers';
import { CreateCityService } from './application/usecases/create-city/create.city.service';
import { ListCitiesService } from './application/usecases/list-cities/list.cities.service';
import { UpdateCityService } from './application/usecases/update-city/update.city.service';
import { GetCityService } from './application/usecases/get-city/get.city.service';
import { CITY_REPOSITORY } from './infra/database/typeorm/tokens/city.token.repository';
import { CitiesRepository } from './infra/database/typeorm/repositories/cities.repository';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([CityModel]), UsersModule],
  controllers: [CityControllers],
  providers: [
    CreateCityService,
    ListCitiesService,
    UpdateCityService,
    GetCityService,
    {
      provide: CITY_REPOSITORY,
      useClass: CitiesRepository,
    },
  ],
  exports: [CITY_REPOSITORY],
})
export class CitiesModule {}
