import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async findAll(): Promise<Role[]> {
    return this.roleRepository.find({
      relations: ['users'],
    });
  }

  async findOne(id: number): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['users'],
    });

    if (!role) {
      throw new NotFoundException(`Rol con ID ${id} no encontrado`);
    }

    return role;
  }

  async findByName(name: string): Promise<Role | null> {
    return this.roleRepository.findOne({
      where: { name },
      relations: ['users'],
    });
  }

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    // Verificar si ya existe un rol con ese nombre
    const existingRole = await this.findByName(createRoleDto.name);
    if (existingRole) {
      throw new ConflictException(`Ya existe un rol con el nombre "${createRoleDto.name}"`);
    }

    const role = this.roleRepository.create(createRoleDto);
    return this.roleRepository.save(role);
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOne(id);

    // Si se está actualizando el nombre, verificar que no exista otro rol con ese nombre
    if (updateRoleDto.name && updateRoleDto.name !== role.name) {
      const existingRole = await this.findByName(updateRoleDto.name);
      if (existingRole) {
        throw new ConflictException(`Ya existe un rol con el nombre "${updateRoleDto.name}"`);
      }
    }

    Object.assign(role, updateRoleDto);
    return this.roleRepository.save(role);
  }

  async remove(id: number): Promise<void> {
    const role = await this.findOne(id);
    await this.roleRepository.remove(role);
  }
}
