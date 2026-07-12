import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/modules/auth/shared/infra/http/guards/jwt-auth.guard';
import { CurrentUser } from '@/modules/auth/shared/infra/http/decorators/current-user.decorator';
import type { AuthUserPayload } from '@/modules/auth/domain/@types/auth-user.interface';
import { SWAGGER_JWT_AUTH } from '@/docs/swagger';
import { GetProfileService } from '@/modules/profile/application/usecases/get-profile/get.profile.service';

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
