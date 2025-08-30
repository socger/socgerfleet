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
import { UserFiltersDto } from './dto/user-filters.dto';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(@Query() query: any) {
    // Manejar paginación
    const paginationDto = new PaginationDto();
    paginationDto.page = query.page ? parseInt(query.page, 10) : 1;
    paginationDto.limit = query.limit ? parseInt(query.limit, 10) : 10;

    // Validar límites
    if (paginationDto.page < 1) paginationDto.page = 1;
    if (paginationDto.limit < 1) paginationDto.limit = 10;
    if (paginationDto.limit > 100) paginationDto.limit = 100;

    // Crear filtros DTO
    const filtersDto = new UserFiltersDto();
    if (query.search) filtersDto.search = query.search;
    if (query.username) filtersDto.username = query.username;
    if (query.email) filtersDto.email = query.email;
    if (query.firstName) filtersDto.firstName = query.firstName;
    if (query.lastName) filtersDto.lastName = query.lastName;
    if (query.isActive !== undefined)
      filtersDto.isActive = query.isActive === 'true';
    if (query.roleName) filtersDto.roleName = query.roleName;
    if (query.roleId) filtersDto.roleId = parseInt(query.roleId, 10);
    if (query.createdFrom) filtersDto.createdFrom = query.createdFrom;
    if (query.createdTo) filtersDto.createdTo = query.createdTo;
    if (query.sortBy) filtersDto.sortBy = query.sortBy;
    if (query.sortOrder) filtersDto.sortOrder = query.sortOrder;

    const result = await this.usersService.findAll(paginationDto, filtersDto);

    return {
      message: 'Lista de usuarios obtenida exitosamente',
      ...result,
      filters: filtersDto, // Incluir filtros aplicados en la respuesta
    };
  }

  @Get('search')
  async search(@Query('q') searchTerm: string, @Query('limit') limit?: string) {
    const parsedLimit = limit ? parseInt(limit, 10) : 10;
    const results = await this.usersService.search(searchTerm, parsedLimit);

    return {
      message: 'Búsqueda completada exitosamente',
      data: results,
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
