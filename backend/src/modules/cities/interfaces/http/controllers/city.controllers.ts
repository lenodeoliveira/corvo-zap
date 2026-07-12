import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateCityDTO, UpdateCityDTO } from './dtos/city.dtos';
import { JwtAuthGuard } from '@/modules/auth/shared/infra/http/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/shared/infra/http/guards/roles.guard';
import { Roles } from '@/modules/auth/shared/infra/http/decorators/roles.decorator';
import { SWAGGER_JWT_AUTH } from '@/docs/swagger';
import { CreateCityService } from '@/modules/cities/application/usecases/create-city/create.city.service';
import { ListCitiesService } from '@/modules/cities/application/usecases/list-cities/list.cities.service';
import { UpdateCityService } from '@/modules/cities/application/usecases/update-city/update.city.service';
import { GetCityService } from '@/modules/cities/application/usecases/get-city/get.city.service';

@ApiTags('cities')
@ApiBearerAuth(SWAGGER_JWT_AUTH)
@ApiUnauthorizedResponse({ description: 'Token ausente, inválido ou expirado' })
@ApiForbiddenResponse({ description: 'Permissões insuficientes' })
@Controller('/cities')
@UseGuards(JwtAuthGuard)
export class CityControllers {
  constructor(
    private readonly createCityService: CreateCityService,
    private readonly listCitiesService: ListCitiesService,
    private readonly updateCityService: UpdateCityService,
    private readonly getCityService: GetCityService,
  ) {}

  @Get('')
  async listCities() {
    return await this.listCitiesService.execute();
  }

  @Get(':id')
  async getCity(@Param('id') id: string) {
    return await this.getCityService.execute(id);
  }

  @Post('')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async createCity(@Body() inputDto: CreateCityDTO) {
    return await this.createCityService.execute(inputDto);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async updateCity(
    @Param('id') id: string,
    @Body() inputDto: UpdateCityDTO,
  ) {
    return await this.updateCityService.execute(id, inputDto);
  }
}
