import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  async findAll() {
    return {
      message: 'Lista de roles obtenida exitosamente',
      data: await this.rolesService.findAll(),
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return {
      message: 'Rol obtenido exitosamente',
      data: await this.rolesService.findOne(id),
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(ValidationPipe) createRoleDto: CreateRoleDto) {
    return {
      message: 'Rol creado exitosamente',
      data: await this.rolesService.create(createRoleDto),
    };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateRoleDto: UpdateRoleDto,
  ) {
    return {
      message: 'Rol actualizado exitosamente',
      data: await this.rolesService.update(id, updateRoleDto),
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.rolesService.remove(id);
    return {
      message: 'Rol eliminado exitosamente',
    };
  }
}
