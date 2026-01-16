import {
  Controller,
  Post,
  UseGuards,
  Body,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  Ip,
  Headers,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

// Interfaz para el request con usuario autenticado
interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    email: string;
    username: string;
    roles: any[];
  };
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Iniciar sesión',
    description:
      'Autenticar usuario con email y contraseña. Retorna access token (15 min) y refresh token (7 días).',
  })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso',
    schema: {
      example: {
        message: 'Login exitoso',
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: 1,
          username: 'admin',
          email: 'admin@socgerfleet.com',
          roles: ['admin'],
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  async login(
    @Body(ValidationPipe) loginDto: LoginDto,
    @Headers('user-agent') userAgent: string,
    @Ip() ipAddress: string,
  ) {
    return this.authService.login(loginDto, userAgent, ipAddress);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Registrar nuevo usuario',
    description:
      'Crear una nueva cuenta de usuario. El email y username deben ser únicos.',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario registrado exitosamente',
    schema: {
      example: {
        message: 'Usuario registrado exitosamente',
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: 2,
          username: 'johndoe',
          email: 'johndoe@example.com',
          firstName: 'John',
          lastName: 'Doe',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Email o username ya registrado',
  })
  async register(
    @Body(ValidationPipe) registerDto: RegisterDto,
    @Headers('user-agent') userAgent: string,
    @Ip() ipAddress: string,
  ) {
    return this.authService.register(registerDto, userAgent, ipAddress);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Renovar access token',
    description:
      'Obtener un nuevo access token usando el refresh token. El refresh token se rota automáticamente por seguridad.',
  })
  @ApiResponse({
    status: 200,
    description: 'Token renovado exitosamente',
    schema: {
      example: {
        message: 'Token renovado exitosamente',
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Refresh token inválido o expirado',
  })
  async refresh(@Body(ValidationPipe) refreshTokenDto: RefreshTokenDto) {
    return {
      message: 'Token renovado exitosamente',
      ...(await this.authService.refreshAccessToken(refreshTokenDto)),
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Cerrar sesión',
    description:
      'Cerrar sesión del dispositivo actual revocando el refresh token específico.',
  })
  @ApiResponse({
    status: 200,
    description: 'Logout exitoso',
    schema: {
      example: {
        message: 'Logout exitoso',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Refresh token inválido',
  })
  async logout(@Body(ValidationPipe) refreshTokenDto: RefreshTokenDto) {
    await this.authService.logout(refreshTokenDto.refreshToken);
    return {
      message: 'Logout exitoso',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout-all')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Cerrar todas las sesiones',
    description:
      'Cerrar sesión en todos los dispositivos revocando todos los refresh tokens del usuario.',
  })
  @ApiResponse({
    status: 200,
    description: 'Logout masivo exitoso',
    schema: {
      example: {
        message: 'Logout de todos los dispositivos exitoso',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async logoutAll(@Req() req: AuthenticatedRequest) {
    await this.authService.logoutAll(req.user.id);
    return {
      message: 'Logout de todos los dispositivos exitoso',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Obtener perfil del usuario',
    description:
      'Obtener información del usuario autenticado actualmente.',
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil obtenido exitosamente',
    schema: {
      example: {
        message: 'Perfil obtenido exitosamente',
        user: {
          id: 1,
          email: 'admin@socgerfleet.com',
          username: 'admin',
          roles: ['admin'],
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  getProfile(@Req() req: AuthenticatedRequest) {
    return {
      message: 'Perfil obtenido exitosamente',
      user: req.user,
    };
  }
}
