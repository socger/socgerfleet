import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyEmailDto {
  @ApiProperty({
    description: 'Token de verificación recibido por email',
    example: 'xyz987abc654def321ghi098jkl765mno432pqr109',
  })
  @IsString()
  @IsNotEmpty({ message: 'El token es requerido' })
  token: string;
}
