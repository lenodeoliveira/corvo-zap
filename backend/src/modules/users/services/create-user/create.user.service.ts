import { BadRequestException, Inject, Injectable, Logger } from "@nestjs/common";
import type IUserRepository from "../../interfaces/user.repository.interface";
import { UserEntity } from "../../entities/user.entity";
import type IEncryption from "../../interfaces/cript.interface";
import { USER_REPOSITORY } from "../../infra/tokens/user.token.repository";
import { CRYPT_SERVICE } from "../../infra/tokens/crypt.token.service";


interface UserProps {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    cityId: string;
}

@Injectable()
export class CreateUserService {
  private readonly logger = new Logger(CreateUserService.name)
  constructor(
    @Inject(USER_REPOSITORY)
     private readonly userRepository: IUserRepository,
    @Inject(CRYPT_SERVICE)
     private readonly cryptography: IEncryption
    ) {}

  async execute(input: UserProps): Promise<string> {

    const userAlreadyExists  = await this.userRepository.findByEmail(input.email)
     
    if(userAlreadyExists ) {
      this.logger.error('User already exists', {
        user: userAlreadyExists 
      })
      throw new BadRequestException('User already exists!')
    }

    if (input.password !== input.confirmPassword) {
      this.logger.error('Passwords do not match')
        throw new BadRequestException('Passwords do not match');
      }
  
      const passwordHash = await this.cryptography.hash(input.password, 10);
  
      const user = UserEntity.create({
        name: input.name,
        email: input.email,
        passwordHash: passwordHash,
        role: 'user',
        status: 'active',
        cityId: input.cityId,
      });

      await this.userRepository.create(user)

      return user.getEmail()
  }
}