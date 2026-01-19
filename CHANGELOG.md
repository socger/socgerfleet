# Changelog

Todos los cambios notables de este proyecto se documentarán en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

## [Unreleased]

### Planeado
- Endpoint GraphQL para consultas flexibles
- Sistema de webhooks para integraciones
- Migración a v2 de la API con mejoras de paginación
- Rate limiting con Redis para entornos multi-servidor

---

## [1.1.2] - 2026-01-19

### Security
- **Rate Limiting** - Implementación de protección contra ataques de fuerza bruta y abuso de endpoints
  - Límite global: 100 peticiones por minuto para toda la API
  - Límites específicos por endpoint crítico:
    - Login: 5 intentos por minuto
    - Register: 3 intentos por minuto
    - Refresh token: 10 intentos por minuto
    - Request password reset: 3 intentos por 15 minutos
    - Reset password: 3 intentos por 15 minutos
  - Respuesta HTTP 429 al exceder límites
  - Headers informativos: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset
  - Identificación por IP del cliente
  - Paquete oficial @nestjs/throttler integrado
  - Script de verificación automática (test-rate-limiting.sh)
  - Documentación completa de configuración y testing

### Added
- Script `test-rate-limiting.sh` para verificar automáticamente el funcionamiento del rate limiting en todos los endpoints
- Documentación técnica: [Implementación de Rate Limiting](resources/documents/AI%20conversations/Implementación%20de%20Rate%20Limiting.md)

---

## [1.1.1] - 2026-01-19

### Security
- **CORS** - Implementación de Cross-Origin Resource Sharing
  - Control de orígenes permitidos mediante lista blanca configurable
  - Soporte para credenciales (cookies, tokens JWT)
  - Configuración de métodos HTTP permitidos
  - Cabeceras personalizadas permitidas y expuestas
  - Preflight caching optimizado (1 hora)
  - Variables de entorno: `CORS_ORIGIN`, `CORS_METHODS`
  - Script de verificación CORS (`test-cors.sh`)
  - Documentación completa de configuración y uso

- **Helmet** - Implementación de cabeceras de seguridad HTTP
  - Protección contra ataques XSS mediante Content-Security-Policy
  - Prevención de clickjacking con X-Frame-Options
  - Protección contra MIME type sniffing
  - Configuración de HSTS (Strict-Transport-Security)
  - Control de referrer policy
  - Configuración personalizada compatible con Swagger UI
  - Script de verificación de cabeceras (`test-helmet-headers.sh`)

---

## [1.1.0] - 2026-01-19

### Added
- **Versionado de API (URI Versioning)**
  - Implementación de versionado URI en todos los endpoints
  - Rutas versionadas: `/v1/users`, `/v1/auth/*`, `/v1/roles`
  - Configuración de versión por defecto v1
  - Documentación actualizada en Swagger con información de versionado
  - Preparación para futuras versiones de API sin romper compatibilidad

### Changed
- Actualizada documentación de Swagger para reflejar versionado URI
- Versión de la API actualizada a 1.0.0 en Swagger

---

## [1.0.0] - 2026-01-19

### Added
- **Sistema de Autenticación Completo**
  - Registro de usuarios con validación
  - Login con JWT (Access Token + Refresh Token)
  - Logout con invalidación de tokens
  - Estrategia Local y JWT para autenticación

- **Gestión Avanzada de Contraseñas**
  - Historial de contraseñas (últimas 5 contraseñas)
  - Validación de contraseñas previas al cambiar
  - Reseteo de contraseña mediante email
  - Cambio de contraseña para usuarios autenticados
  - Tokens de verificación con expiración

- **Sistema de Verificación de Email**
  - Envío de email de verificación al registro
  - Validación de email mediante token
  - Tokens con expiración de 24 horas
  - Notificación por email de cambios de contraseña

- **Sistema de Roles y Permisos (RBAC)**
  - Entidad de roles con permisos configurables
  - Guard de roles para proteger endpoints
  - Decorador `@Roles()` para control de acceso
  - Roles predefinidos: Admin, User

- **Gestión de Tokens de Refresh**
  - Refresh tokens con expiración configurable
  - Rotación de tokens al refrescar
  - Invalidación de tokens en logout
  - Limpieza automática de tokens expirados

- **CRUD de Usuarios**
  - Crear, leer, actualizar y eliminar usuarios
  - Paginación de listados
  - Filtros y búsqueda
  - Soft delete (desactivación de usuarios)

- **CRUD de Roles**
  - Gestión completa de roles
  - Asignación de permisos a roles
  - Control de acceso basado en roles

- **Documentación API**
  - Integración completa con Swagger/OpenAPI
  - Documentación automática de endpoints
  - Esquemas de DTOs documentados
  - Ejemplos de requests y responses
  - Autenticación Bearer en Swagger UI

- **Base de Datos**
  - Configuración con TypeORM
  - Migraciones automáticas
  - Seeds para datos iniciales
  - Soporte para MySQL
  - Entidades base con timestamps automáticos

- **Infraestructura**
  - Docker Compose para desarrollo
  - Contenedor MySQL con inicialización automática
  - Variables de entorno configurables
  - Scripts de gestión de contraseñas

- **Testing**
  - Suite de pruebas HTTP con REST Client
  - Tests para endpoints de autenticación
  - Tests para refresh tokens
  - Tests E2E configurados

### Security
- Hashing de contraseñas con bcrypt (10 rounds)
- Validación de contraseñas previas (historial de 5)
- Tokens JWT con expiración configurable
- Secrets para firmar tokens
- Validación y sanitización de inputs con class-validator
- Guards para protección de rutas
- CORS configurado
- Helmet para headers de seguridad

### Technical
- NestJS Framework
- TypeORM para ORM
- MySQL como base de datos
- Passport.js para autenticación
- JWT para tokens
- class-validator y class-transformer para validación
- Nodemailer para envío de emails
- bcrypt para hashing de contraseñas
- TypeScript con strict mode

---

## Notas

### Sobre el Versionado Semántico

Este proyecto usa [Versionado Semántico](https://semver.org/lang/es/):
- **MAJOR**: Cambios incompatibles en la API (breaking changes)
- **MINOR**: Nueva funcionalidad compatible con versiones anteriores
- **PATCH**: Correcciones de bugs compatibles con versiones anteriores

### Categorías de Cambios

- **Added**: Nuevas funcionalidades
- **Changed**: Cambios en funcionalidad existente
- **Deprecated**: Funcionalidades que se eliminarán próximamente
- **Removed**: Funcionalidades eliminadas
- **Fixed**: Correcciones de bugs
- **Security**: Mejoras de seguridad relacionadas con vulnerabilidades
- **Technical**: Cambios técnicos, dependencias, refactoring

### Política de Soporte

- Se mantiene soporte para las últimas 2 versiones MAJOR
- Las versiones deprecadas se anuncian con al menos 3 meses de antelación
- Los breaking changes se documentan claramente con la etiqueta **BREAKING**

### Contribuir

Al realizar cambios, actualiza este CHANGELOG siguiendo las pautas:
1. Añade cambios en la sección `[Unreleased]`
2. Sé específico: indica qué se añadió, cambió o corrigió
3. Incluye referencias a issues/PRs cuando sea relevante: `Fixed #123`
4. Marca claramente los breaking changes con **BREAKING**
5. Antes de cada release, mueve los cambios de `[Unreleased]` a una nueva versión con fecha
