import {
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body(ValidationPipe) loginDto: LoginDto) {
    const result = await this.authService.login(loginDto);
    return {
      message: 'Login exitoso',
      ...result,
    };
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body(ValidationPipe) registerDto: RegisterDto) {
    const result = await this.authService.register(registerDto);
    return {
      message: 'Usuario registrado exitosamente',
      ...result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile')
  getProfile(@Request() req) {
    return {
      message: 'Perfil obtenido exitosamente',
      user: req.user,
    };
  }
}
