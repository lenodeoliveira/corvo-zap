import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class UserLogin {
    @IsNotEmpty()
    @MinLength(6)
    @ApiProperty({
        description: 'The email user',
        type: String,
        example: 'john@example.com'
    })
    email: string;
    
    @IsNotEmpty()
    @MinLength(6)
    @ApiProperty({
        description: 'The password user',
        type: String,
        example: 'qwert56'
    })
    password: string;
}