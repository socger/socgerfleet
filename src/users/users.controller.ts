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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    return {
      message: 'Lista de usuarios obtenida exitosamente',
      data: await this.usersService.findAll(),
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
