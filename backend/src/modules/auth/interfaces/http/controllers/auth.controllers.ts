import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthLoginDTO } from './dtos/auth.login.dto';
import { AuthLoginService } from '@/modules/auth/application/usecases/auth-login/auth.login.service';

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
