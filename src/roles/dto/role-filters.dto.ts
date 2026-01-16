import { IsOptional, IsString, IsEnum, MinLength } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum RoleSortBy {
  NAME = 'name',
  CREATED_AT = 'createdAt',
  USER_COUNT = 'userCount',
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class RoleFiltersDto {
  @ApiPropertyOptional({
    description: 'Búsqueda en nombre y descripción',
    example: 'admin',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  search?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por nombre exacto de rol',
    example: 'admin',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por descripción',
    example: 'Administrator',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Fecha de creación desde (YYYY-MM-DD)',
    example: '2024-01-01',
  })
  @IsOptional()
  @IsString()
  createdFrom?: string;

  @ApiPropertyOptional({
    description: 'Fecha de creación hasta (YYYY-MM-DD)',
    example: '2024-12-31',
  })
  @IsOptional()
  @IsString()
  createdTo?: string;

  @ApiPropertyOptional({
    description: 'Roles con mínimo número de usuarios',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  minUsers?: number;

  @ApiPropertyOptional({
    description: 'Roles con máximo número de usuarios',
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  maxUsers?: number;

  @ApiPropertyOptional({
    description: 'Campo por el cual ordenar',
    enum: RoleSortBy,
    default: RoleSortBy.NAME,
  })
  @IsOptional()
  @IsEnum(RoleSortBy)
  sortBy?: RoleSortBy = RoleSortBy.NAME;

  @ApiPropertyOptional({
    description: 'Orden ascendente o descendente',
    enum: SortOrder,
    default: SortOrder.ASC,
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.ASC;
}
