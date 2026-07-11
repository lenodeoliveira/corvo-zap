import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateCityService } from '../../services/create-city/create.city.service';
import { ListCitiesService } from '../../services/list-cities/list.cities.service';
import { UpdateCityService } from '../../services/update-city/update.city.service';
import { CreateCityDTO, UpdateCityDTO } from '../dtos/city.dtos';
import { JwtAuthGuard } from '@/modules/users/infra/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/users/infra/guards/roles.guard';
import { Roles } from '@/modules/users/infra/decorators/roles.decorator';
import { SWAGGER_JWT_AUTH } from '@/docs/swagger';

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
  ) {}

  @Get('')
  async listCities() {
    return await this.listCitiesService.execute();
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
