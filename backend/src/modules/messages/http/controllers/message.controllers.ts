import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateMessageService } from '../../services/create-message/create.message.service';
import { ListMessagesByChatService } from '../../services/list-messages-by-chat/list.messages.by.chat.service';
import { MessageDTO } from '../dtos/message.dtos';

@Controller('/messages')
export class MessageControllers {
  constructor(
    private readonly createMessageService: CreateMessageService,
    private readonly listMessagesByChatService: ListMessagesByChatService,
  ) {}

  @Post('')
  async createMessage(@Body() inputDto: MessageDTO) {
    return await this.createMessageService.execute(inputDto);
  }

  @Get('chat/:chatId')
  async listMessagesByChat(@Param('chatId') chatId: string) {
    return await this.listMessagesByChatService.execute(chatId);
  }
}
