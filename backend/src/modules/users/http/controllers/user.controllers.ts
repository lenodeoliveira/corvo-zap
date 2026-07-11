
import { CreateUserService } from "../../services/create-user/create.user.service"
import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common"
import { ApiBearerAuth, ApiOperation, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger"
import { UserDTO } from "../dtos/users.dtos"
import { AuthLoginService } from "../../services/auth-service/auth.login.service"
import { UserLogin } from "../dtos/user.login.dto"
import { ListUsersService } from "../../services/list-users/list.users.service"
import { JwtAuthGuard } from "../../infra/guards/jwt-auth.guard"
import { SWAGGER_JWT_AUTH } from "@/docs/swagger"

@ApiTags('users')
@Controller('/users')
export class UsersControllers {
    constructor(
        private readonly createUserService: CreateUserService,
        private readonly authLoginService: AuthLoginService,
        private readonly listUsersService: ListUsersService,
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

    @Get('')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth(SWAGGER_JWT_AUTH)
    @ApiUnauthorizedResponse({ description: 'Token ausente, inválido ou expirado' })
    @ApiOperation({
        summary: 'Listar usuários',
        description: 'Retorna todos os usuários cadastrados. Requer autenticação.',
    })
    async listUsers() {
        return await this.listUsersService.execute()
    }
}
