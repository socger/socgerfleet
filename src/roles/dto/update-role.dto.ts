import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleDto } from './create-role.dto';
import { IsOptional, IsString, MinLength, MaxLength } from 'class-validator';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;
}
