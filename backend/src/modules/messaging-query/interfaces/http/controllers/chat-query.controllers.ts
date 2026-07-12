import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/modules/auth/shared/infra/http/guards/jwt-auth.guard';
import { CurrentUser } from '@/modules/auth/shared/infra/http/decorators/current-user.decorator';
import type { AuthUserPayload } from '@/modules/auth/domain/@types/auth-user.interface';
import { SWAGGER_JWT_AUTH } from '@/docs/swagger';
import { ListChatsByUserService } from '@/modules/messaging-query/application/usecases/list-chats-by-user/list.chats.by.user.service';

@ApiTags('chats')
@ApiBearerAuth(SWAGGER_JWT_AUTH)
@ApiUnauthorizedResponse({ description: 'Token ausente, inválido ou expirado' })
@Controller('/chats')
@UseGuards(JwtAuthGuard)
export class ChatQueryControllers {
  constructor(
    private readonly listChatsByUserService: ListChatsByUserService,
  ) {}

  @Get('me')
  async listMyChats(@CurrentUser() user: AuthUserPayload) {
    return await this.listChatsByUserService.execute(user.id);
  }
}
