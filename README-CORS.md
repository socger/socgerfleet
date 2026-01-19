# 🛡️ Configuración de CORS en SocgerFleet

## ✅ Implementación Completa

Se ha implementado exitosamente CORS (Cross-Origin Resource Sharing) en tu proyecto NestJS. A continuación, encontrarás toda la información necesaria para configurar y utilizar esta funcionalidad.

---

## 📦 ¿Qué se ha Implementado?

### Archivos Modificados:

1. **[src/main.ts](src/main.ts)** - Configuración de CORS con validación de orígenes
2. **[.env](.env)** - Variables de configuración de CORS
3. **[.env.example](.env.example)** - Plantilla con ejemplos de configuración

### Archivos Creados:

1. **[test-cors.sh](test-cors.sh)** - Script automatizado de pruebas CORS
2. **[resources/documents/AI conversations/Implementación de CORS.md](resources/documents/AI conversations/Implementación de CORS.md)** - Documentación completa

---

## 🚀 Cómo Usar

###  1. Configurar Orígenes Permitidos

Edita el archivo `.env` y define los orígenes que pueden acceder a tu API:

```bash
# Para desarrollo local (múltiples puertos)
CORS_ORIGIN=http://localhost:3000,http://localhost:4200,http://localhost:5173

# Para producción (dominios específicos)
CORS_ORIGIN=https://app.tudominio.com,https://admin.tudominio.com
```

**⚠️ IMPORTANTE:**
- **NUNCA** uses `CORS_ORIGIN=*` en producción
- Siempre especifica los dominios completos con `http://` o `https://`
- Separa múltiples orígenes con comas `,` sin espacios

### 2. Iniciar el Servidor

```bash
# Asegúrate de que Docker esté corriendo
docker compose up -d

# Inicia el servidor de desarrollo
npm run start:dev
```

### 3. Probar CORS

#### Opción A: Script Automatizado (Recomendado)

```bash
./test-cors.sh
```

Este script probará:
- ✅ Orígenes permitidos
- ✅ Orígenes bloqueados
- ✅ Peticiones preflight (OPTIONS)
- ✅ Peticiones sin origen (Postman)

#### Opción B: Curl Manual

**Probar desde un origen permitido:**
```bash
curl -v -H "Origin: http://localhost:4200" \
  http://localhost:3000/v1/users \
  2>&1 | grep -i "access-control"
```

Deberías ver algo como:
```
< access-control-allow-origin: http://localhost:4200
< access-control-allow-credentials: true
< access-control-expose-headers: Authorization
```

**Probar preflight (OPTIONS):**
```bash
curl -v -X OPTIONS \
  -H "Origin: http://localhost:4200" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type,Authorization" \
  http://localhost:3000/v1/auth/login
```

#### Opción C: Desde el Navegador

Abre la consola del navegador (F12) en `http://localhost:4200` y ejecuta:

```javascript
fetch('http://localhost:3000/v1/users', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include', // Para cookies/tokens
})
  .then(response => {
    console.log('CORS funciona! ✅');
    return response.json();
  })
  .then(data => console.log('Datos:', data))
  .catch(error => console.error('Error CORS:', error));
```

---

## 🔧 Configuración Avanzada

### Variables de Entorno Disponibles

| Variable | Descripción | Valor por Defecto | Ejemplo |
|----------|-------------|-------------------|---------|
| `CORS_ORIGIN` | Orígenes permitidos (separados por comas) | `http://localhost:3000` | `http://localhost:4200,https://app.com` |
| `CORS_METHODS` | Métodos HTTP permitidos | `GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS` | `GET,POST,PUT` |

### Características de Seguridad Implementadas

| Característica | Estado | Descripción |
|----------------|--------|-------------|
| **Lista Blanca de Orígenes** | ✅ | Solo orígenes específicos pueden acceder |
| **Credentials Support** | ✅ | Permite cookies y tokens de autenticación |
| **Cabeceras Controladas** | ✅ | Solo cabeceras necesarias son permitidas |
| **Preflight Caching** | ✅ | Cacheo de 1 hora para optimizar rendimiento |
| **Métodos HTTP Específicos** | ✅ | Solo métodos definidos son permitidos |

---

## 🧪 Ejemplos de Configuración

### Desarrollo Local (Frontend en múltiples puertos)

```bash
# .env
CORS_ORIGIN=http://localhost:3000,http://localhost:4200,http://localhost:5173,http://localhost:8080
CORS_METHODS=GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS
```

### Staging

```bash
# .env
CORS_ORIGIN=https://staging.tuapp.com,https://admin-staging.tuapp.com
CORS_METHODS=GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS
```

### Producción

```bash
# .env
CORS_ORIGIN=https://tuapp.com,https://www.tuapp.com,https://admin.tuapp.com
CORS_METHODS=GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS
NODE_ENV=production
```

---

##  ⚠️ Problemas Comunes y Soluciones

### 1. Error: "blocked by CORS policy: No 'Access-Control-Allow-Origin' header"

**Causa:** El origen desde el que haces la petición no está en `CORS_ORIGIN`

**Solución:**
```bash
# Agrega tu origen a .env
CORS_ORIGIN=http://localhost:3000,http://tu-nuevo-origen.com

# Reinicia el servidor
npm run start:dev
```

### 2. Error: "credentials mode is 'include'"

**Causa:** Estás enviando credenciales pero el servidor rechaza el origen

**Solución:** Ya implementado. La configuración tiene `credentials: true`

### 3. Peticiones OPTIONS fallan (preflight)

**Causa:** El servidor no responde correctamente a preflight

**Solución:** Ya implementado. CORS maneja automáticamente OPTIONS

### 4. Sin cabeceras CORS en Postman/Insomnia

**Esto es NORMAL:** Estas herramientas no envían cabecera `Origin` por defecto, por lo que CORS no se activa. Esto NO es un error.

---

## 📊 Verificación de que CORS Funciona

### Método 1: Revisar Headers en DevTools

1. Abre tu frontend en el navegador
2. Abre DevTools (F12)
3. Ve a la pestaña "Network"
4. Haz una petición a la API
5. Busca en los headers de respuesta:

```
access-control-allow-origin: http://tu-origen.com
access-control-allow-credentials: true
access-control-allow-methods: GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS
```

### Método 2: Usar el Script de Prueba

```bash
chmod +x ./test-cors.sh
./test-cors.sh
```

Deberías ver:
```
✓ Preflight exitoso (HTTP 204)
✓ Petición GET permitida
✗ Origen NO permitido rechazado (esperado)
✓ Petición sin origen permitida (Postman)
```

---

## 🎯 Casos de Uso

### Frontend React/Vue/Angular en localhost:4200

```bash
# .env
CORS_ORIGIN=http://localhost:4200
```

```javascript
// En tu frontend
const response = await fetch('http://localhost:3000/v1/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include', // Importante para JWT
  body: JSON.stringify({ email, password })
});
```

### Aplicación Móvil (Capacitor/React Native)

```bash
# .env
# Para peticiones desde apps móviles, normalmente no envían Origin
CORS_ORIGIN=*  # Solo en desarrollo
# En producción, usa dominios específicos
```

### Múltiples Subdominios

```bash
# .env
CORS_ORIGIN=https://app.tudominio.com,https://admin.tudominio.com,https://api.tudominio.com
```

---

## 📝 Documentación Adicional

- **Documentación Completa:** [resources/documents/AI conversations/Implementación de CORS.md](resources/documents/AI conversations/Implementación de CORS.md)
- **Changelog:** [CHANGELOG.md](CHANGELOG.md) - Sección [1.1.1] - CORS
- **Swagger API Docs:** http://localhost:3000/api/docs (cuando el servidor esté corriendo)

---

## 🔐 Mejores Prácticas de Seguridad

### ✅ HACER

1. ✅ Usar lista blanca específica de dominios
2. ✅ Usar HTTPS en producción
3. ✅ Incluir subdominios si son necesarios
4. ✅ Limitar métodos HTTP a los realmente necesarios
5. ✅ Activar `credentials: true` para autenticación

### ❌ NO HACER

1. ❌ Usar `CORS_ORIGIN=*` en producción
2. ❌ Permitir todos los métodos HTTP si no son necesarios
3. ❌ Ignorar errores CORS (indican problemas de configuración)
4. ❌ Mezclar HTTP y HTTPS en producción
5. ❌ Exponer cabeceras sensibles innecesariamente

---

## 🆘 Soporte

Si encuentras problemas:

1. Revisa los logs del servidor: `npm run start:dev`
2. Ejecuta el script de prueba: `./test-cors.sh`
3. Verifica que tu origen esté en `.env`
4. Asegúrate de reiniciar el servidor después de cambios en `.env`
5. Consulta la documentación completa en `resources/documents/`

---

## ✅ Checklist Post-Implementación

- [ ] Configurar `CORS_ORIGIN` en `.env` con tus dominios
- [ ] Reiniciar el servidor
- [ ] Ejecutar `./test-cors.sh` para verificar
- [ ] Probar desde tu frontend
- [ ] Verificar headers CORS en DevTools del navegador
- [ ] Actualizar `.env` en producción con dominios reales
- [ ] Documentar orígenes permitidos en tu equipo

---

**¡CORS está implementado y listo para usar! 🎉**

Para cualquier consulta, revisa la documentación completa o los logs del servidor.
