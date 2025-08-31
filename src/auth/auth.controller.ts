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

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body(ValidationPipe) loginDto: LoginDto,
    @Headers('user-agent') userAgent: string,
    @Ip() ipAddress: string,
  ) {
    return this.authService.login(loginDto, userAgent, ipAddress);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body(ValidationPipe) registerDto: RegisterDto,
    @Headers('user-agent') userAgent: string,
    @Ip() ipAddress: string,
  ) {
    return this.authService.register(registerDto, userAgent, ipAddress);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body(ValidationPipe) refreshTokenDto: RefreshTokenDto) {
    return {
      message: 'Token renovado exitosamente',
      ...(await this.authService.refreshAccessToken(refreshTokenDto)),
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Body(ValidationPipe) refreshTokenDto: RefreshTokenDto) {
    await this.authService.logout(refreshTokenDto.refreshToken);
    return {
      message: 'Logout exitoso',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout-all')
  @HttpCode(HttpStatus.OK)
  async logoutAll(@Req() req: AuthenticatedRequest) {
    await this.authService.logoutAll(req.user.id);
    return {
      message: 'Logout de todos los dispositivos exitoso',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile')
  getProfile(@Req() req: AuthenticatedRequest) {
    return {
      message: 'Perfil obtenido exitosamente',
      user: req.user,
    };
  }
}
