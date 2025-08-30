import { IsOptional, IsString, IsEnum, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

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
  @IsOptional()
  @IsString()
  @MinLength(1)
  search?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  createdFrom?: string; // Fecha desde (YYYY-MM-DD)

  @IsOptional()
  @IsString()
  createdTo?: string; // Fecha hasta (YYYY-MM-DD)

  @IsOptional()
  @Type(() => Number)
  minUsers?: number; // Roles con mínimo X usuarios

  @IsOptional()
  @Type(() => Number)
  maxUsers?: number; // Roles con máximo X usuarios

  @IsOptional()
  @IsEnum(RoleSortBy)
  sortBy?: RoleSortBy = RoleSortBy.NAME;

  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.ASC;
}
