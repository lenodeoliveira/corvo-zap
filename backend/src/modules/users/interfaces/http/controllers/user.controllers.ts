
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ListUsersQueryDto } from './dtos/list-users-query.dto';
import { UserDTO } from './dtos/users.dtos';
import { JwtAuthGuard } from '@/modules/auth/shared/infra/http/guards/jwt-auth.guard';
import { SWAGGER_JWT_AUTH } from '@/docs/swagger';
import { CreateUserService } from '@/modules/users/application/usecases/create-users/create.user.service';
import { ListUsersService } from '@/modules/users/application/usecases/get-all-users/list.users.service';

@ApiTags('users')
@Controller('/users')
export class UsersControllers {
  constructor(
    private readonly createUserService: CreateUserService,
    private readonly listUsersService: ListUsersService,
  ) {}

  @Post('')
  async createUser(@Body() inputDto: UserDTO) {
    return await this.createUserService.execute(inputDto);
  }

  @Get('')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth(SWAGGER_JWT_AUTH)
  @ApiUnauthorizedResponse({ description: 'Token ausente, inválido ou expirado' })
  @ApiOperation({
    summary: 'Listar usuários',
    description:
      'Retorna usuários paginados. Aceita busca parcial por nome ou e-mail via query param `search`. Requer autenticação.',
  })
  async listUsers(@Query() query: ListUsersQueryDto) {
    return await this.listUsersService.execute(query);
  }
}
