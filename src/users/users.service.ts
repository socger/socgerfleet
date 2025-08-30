import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, SelectQueryBuilder } from 'typeorm';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginationResultDto } from '../common/dto/pagination-result.dto';
import { UserFiltersDto } from './dto/user-filters.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async findAll(
    paginationDto: PaginationDto,
    filtersDto?: UserFiltersDto,
  ): Promise<PaginationResultDto<User>> {
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;

    // Crear query builder
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'role')
      .select([
        'user.id',
        'user.username',
        'user.email',
        'user.firstName',
        'user.lastName',
        'user.isActive',
        'user.createdAt',
        'role.id',
        'role.name',
        'role.description',
      ]);

    // Aplicar filtros
    this.applyUserFilters(queryBuilder, filtersDto);

    // Aplicar ordenación
    if (filtersDto?.sortBy) {
      const sortField =
        filtersDto.sortBy === 'createdAt'
          ? 'user.createdAt'
          : `user.${filtersDto.sortBy}`;
      queryBuilder.orderBy(sortField, filtersDto.sortOrder || 'DESC');
    } else {
      queryBuilder.orderBy('user.createdAt', 'DESC');
    }

    // Obtener total y datos paginados
    const total = await queryBuilder.getCount();
    const users = await queryBuilder.skip(skip).take(limit).getMany();

    return new PaginationResultDto(users, total, page, limit);
  }

  private applyUserFilters(
    queryBuilder: SelectQueryBuilder<User>,
    filters?: UserFiltersDto,
  ): void {
    if (!filters) return;

    // Búsqueda general (en username, email, firstName, lastName)
    if (filters.search) {
      queryBuilder.andWhere(
        '(user.username LIKE :search OR user.email LIKE :search OR user.firstName LIKE :search OR user.lastName LIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    // Filtro por username específico
    if (filters.username) {
      queryBuilder.andWhere('user.username LIKE :username', {
        username: `%${filters.username}%`,
      });
    }

    // Filtro por email específico
    if (filters.email) {
      queryBuilder.andWhere('user.email LIKE :email', {
        email: `%${filters.email}%`,
      });
    }

    // Filtro por firstName
    if (filters.firstName) {
      queryBuilder.andWhere('user.firstName LIKE :firstName', {
        firstName: `%${filters.firstName}%`,
      });
    }

    // Filtro por lastName
    if (filters.lastName) {
      queryBuilder.andWhere('user.lastName LIKE :lastName', {
        lastName: `%${filters.lastName}%`,
      });
    }

    // Filtro por estado activo/inactivo
    if (typeof filters.isActive === 'boolean') {
      queryBuilder.andWhere('user.isActive = :isActive', {
        isActive: filters.isActive,
      });
    }

    // Filtro por rol específico (por nombre)
    if (filters.roleName) {
      queryBuilder.andWhere('role.name = :roleName', {
        roleName: filters.roleName,
      });
    }

    // Filtro por ID de rol específico
    if (filters.roleId) {
      queryBuilder.andWhere('role.id = :roleId', { roleId: filters.roleId });
    }

    // Filtro por rango de fechas de creación
    if (filters.createdFrom) {
      queryBuilder.andWhere('user.createdAt >= :createdFrom', {
        createdFrom: new Date(filters.createdFrom + ' 00:00:00'),
      });
    }

    if (filters.createdTo) {
      queryBuilder.andWhere('user.createdAt <= :createdTo', {
        createdTo: new Date(filters.createdTo + ' 23:59:59'),
      });
    }
  }

  // Método específico para búsqueda rápida
  async search(searchTerm: string, limit: number = 10): Promise<User[]> {
    return this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'role')
      .where(
        'user.username LIKE :searchTerm OR user.email LIKE :searchTerm OR user.firstName LIKE :searchTerm OR user.lastName LIKE :searchTerm',
        { searchTerm: `%${searchTerm}%` },
      )
      .select([
        'user.id',
        'user.username',
        'user.email',
        'user.firstName',
        'user.lastName',
        'user.isActive',
        'role.id',
        'role.name',
      ])
      .limit(limit)
      .getMany();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['roles'],
      select: [
        'id',
        'username',
        'email',
        'firstName',
        'lastName',
        'isActive',
        'createdAt',
      ],
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return user;
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { username },
      relations: ['roles'],
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      relations: ['roles'],
    });
  }

  async create(userData: {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    roleIds?: number[];
  }): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = this.userRepository.create({
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      firstName: userData.firstName,
      lastName: userData.lastName,
    });

    if (userData.roleIds && userData.roleIds.length > 0) {
      const roles = await this.roleRepository.find({
        where: { id: In(userData.roleIds) },
      });
      user.roles = roles;
    }

    await this.userRepository.save(user);

    return this.findOne(user.id);
  }

  async update(
    id: number,
    updateData: {
      username?: string;
      email?: string;
      firstName?: string;
      lastName?: string;
      isActive?: boolean;
      roleIds?: number[];
    },
  ): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['roles'],
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    Object.assign(user, updateData);

    if (updateData.roleIds) {
      const roles = await this.roleRepository.find({
        where: { id: In(updateData.roleIds) },
      });
      user.roles = roles;
    }

    await this.userRepository.save(user);

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

  async assignRole(userId: number, roleId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }

    const role = await this.roleRepository.findOne({ where: { id: roleId } });

    if (!role) {
      throw new NotFoundException(`Rol con ID ${roleId} no encontrado`);
    }

    if (!user.roles.some((r) => r.id === roleId)) {
      user.roles.push(role);
      await this.userRepository.save(user);
    }

    return this.findOne(userId);
  }

  async removeRole(userId: number, roleId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }

    user.roles = user.roles.filter((role) => role.id !== roleId);
    await this.userRepository.save(user);

    return this.findOne(userId);
  }
}
