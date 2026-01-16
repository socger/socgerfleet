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

### **5. Ejecutar la aplicación**
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

Es decir, este sería el Workflow Completo:
  1. Crear entidad → vehicles.entity.ts
  2. Crear DTOs con decoradores Swagger
  3. Crear controlador con decoradores Swagger
  4. Reiniciar aplicación: npm run start:dev
  5. ✅ Swagger actualizado automáticamente

Y este sería el Checklist para Nuevas Entidades:
  ✅ CreateDto con @ApiProperty
  ✅ UpdateDto con PartialType de @nestjs/swagger
  ✅ FiltersDto con @ApiPropertyOptional (si aplica)
  ✅ Controlador con @ApiTags
  ✅ Cada método con @ApiOperation
  ✅ Responses con @ApiResponse
  ✅ @ApiBearerAuth si requiere JWT
  ✅ @ApiParam para parámetros de ruta
  ✅ @ApiQuery para query parameters

Ejemplo Completo de Nueva Entidad:
  Si creas un módulo de Vehicles, solo necesitas:
    1. create-vehicle.dto.ts (con decoradores)
    2. update-vehicle.dto.ts (con PartialType)
    3. vehicles.controller.ts (con todos los decoradores)

  Swagger se actualiza automáticamente al reiniciar la app. No hay pasos adicionales

💡 Tips Importantes
  - Siempre usa ejemplos realistas en @ApiProperty
  - Documenta todos los códigos de error con @ApiResponse
  - Agrupa lógicamente con @ApiTags
  - Usa PartialType de @nestjs/swagger, no de mapped-types
  - Reinicia la app para ver cambios (o usa watch mode)

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
POST /auth/login          # Login con refresh token
POST /auth/register       # Registro de usuario
POST /auth/refresh        # Renovar access token
POST /auth/logout         # Logout específico
POST /auth/logout-all     # Logout masivo
POST /auth/profile        # Obtener perfil
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
Ten, siempre en cuenta, que en este repositorio tenemos la carpeta ""resources/documents/AI conversations" donde se van guardando todas las conversaciones mantenidas con la IA. 

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
