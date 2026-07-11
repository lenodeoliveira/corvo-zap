import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { CreateMessageService } from '../../services/create-message/create.message.service';
import { GetMessageService } from '../../services/get-message/get.message.service';
import { ListMessagesByChatService } from '../../services/list-messages-by-chat/list.messages.by.chat.service';
import { MessageDTO } from '../dtos/message.dtos';
import { JwtAuthGuard } from '@/modules/users/infra/guards/jwt-auth.guard';
import { CurrentUser } from '@/modules/users/infra/decorators/current-user.decorator';
import type { AuthUserPayload } from '@/modules/users/interfaces/auth-user.interface';
import { SWAGGER_JWT_AUTH } from '@/docs/swagger';

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
