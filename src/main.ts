import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar versionado de API (URI Versioning)
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Habilitar validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('SocgerFleet API')
    .setDescription(
      'Sistema avanzado de gestión de usuarios con autenticación JWT y refresh tokens. ' +
      'API REST moderna con control de acceso basado en roles (RBAC) y funcionalidades de búsqueda y filtrado. ' +
      '\n\n**Versionado:** Esta API utiliza versionado URI. Todas las rutas están prefijadas con /v1/ (ejemplo: /v1/users, /v1/auth/login).',
    )
    .setVersion('1.0.0')
    .addTag('auth', 'Endpoints de autenticación y gestión de sesiones')
    .addTag('users', 'Gestión de usuarios con filtros avanzados')
    .addTag('roles', 'Gestión de roles y permisos')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Ingresa el JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .setContact(
      'Socger',
      'https://github.com/socger',
      'socger@gmail.com',
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'SocgerFleet API Docs',
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log(`🚀 Application is running on: http://localhost:${process.env.PORT ?? 3000}`);
  console.log(`📚 Swagger documentation: http://localhost:${process.env.PORT ?? 3000}/api/docs`);
}
bootstrap();
