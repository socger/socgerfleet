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
  Query,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

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

    const result = await this.rolesService.findAll(paginationDto);
    return {
      message: 'Lista de roles obtenida exitosamente',
      ...result,
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
