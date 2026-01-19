<div align="center">
  <h1>🚀 SocgerFleet API</h1>
  <p>Sistema avanzado de gestión de usuarios con autenticación JWT y refresh tokens</p>
  
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" />
</div>

## 📋 Descripción

**SocgerFleet** es una API REST moderna desarrollada en NestJS que proporciona un sistema completo de gestión de usuarios con autenticación avanzada, control de acceso basado en roles (RBAC) y funcionalidades de búsqueda y filtrado de nivel empresarial.

## ✨ Características Principales

### 🔐 **Autenticación y Seguridad**
- **JWT con Refresh Tokens** - Sistema de doble token con rotación automática
- **Bcrypt** - Hash seguro de contraseñas
- **Guards** - Protección de rutas con validación de roles
- **Gestión de sesiones** - Control granular por dispositivo

### 👥 **Gestión de Usuarios y Roles**
- **CRUD completo** - Crear, leer, actualizar, eliminar usuarios y roles
- **RBAC** - Control de acceso basado en roles
- **Asignación dinámica** - Asignar/remover roles con validaciones
- **Validaciones robustas** - Prevención de duplicados y datos inválidos

### 🔍 **Sistema Avanzado de Filtros**
- **Búsqueda inteligente** - Búsqueda en múltiples campos simultáneamente
- **Filtros específicos** - Por username, email, roles, fechas, etc.
- **Paginación optimizada** - Con meta información completa
- **Ordenación flexible** - Ascendente/descendente por cualquier campo
- **Combinación de filtros** - Múltiples criterios simultáneos

### 🗄️ **Base de Datos Avanzada**
- **Migraciones TypeORM** - Versionado y control de cambios en el esquema
- **Soft Deletes** - Borrado lógico en lugar de físico (recuperable)
- **Auditoría completa** - Trazabilidad de quién creó, modificó y eliminó registros
- **Seeders** - Datos iniciales automatizados para desarrollo y pruebas

## 🛠️ Stack Tecnológico

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **NestJS** | ^10.0.0 | Framework principal |
| **TypeScript** | ^5.1.3 | Lenguaje de programación |
| **TypeORM** | ^0.3.17 | ORM para base de datos |
| **MySQL** | 8.0 | Base de datos |
| **JWT** | ^10.2.0 | Autenticación |
| **Bcrypt** | ^5.1.1 | Hash de contraseñas |
| **Class Validator** | ^0.14.0 | Validación de DTOs |
| **Swagger/OpenAPI** | ^7.4.2 | Documentación interactiva de API |
| **Docker** | Latest | Containerización |

## 🏗️ Arquitectura

```
src/
├── auth/                 # Módulo de autenticación
│   ├── controllers/      # Controladores (login, register, refresh)
│   ├── services/         # Lógica de negocio + RefreshTokenService
│   ├── guards/           # Guards de autenticación y autorización
│   ├── strategies/       # Estrategias JWT y Local
│   └── dto/             # DTOs de validación
├── users/               # Módulo de usuarios
│   ├── controllers/     # CRUD + filtros avanzados
│   ├── services/        # Lógica de negocio + búsqueda
│   └── dto/            # DTOs de validación y filtros
├── roles/               # Módulo de roles
├── entities/            # Entidades TypeORM (User, Role, RefreshToken)
├── common/              # DTOs comunes (paginación, etc.)
└── database/            # Configuración de base de datos
```

## 🚀 Instalación y Configuración

### **1. Clonar el repositorio**
```bash
git clone <tu-repositorio>
cd socgerfleet
```

### **2. Instalar dependencias**
```bash
npm install
```

### **3. Configurar variables de entorno**
```bash
cp .env.example .env
```

Editar [`.env`](.env ):
```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=socger
DB_PASSWORD=tu_password
DB_DATABASE=socgerfleet

# JWT
JWT_SECRET=tu_jwt_secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=tu_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d

# App
PORT=3000
NODE_ENV=development
```

### **4. Levantar contenedores Docker**
```bash
  docker-compose up -d 
ó el comando más moderno
  docker compose up -d 
```

### **5. Ejecutar migraciones de base de datos**

⚠️ **IMPORTANTE**: Este proyecto usa migraciones TypeORM (synchronize: false).  
Las migraciones son **OBLIGATORIAS** para crear/actualizar el esquema de la base de datos.

```bash
npm run migration:run
```

Si es la primera vez, esto creará las tablas con campos de auditoría:
- `created_at`, `updated_at` - Timestamps automáticos
- `deleted_at` - Para soft delete (borrado lógico)
- `created_by`, `updated_by`, `deleted_by` - Auditoría de usuarios

### **6. (Opcional) Poblar base de datos con datos iniciales**
```bash
npm run seed:run
```

Esto creará usuarios de prueba:
- **admin@socgerfleet.com** (contraseña: Admin123!)
- **moderator@socgerfleet.com** (contraseña: Moderator123!)
- **user@socgerfleet.com** (contraseña: User123!)

### **7. Ejecutar la aplicación**
```bash
# Desarrollo
npm run start:dev

# Producción
npm run start:prod
```

La aplicación estará disponible en:
- **API**: http://localhost:3000
- **Swagger UI**: http://localhost:3000/api/docs
- **phpMyAdmin**: http://localhost:8080

## 🗄️ Gestión de Base de Datos

### **Migraciones**

Las migraciones permiten versionar los cambios en el esquema de la base de datos:

```bash
# Generar nueva migración (detecta cambios en entidades)
npm run migration:generate -- src/database/migrations/NombreMigracion

# Crear migración vacía (para cambios manuales)
npm run migration:create -- src/database/migrations/NombreMigracion

# Ejecutar migraciones pendientes
npm run migration:run

# Revertir última migración
npm run migration:revert

# Ver estado de migraciones
npm run migration:show
```

⚠️ **IMPORTANTE**: 
- El proyecto tiene `synchronize: false` - **Debes usar migraciones para cambios en el esquema**
- Siempre revisa la migración generada antes de ejecutarla
- Prueba en desarrollo antes de aplicar en producción
- Las migraciones se ejecutan en orden cronológico

**Flujo al crear nuevas entidades:**
1. Crear/modificar entidad
2. `npm run migration:generate -- src/database/migrations/AddNuevaEntidad`
3. Revisar archivo generado en `src/database/migrations/`
4. `npm run migration:run`
5. `npm run migration:show` (verificar que se aplicó)

### **Seeders**

Los seeders permiten poblar la base de datos con datos iniciales:

```bash
# Ejecutar todos los seeders
npm run seed:run
```

**Características:**
- **Idempotentes**: Se pueden ejecutar múltiples veces sin duplicar datos
- **Datos de prueba**: Usuarios admin, moderator, user con contraseñas seguras
- **Roles iniciales**: admin, moderator, user

**Crear nuevo seeder:**
1. Crear archivo en `src/database/seeds/`
2. Implementar método `run()`
3. Registrar en `src/database/seeds/run-seeders.ts`

### **Soft Deletes y Auditoría**

El proyecto implementa:

**Soft Delete** (Borrado Lógico):
- Los registros NO se borran físicamente de la base de datos
- Se marca el campo `deleted_at` con la fecha de eliminación
- Ventajas: Recuperables, trazabilidad, cumplimiento normativo
- Por defecto, las consultas excluyen registros eliminados

```typescript
// Excluir eliminados (comportamiento por defecto)
await repository.find();

// Incluir eliminados
await repository.find({ withDeleted: true });

// Solo eliminados
await repository.find({ 
  where: { deletedAt: Not(IsNull()) },
  withDeleted: true 
});
```

**Auditoría Completa**:
- `created_by` - ID del usuario que creó el registro
- `updated_by` - ID del usuario que actualizó
- `deleted_by` - ID del usuario que eliminó
- `created_at` - Fecha de creación (automático)
- `updated_at` - Fecha de última actualización (automático)
- `deleted_at` - Fecha de eliminación (automático con soft delete)

**Beneficios:**
- ✅ Trazabilidad completa de todas las operaciones
- ✅ Identificación de quién realizó cada cambio
- ✅ Cumplimiento de auditorías y normativas (GDPR, SOC 2)
- ✅ Recuperación de datos eliminados accidentalmente
- ✅ Análisis de patrones de uso y eliminación

📖 Más información: [Mejoras de Base de Datos](resources/documents/AI%20conversations/Mejoras-Base-Datos.md)

## 📡 API Endpoints

### **� Documentación Interactiva**

La API cuenta con documentación interactiva completa usando **Swagger/OpenAPI**:

```
http://localhost:3000/api/docs
```

Así que ten en cuenta swagger/OpenAPI cada vez que crees NUEVOS:
  - endpoints
  - DTOs
  - Controladores
  - UpdateDto (heredados con PartialType)

### **🏗️ Crear Nuevas Entidades (Workflow Actualizado)**

⚠️ **IMPORTANTE**: Desde la implementación de migraciones, soft deletes y auditoría, el proceso ha cambiado:

#### **Paso 1: Crear Entidad**
```typescript
// ✅ SIEMPRE extender de BaseEntity (incluye auditoría y soft delete)
import { BaseEntity } from './base.entity';
import { Entity, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('vehicles')
export class Vehicle extends BaseEntity {
  // ❌ NO incluir: id, createdAt, updatedAt, deletedAt, createdBy, updatedBy, deletedBy
  // ✅ Ya están en BaseEntity
  
  @Column({ unique: true })
  @ApiProperty({ example: 'ABC1234', description: 'Matrícula del vehículo' })
  plate: string;
  
  @Column()
  @ApiProperty({ example: 'Toyota Corolla', description: 'Modelo del vehículo' })
  model: string;
}
```

#### **Paso 2: Crear DTOs con Swagger**
```typescript
// CreateDto
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateVehicleDto {
  @ApiProperty({ 
    example: 'ABC1234',
    description: 'Matrícula única del vehículo',
    maxLength: 10
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  plate: string;
  
  @ApiProperty({ 
    example: 'Toyota Corolla',
    description: 'Modelo del vehículo'
  })
  @IsString()
  @IsNotEmpty()
  model: string;
}

// UpdateDto - ⚠️ IMPORTANTE: Usar PartialType de @nestjs/swagger
import { PartialType } from '@nestjs/swagger'; // ✅ Correcto
// import { PartialType } from '@nestjs/mapped-types'; // ❌ Incorrecto

export class UpdateVehicleDto extends PartialType(CreateVehicleDto) {
  // Hereda automáticamente todas las propiedades como opcionales
}
```

#### **Paso 3: Crear Servicio con Auditoría**
```typescript
// ✅ Agregar parámetros opcionales para auditoría
async create(dto: CreateDto, createdBy?: number) {
  const entity = this.repository.create({ ...dto, createdBy });
  return this.repository.save(entity);
}

async update(id: number, dto: UpdateDto, updatedBy?: number) {
  const entity = await this.findOne(id);
  Object.assign(entity, dto);
  if (updatedBy) entity.updatedBy = updatedBy;
  return this.repository.save(entity);
}

// ⚠️ Usar softRemove() para soft delete
async remove(id: number, deletedBy?: number) {
  const entity = await this.findOne(id);
  if (deletedBy) entity.deletedBy = deletedBy;
  await this.repository.softRemove(entity); // ✅ Soft delete
  // await this.repository.remove(entity); // ❌ NO hacer esto
}
```

#### **Paso 4: Crear Controlador con JWT y Auditoría**
```typescript
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('vehicles')
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  // ✅ Operaciones de escritura requieren autenticación
  @Post()
  @UseGuards(JwtAuthGuard)  // ✅ Requerido para auditoría
  @ApiBearerAuth('JWT-auth') // ✅ Para Swagger
  @ApiOperation({ summary: 'Crear nuevo vehículo' })
  @ApiResponse({ status: 201, description: 'Vehículo creado exitosamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async create(@Body() dto: CreateVehicleDto, @Request() req) {
    const createdBy = req.user?.userId;  // ✅ Extraer userId
    return this.vehiclesService.create(dto, createdBy);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Actualizar vehículo' })
  async update(
    @Param('id') id: number, 
    @Body() dto: UpdateVehicleDto, 
    @Request() req
  ) {
    const updatedBy = req.user?.userId;
    return this.vehiclesService.update(id, dto, updatedBy);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Eliminar vehículo (soft delete)' })
  async remove(@Param('id') id: number, @Request() req) {
    const deletedBy = req.user?.userId;
    await this.vehiclesService.remove(id, deletedBy);
    return { message: 'Vehículo eliminado exitosamente' };
  }
  
  // ✅ Operaciones de lectura pueden ser públicas o protegidas según necesidad
  @Get()
  @ApiOperation({ summary: 'Listar todos los vehículos' })
  async findAll() {
    return this.vehiclesService.findAll();
  }
}
```

#### **Paso 5: Registrar Entidad**
```typescript
// src/database/database.config.ts
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { RefreshToken } from '../entities/refresh-token.entity';
import { Vehicle } from '../entities/vehicle.entity'; // ✅ Importar

entities: [
  User, 
  Role, 
  RefreshToken, 
  Vehicle, // ✅ Agregar nueva entidad
],

// También registrar en app.module.ts
imports: [
  TypeOrmModule.forFeature([Vehicle]), // ✅ En el módulo correspondiente
],
```

#### **Paso 6: Generar y Ejecutar Migración**
```bash
# ⚠️ NO confiar en synchronize (está en false)
# Generar migración
npm run migration:generate -- src/database/migrations/AddVehicleEntity

# Revisar migración generada
# Ejecutar migración
npm run migration:run

# Verificar
npm run migration:show
```

#### **Paso 7: (Opcional) Crear Seeder**
```typescript
// src/database/seeds/vehicle.seeder.ts
export class VehicleSeeder {
  public async run(): Promise<void> {
    // Crear datos iniciales
  }
}
```

#### **Checklist Completo para Nuevas Entidades**

**Base de Datos:**
- [ ] Entidad extiende de `BaseEntity`
- [ ] NO incluir campos duplicados (id, timestamps, auditoría)
- [ ] Registrar en `database.config.ts`
- [ ] Generar migración con `npm run migration:generate`
- [ ] Ejecutar migración con `npm run migration:run`
- [ ] (Opcional) Crear seeder para datos iniciales

**Servicio:**
- [ ] Métodos `create()`, `update()`, `remove()` con parámetros de auditoría
- [ ] Usar `softRemove()` en lugar de `remove()`
- [ ] Pasar `createdBy`, `updatedBy`, `deletedBy` al repository

**Controlador:**
- [ ] Operaciones de escritura con `@UseGuards(JwtAuthGuard)`
- [ ] Agregar `@ApiBearerAuth()` para Swagger
- [ ] Incluir `@Request() req` para obtener userId
- [ ] Extraer `req.user?.userId` y pasar a servicios

**Swagger/OpenAPI:**
- [ ] CreateDto con `@ApiProperty`
- [ ] UpdateDto con `PartialType` de `@nestjs/swagger`
- [ ] FiltersDto con `@ApiPropertyOptional` (si aplica)
- [ ] Controlador con `@ApiTags`
- [ ] Cada método con `@ApiOperation`
- [ ] Responses con `@ApiResponse`
- [ ] `@ApiParam` para parámetros de ruta
- [ ] `@ApiQuery` para query parameters

**Validación:**
- [ ] DTOs con decoradores de `class-validator`
- [ ] Validar duplicados en servicio
- [ ] Manejo de errores apropiado

📖 **Guía Detallada**: [Crear Nuevas Entidades](resources/documents/AI%20conversations/GUIA-Crear-Nuevas-Entidades.md)

💡 Tips Importantes
  - Siempre usa ejemplos realistas en @ApiProperty
  - Documenta todos los códigos de error con @ApiResponse
  - Agrupa lógicamente con @ApiTags
  - Usa PartialType de @nestjs/swagger, no de mapped-types
  - Reinicia la app para ver cambios (o usa watch mode)

⚠️ **Errores Comunes a Evitar:**
  1. ❌ **No extender de BaseEntity** → Perderás auditoría y soft delete automáticos
  2. ❌ **Usar `remove()` en lugar de `softRemove()`** → Pérdida de datos irrecuperable (no hay vuelta atrás)
  3. ❌ **Olvidar `@Request() req` en controlador** → Sin trazabilidad de quién hizo el cambio
  4. ❌ **No generar migraciones** → El esquema no se actualiza (synchronize: false)
  5. ❌ **Usar PartialType de mapped-types** → Swagger no documenta correctamente los DTOs
  6. ❌ **Olvidar `@UseGuards(JwtAuthGuard)`** → Sin control de quién hace cambios (auditoría incompleta)
  7. ❌ **No pasar `userId` a los métodos de servicio** → Campos de auditoría quedan en `null`
  8. ❌ **Usar `@ApiBearerAuth()` sin argumento** → Debería ser `@ApiBearerAuth('JWT-auth')`

**💡 Consejos Adicionales:**
  - Siempre revisa la migración generada antes de ejecutarla
  - Prueba primero en desarrollo antes de aplicar en producción
  - Los campos de auditoría son opcionales (`?`) para evitar errores en seeders
  - Usa `withDeleted: true` para consultar registros eliminados cuando sea necesario
  - Considera crear un seeder para datos de prueba de la nueva entidad

**Características de Swagger:**
- 🔍 **Exploración interactiva** - Prueba todos los endpoints desde el navegador
- 📝 **Documentación completa** - Descripciones detalladas de cada endpoint
- 🔐 **Autenticación integrada** - Prueba endpoints protegidos con JWT
- 📊 **Schemas detallados** - Visualiza la estructura de requests y responses
- ✨ **Try it out** - Ejecuta peticiones reales directamente

**Cómo usar Swagger con JWT:**
1. Primero hacer login en `/auth/login` para obtener el `accessToken`
2. Clic en el botón **"Authorize" 🔓** en la esquina superior derecha
3. Ingresar: `Bearer <tu_access_token>` (sin las comillas angulares)
4. Clic en "Authorize" y luego "Close"
5. Ahora puedes probar los endpoints protegidos

### **�🔐 Autenticación**
```http
POST /auth/login                      # Login con refresh token
POST /auth/register                   # Registro de usuario
POST /auth/refresh                    # Renovar access token
POST /auth/logout                     # Logout específico
POST /auth/logout-all                 # Logout masivo
POST /auth/profile                    # Obtener perfil
```

### **🔑 Gestión de Contraseñas**
```http
POST /auth/request-password-reset     # Solicitar reset de contraseña (envía email)
POST /auth/reset-password             # Resetear contraseña con token
POST /auth/change-password            # Cambiar contraseña (autenticado)
GET  /auth/verify-email?token=xxx     # Verificar email de usuario
```

### **👥 Usuarios**
```http
GET    /users             # Listar usuarios (con filtros)
GET    /users/search      # Búsqueda rápida
GET    /users/:id         # Obtener usuario
POST   /users             # Crear usuario
PUT    /users/:id         # Actualizar usuario
DELETE /users/:id         # Eliminar usuario
POST   /users/:id/roles/:roleId    # Asignar rol
DELETE /users/:id/roles/:roleId    # Remover rol
```

### **🛡️ Roles**
```http
GET    /roles             # Listar roles (con filtros)
GET    /roles/:id         # Obtener rol
POST   /roles             # Crear rol
PUT    /roles/:id         # Actualizar rol
DELETE /roles/:id         # Eliminar rol
```

## 🧪 Testing

### **Probar con REST Client**
Los archivos de prueba están en [`test endpoints with REST CLIENT extension/`](test endpoints with REST CLIENT extension/):

```bash
# Pruebas generales CRUD
test endpoints with REST CLIENT extension/api-tests.http

# Pruebas de refresh tokens
test endpoints with REST CLIENT extension/refresh-tokens-tests.http
```

### **Filtros Avanzados**
```http
# Buscar usuarios por múltiples criterios
GET /users?search=admin&role=admin&isActive=true&page=1&limit=10&sortBy=username&sortOrder=ASC

# Filtrar roles con usuarios
GET /roles?minUsers=1&maxUsers=5&sortBy=userCount&sortOrder=DESC
```

## 🔒 Seguridad

### **Características Implementadas**
- ✅ **Refresh Token Rotation** - Tokens rotatorios para máxima seguridad
- ✅ **Validación de duplicados** - Email y username únicos
- ✅ **Hash de contraseñas** - Bcrypt con salt rounds
- ✅ **Guards de autorización** - Protección basada en roles
- ✅ **Limpieza automática** - Tokens expirados eliminados automáticamente
- ✅ **Trazabilidad** - IP y device info en refresh tokens
- ✅ **Verificación de email** - Email de confirmación al registrarse
- ✅ **Recuperación de contraseña** - Reset seguro vía email
- ✅ **Historial de contraseñas** - Validación contra últimas 5 contraseñas
- ✅ **Validación de contraseña fuerte** - Requisitos de complejidad
- ✅ **Notificaciones por email** - Confirmación de cambios de seguridad
- ✅ **Auditoría completa** - Registro de quién crea, modifica y elimina registros
- ✅ **Soft delete** - Recuperación de datos eliminados accidentalmente
- ✅ **Migraciones versionadas** - Control total del esquema de base de datos

### **Flujo de Autenticación**
1. **Login** → Recibe access token (15 min) + refresh token (7 días)
2. **Usar API** → Access token en header Authorization
3. **Token expira** → Usar refresh token para obtener nuevo access token
4. **Logout** → Revocar refresh tokens específicos o todos

## 🐳 Docker

### **Servicios disponibles**
- **MySQL** - Base de datos principal (puerto 3306)
- **phpMyAdmin** - Interfaz web (http://localhost:8080)

### **Comandos útiles**
```bash
# Levantar servicios
  docker-compose up -d 
ó el comando más moderno
  docker compose up -d 

# Ver logs
docker-compose logs -f

# Parar servicios
  docker-compose down
ó el comando más moderno
  docker compose down

# Acceder a MySQL
docker exec -it socgerfleet_mysql mysql -u socger -p
```

## 📊 Funcionalidades Destacadas

### **🔍 Sistema de Filtros**
- **37+ combinaciones** de filtros probadas
- **Búsqueda inteligente** en múltiples campos
- **Paginación eficiente** con meta información
- **Filtros por relaciones** (usuarios por rol, etc.)

### **⚡ Rendimiento**
- **Consultas optimizadas** con TypeORM
- **Índices automáticos** en campos clave
- **Paginación a nivel de BD** para escalabilidad

### **🛡️ Validaciones**
- **DTOs robustos** con class-validator
- **Manejo de errores** con códigos HTTP apropiados
- **Validaciones de negocio** (duplicados, relaciones, etc.)

## 📊 Documentación
Ten, siempre en cuenta, que en este repositorio tenemos la carpeta "resources/documents/AI conversations" donde se van guardando todas las conversaciones mantenidas con la IA.

### **📚 Documentación Adicional**

El proyecto incluye documentación detallada para diferentes aspectos:

**Base de Datos:**
- [Mejoras de Base de Datos](resources/documents/AI%20conversations/Mejoras-Base-Datos.md) - Guía completa de migraciones, seeders y auditoría
- [Checklist de Implementación](resources/documents/AI%20conversations/CHECKLIST-Implementacion-BD.md) - Pasos para aplicar las mejoras
- [Resumen de Implementación](resources/documents/AI%20conversations/RESUMEN-Implementacion-Completa.md) - Resumen ejecutivo de cambios

**Desarrollo:**
- [Guía: Crear Nuevas Entidades](resources/documents/AI%20conversations/GUIA-Crear-Nuevas-Entidades.md) - Workflow completo con ejemplos

**Conversaciones con IA:**
- Todas las conversaciones y decisiones de diseño se documentan en `resources/documents/AI conversations/`

## 📊 Como contestar a los prompt's que se hagan a la IA
Siempre se debe de contestar en español

## 🎯 Casos de Uso

### **Ideal para:**
- 🌐 **Aplicaciones web modernas** (React, Angular, Vue)
- 📱 **Apps móviles** (Flutter, React Native)
- 🏢 **Sistemas empresariales** con gestión de usuarios
- 🔐 **APIs que requieren seguridad avanzada**
- 📊 **Dashboards administrativos**

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver [`LICENSE`](LICENSE ) para más detalles.

## 👤 Autor

**Tu Nombre**
- GitHub: [@socger](https://github.com/socger)
- Email: socger@gmail.com

---

<div align="center">
  <p>⭐ ¡Dale una estrella si te gusta el proyecto! ⭐</p>
</div>
