import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateChatService } from '../../services/create-chat/create.chat.service';
import { ListChatsByUserService } from '../../services/list-chats-by-user/list.chats.by.user.service';
import { ChatDTO } from '../dtos/chat.dtos';

@Controller('/chats')
export class ChatControllers {
  constructor(
    private readonly createChatService: CreateChatService,
    private readonly listChatsByUserService: ListChatsByUserService,
  ) {}

  @Post('')
  async createChat(@Body() inputDto: ChatDTO) {
    return await this.createChatService.execute(inputDto);
  }

  @Get('user/:userId')
  async listChatsByUser(@Param('userId') userId: string) {
    return await this.listChatsByUserService.execute(userId);
  }
}
