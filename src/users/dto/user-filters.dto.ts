import {
  IsOptional,
  IsString,
  IsBoolean,
  IsEnum,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum UserSortBy {
  CREATED_AT = 'createdAt',
  USERNAME = 'username',
  EMAIL = 'email',
  FIRST_NAME = 'firstName',
  LAST_NAME = 'lastName',
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class UserFiltersDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  search?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  roleName?: string;

  @IsOptional()
  @Type(() => Number)
  roleId?: number;

  @IsOptional()
  @IsString()
  createdFrom?: string; // Fecha desde (YYYY-MM-DD)

  @IsOptional()
  @IsString()
  createdTo?: string; // Fecha hasta (YYYY-MM-DD)

  @IsOptional()
  @IsEnum(UserSortBy)
  sortBy?: UserSortBy = UserSortBy.CREATED_AT;

  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.DESC;
}
