import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, MaxLength, MinLength } from 'class-validator';

export class MessageDTO {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    description: 'Chat id',
    type: String,
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  chatId!: string;

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    description: 'Sender user id',
    type: String,
    example: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
  })
  senderId!: string;

  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(1000)
  @ApiProperty({
    description: 'Message content',
    type: String,
    example: 'Olá, como você está?',
  })
  content!: string;
}
