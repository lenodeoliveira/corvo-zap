import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/modules/auth/shared/infra/http/guards/jwt-auth.guard';
import { CurrentUser } from '@/modules/auth/shared/infra/http/decorators/current-user.decorator';
import type { AuthUserPayload } from '@/modules/auth/domain/@types/auth-user.interface';
import { SWAGGER_JWT_AUTH } from '@/docs/swagger';
import { GetMessageService } from '@/modules/messaging-query/application/usecases/get-message/get.message.service';
import { ListMessagesByChatService } from '@/modules/messaging-query/application/usecases/list-messages-by-chat/list.messages.by.chat.service';

@ApiTags('messages')
@ApiBearerAuth(SWAGGER_JWT_AUTH)
@ApiUnauthorizedResponse({ description: 'Token ausente, inválido ou expirado' })
@Controller('/messages')
@UseGuards(JwtAuthGuard)
export class MessageQueryControllers {
  constructor(
    private readonly getMessageService: GetMessageService,
    private readonly listMessagesByChatService: ListMessagesByChatService,
  ) {}

  @Get('chat/:chatId')
  async listMessagesByChat(
    @Param('chatId') chatId: string,
    @CurrentUser() user: AuthUserPayload,
  ) {
    return await this.listMessagesByChatService.execute(chatId, user.id);
  }

  @Get(':id')
  async getMessage(
    @Param('id') id: string,
    @CurrentUser() user: AuthUserPayload,
  ) {
    return await this.getMessageService.execute(id, user.id);
  }
}
