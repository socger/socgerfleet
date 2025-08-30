import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(@Query() query: any) {
    // Crear el DTO de paginación con valores por defecto
    const paginationDto = new PaginationDto();
    paginationDto.page = query.page ? parseInt(query.page, 10) : 1;
    paginationDto.limit = query.limit ? parseInt(query.limit, 10) : 10;

    // Validar límites
    if (paginationDto.page < 1) paginationDto.page = 1;
    if (paginationDto.limit < 1) paginationDto.limit = 10;
    if (paginationDto.limit > 100) paginationDto.limit = 100;

    const result = await this.usersService.findAll(paginationDto);
    return {
      message: 'Lista de usuarios obtenida exitosamente',
      ...result,
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return {
      message: 'Usuario obtenido exitosamente',
      data: await this.usersService.findOne(id),
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return {
      message: 'Usuario creado exitosamente',
      data: await this.usersService.create(createUserDto),
    };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ) {
    return {
      message: 'Usuario actualizado exitosamente',
      data: await this.usersService.update(id, updateUserDto),
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.usersService.remove(id);
    return {
      message: 'Usuario eliminado exitosamente',
    };
  }

  @Post(':userId/roles/:roleId')
  async assignRole(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('roleId', ParseIntPipe) roleId: number,
  ) {
    return {
      message: 'Rol asignado exitosamente',
      data: await this.usersService.assignRole(userId, roleId),
    };
  }

  @Delete(':userId/roles/:roleId')
  async removeRole(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('roleId', ParseIntPipe) roleId: number,
  ) {
    return {
      message: 'Rol removido exitosamente',
      data: await this.usersService.removeRole(userId, roleId),
    };
  }
}
