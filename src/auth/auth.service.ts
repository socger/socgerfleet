import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RolesService } from '../roles/roles.service';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private rolesService: RolesService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = {
      email: user.email,
      sub: user.id,
      username: user.username,
      roles: user.roles,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: user.roles,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    // Verificar si el usuario ya existe
    const existingUserByEmail = await this.usersService.findByEmail(
      registerDto.email,
    );

    if (existingUserByEmail) {
      throw new ConflictException('El email ya está registrado');
    }

    const existingUserByUsername = await this.usersService.findByUsername(
      registerDto.username,
    );

    if (existingUserByUsername) {
      throw new ConflictException('El nombre de usuario ya está en uso');
    }

    // Crear el usuario
    const user = await this.usersService.create(registerDto);

    // Asignar rol por defecto (usuario)
    let defaultRole = await this.rolesService.findByName('user');
    if (!defaultRole) {
      // Si no existe el rol 'user', lo creamos
      defaultRole = await this.rolesService.create({
        name: 'user',
        description: 'Usuario básico del sistema',
      });
    }

    await this.usersService.assignRole(user.id, defaultRole.id);

    // Obtener el usuario con roles
    const userWithRoles = await this.usersService.findOne(user.id);

    const payload = {
      email: userWithRoles.email,
      sub: userWithRoles.id,
      username: userWithRoles.username,
      roles: userWithRoles.roles,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: userWithRoles.id,
        username: userWithRoles.username,
        email: userWithRoles.email,
        firstName: userWithRoles.firstName,
        lastName: userWithRoles.lastName,
        roles: userWithRoles.roles,
      },
    };
  }
}
