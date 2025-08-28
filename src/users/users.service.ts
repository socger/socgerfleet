import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      relations: ['roles'],
      select: ['id', 'username', 'email', 'firstName', 'lastName', 'isActive', 'createdAt'],
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['roles'],
      select: ['id', 'username', 'email', 'firstName', 'lastName', 'isActive', 'createdAt'],
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
      const roles = await this.roleRepository.findByIds(userData.roleIds);
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
      const roles = await this.roleRepository.findByIds(updateData.roleIds);
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

    if (!user.roles.some(r => r.id === roleId)) {
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

    user.roles = user.roles.filter(role => role.id !== roleId);
    await this.userRepository.save(user);

    return this.findOne(userId);
  }
}
