import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { RolesService } from '../roles/roles.service';
import { RefreshTokenService } from './services/refresh-token.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    roles: any[];
  };
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private rolesService: RolesService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private refreshTokenService: RefreshTokenService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  private generateAccessToken(user: any): string {
    const payload = {
      email: user.email,
      sub: user.id,
      username: user.username,
      roles: user.roles,
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '15m'),
    });
  }

  async login(
    loginDto: LoginDto,
    deviceInfo?: string,
    ipAddress?: string,
  ): Promise<AuthResponse> {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Cuenta desactivada');
    }

    // Generar tokens
    const accessToken = this.generateAccessToken(user);
    const refreshToken = await this.refreshTokenService.createRefreshToken(
      user.id,
      deviceInfo,
      ipAddress,
    );

    return {
      message: 'Login exitoso',
      accessToken,
      refreshToken,
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

  async register(
    registerDto: RegisterDto,
    deviceInfo?: string,
    ipAddress?: string,
  ): Promise<AuthResponse> {
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

    // Generar tokens
    const accessToken = this.generateAccessToken(userWithRoles);
    const refreshToken = await this.refreshTokenService.createRefreshToken(
      userWithRoles.id,
      deviceInfo,
      ipAddress,
    );

    return {
      message: 'Usuario registrado exitosamente',
      accessToken,
      refreshToken,
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

  async refreshAccessToken(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const refreshTokenEntity =
      await this.refreshTokenService.validateRefreshToken(
        refreshTokenDto.refreshToken,
      );

    if (!refreshTokenEntity) {
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }

    // Generar nuevo access token
    const accessToken = this.generateAccessToken(refreshTokenEntity.user);

    // Opcionalmente, generar nuevo refresh token (rotación)
    const newRefreshToken = await this.refreshTokenService.createRefreshToken(
      refreshTokenEntity.userId,
      refreshTokenEntity.deviceInfo,
      refreshTokenEntity.ipAddress,
    );

    // Revocar el refresh token anterior
    await this.refreshTokenService.revokeToken(refreshTokenDto.refreshToken);

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(refreshToken: string): Promise<void> {
    await this.refreshTokenService.revokeToken(refreshToken);
  }

  async logoutAll(userId: number): Promise<void> {
    await this.refreshTokenService.revokeAllUserTokens(userId);
  }
}
