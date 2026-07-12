import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ChatDTO } from './dtos/chat.dtos';
import { JwtAuthGuard } from '@/modules/auth/shared/infra/http/guards/jwt-auth.guard';
import { CurrentUser } from '@/modules/auth/shared/infra/http/decorators/current-user.decorator';
import type { AuthUserPayload } from '@/modules/auth/domain/@types/auth-user.interface';
import { SWAGGER_JWT_AUTH } from '@/docs/swagger';
import { CreateChatService } from '@/modules/chat/application/usecases/create-chat/create.chat.service';
import { ListChatsByUserService } from '@/modules/chat/application/usecases/list-chats-by-user/list.chats.by.user.service';

@ApiTags('chats')
@ApiBearerAuth(SWAGGER_JWT_AUTH)
@ApiUnauthorizedResponse({ description: 'Token ausente, inválido ou expirado' })
@Controller('/chats')
@UseGuards(JwtAuthGuard)
export class ChatControllers {
  constructor(
    private readonly createChatService: CreateChatService,
    private readonly listChatsByUserService: ListChatsByUserService,
  ) {}

  @Post('')
  async createChat(
    @Body() inputDto: ChatDTO,
    @CurrentUser() user: AuthUserPayload,
  ) {
    return await this.createChatService.execute(inputDto, user.id);
  }

  @Get('me')
  async listMyChats(@CurrentUser() user: AuthUserPayload) {
    return await this.listChatsByUserService.execute(user.id);
  }
}
