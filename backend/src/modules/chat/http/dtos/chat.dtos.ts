import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class ChatDTO {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    description: 'First user id',
    type: String,
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  userOneId!: string;

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    description: 'Second user id',
    type: String,
    example: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
  })
  userTwoId!: string;
}
