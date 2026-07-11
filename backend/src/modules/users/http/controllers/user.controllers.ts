
import { CreateUserService } from "../../services/create-user/create.user.service"
import { Body, Controller, Post } from "@nestjs/common"
import { ApiOperation, ApiTags } from "@nestjs/swagger"
import { UserDTO } from "../dtos/users.dtos"
import { AuthLoginService } from "../../services/auth-service/auth.login.service"
import { UserLogin } from "../dtos/user.login.dto"

@ApiTags('users')
@Controller('/users')
export class UsersControllers {
    constructor(
        private readonly createUserService: CreateUserService,
        private readonly authLoginService: AuthLoginService
    ) { }

    @Post('')
    async createUser(@Body() inputDto: UserDTO) {
        return await this.createUserService.execute(inputDto)
    }

    @Post('login')
    @ApiOperation({
        summary: 'Autenticar usuário',
        description: 'Retorna um token JWT. Use-o no header Authorization: Bearer <token> nas rotas protegidas de chats e mensagens.',
    })
    async login(@Body() inputDto: UserLogin) {
        return await this.authLoginService.execute(inputDto)
    }
}
