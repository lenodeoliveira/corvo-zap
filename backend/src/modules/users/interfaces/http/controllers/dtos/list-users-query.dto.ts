import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class ListUsersQueryDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @ApiPropertyOptional({
    description: 'Filtra usuários por nome ou e-mail (busca parcial, case-insensitive)',
    example: 'john',
  })
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({
    description: 'Número da página',
    example: 1,
    default: 1,
  })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @ApiPropertyOptional({
    description: 'Quantidade de itens por página',
    example: 20,
    default: 20,
  })
  limit?: number = 20;
}
