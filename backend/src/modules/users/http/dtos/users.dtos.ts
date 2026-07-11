import { ApiProperty } from "@nestjs/swagger";
import {IsNotEmpty, MaxLength, MinLength } from "class-validator"

export class UserDTO {
    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(50)
    @ApiProperty({
        description: 'The name user',
        type: String,
        example: 'John Doe'
    })
    name!: string

    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(50)
    @ApiProperty({
        description: 'The email user',
        type: String,
        example: 'john@example.com'
    })
    email: string;

    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(50)
    @ApiProperty({
        description: 'The password user',
        type: String,
        example: 'qwert56'
    })
    password: string;

    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(50)
    @ApiProperty({
        description: 'The password user',
        type: String,
        example: 'qwert56'
    })
    confirmPassword: string;
}
