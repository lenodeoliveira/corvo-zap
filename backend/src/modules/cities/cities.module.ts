import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityModel } from './infra/database/sqlite/model/city.model';
import { CityControllers } from './http/controllers/city.controllers';
import { CreateCityService } from './services/create-city/create.city.service';
import { ListCitiesService } from './services/list-cities/list.cities.service';
import { UpdateCityService } from './services/update-city/update.city.service';
import { GetCityService } from './services/get-city/get.city.service';
import { CITY_REPOSITORY } from './infra/tokens/city.token.repository';
import { CitiesRepository } from './infra/database/sqlite/repository/cities.repository';
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
