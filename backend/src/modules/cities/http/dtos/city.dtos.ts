import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, MaxLength, MinLength } from 'class-validator';

export class CreateCityDTO {
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  @ApiProperty({
    description: 'The name of the city',
    type: String,
    example: 'São Paulo',
  })
  name!: string;

  @IsNumber()
  @ApiProperty({
    description: 'The X coordinate of the city',
    type: Number,
    example: -23.5505,
  })
  x!: number;

  @IsNumber()
  @ApiProperty({
    description: 'The Y coordinate of the city',
    type: Number,
    example: -46.6333,
  })
  y!: number;
}

export class UpdateCityDTO {
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  @ApiProperty({
    description: 'The name of the city',
    type: String,
    example: 'São Paulo',
  })
  name!: string;

  @IsNumber()
  @ApiProperty({
    description: 'The X coordinate of the city',
    type: Number,
    example: -23.5505,
  })
  x!: number;

  @IsNumber()
  @ApiProperty({
    description: 'The Y coordinate of the city',
    type: Number,
    example: -46.6333,
  })
  y!: number;
}
