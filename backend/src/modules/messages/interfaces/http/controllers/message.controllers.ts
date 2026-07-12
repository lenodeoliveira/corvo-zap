import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { MessageDTO } from './dtos/message.dtos';
import { JwtAuthGuard } from '@/modules/auth/shared/infra/http/guards/jwt-auth.guard';
import { CurrentUser } from '@/modules/auth/shared/infra/http/decorators/current-user.decorator';
import type { AuthUserPayload } from '@/modules/auth/domain/@types/auth-user.interface';
import { SWAGGER_JWT_AUTH } from '@/docs/swagger';
import { CreateMessageService } from '@/modules/messages/application/usecases/create-message/create.message.service';
import { GetMessageService } from '@/modules/messages/application/usecases/get-message/get.message.service';
import { ListMessagesByChatService } from '@/modules/messages/application/usecases/list-messages-by-chat/list.messages.by.chat.service';

@ApiTags('messages')
@ApiBearerAuth(SWAGGER_JWT_AUTH)
@ApiUnauthorizedResponse({ description: 'Token ausente, inválido ou expirado' })
@Controller('/messages')
@UseGuards(JwtAuthGuard)
export class MessageControllers {
  constructor(
    private readonly createMessageService: CreateMessageService,
    private readonly getMessageService: GetMessageService,
    private readonly listMessagesByChatService: ListMessagesByChatService,
  ) {}

  @Post('')
  async createMessage(
    @Body() inputDto: MessageDTO,
    @CurrentUser() user: AuthUserPayload,
  ) {
    return await this.createMessageService.execute(inputDto, user.id);
  }

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
