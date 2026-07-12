import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthLoginService } from '../../services/auth-login/auth.login.service';
import { AuthLoginDTO } from '../dtos/auth.login.dto';

@ApiTags('auth')
@Controller('/auth')
export class AuthControllers {
  constructor(private readonly authLoginService: AuthLoginService) {}

  @Post('login')
  @ApiOperation({
    summary: 'Autenticar usuário',
    description:
      'Retorna um token JWT. Use-o no header Authorization: Bearer <token> nas rotas protegidas.',
  })
  async login(@Body() inputDto: AuthLoginDTO) {
    return await this.authLoginService.execute(inputDto);
  }
}
