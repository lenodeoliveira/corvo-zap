import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GetProfileService } from '../../services/get-profile/get.profile.service';
import { JwtAuthGuard } from '@/modules/auth/infra/guards/jwt-auth.guard';
import { CurrentUser } from '@/modules/auth/infra/decorators/current-user.decorator';
import type { AuthUserPayload } from '@/modules/auth/interfaces/auth-user.interface';
import { SWAGGER_JWT_AUTH } from '@/docs/swagger';

@ApiTags('profile')
@Controller('/profile')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth(SWAGGER_JWT_AUTH)
@ApiUnauthorizedResponse({ description: 'Token ausente, inválido ou expirado' })
export class ProfileControllers {
  constructor(private readonly getProfileService: GetProfileService) {}

  @Get('me')
  @ApiOperation({
    summary: 'Buscar perfil do usuário autenticado',
    description: 'Retorna os dados do usuário logado com a cidade associada.',
  })
  async getProfile(@CurrentUser() user: AuthUserPayload) {
    return await this.getProfileService.execute(user.id);
  }
}
