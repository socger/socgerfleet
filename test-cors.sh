#!/bin/bash

# Script para probar la configuración de CORS
# Este script realiza peticiones desde diferentes orígenes para verificar CORS

echo "======================================"
echo "Prueba de Configuración CORS"
echo "======================================"
echo ""

API_URL="http://localhost:3000"

# Colores para la salida
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para probar una petición OPTIONS (preflight)
test_preflight() {
    local origin=$1
    echo -e "${BLUE}Probando preflight desde origen: ${origin}${NC}"
    
    response=$(curl -s -o /dev/null -w "%{http_code}" \
        -X OPTIONS \
        -H "Origin: ${origin}" \
        -H "Access-Control-Request-Method: POST" \
        -H "Access-Control-Request-Headers: Content-Type,Authorization" \
        "${API_URL}/v1/auth/login")
    
    if [ "$response" -eq 204 ] || [ "$response" -eq 200 ]; then
        echo -e "${GREEN}✓ Preflight exitoso (HTTP ${response})${NC}"
        
        # Mostrar las cabeceras CORS
        echo "Cabeceras CORS:"
        curl -s -X OPTIONS \
            -H "Origin: ${origin}" \
            -H "Access-Control-Request-Method: POST" \
            -H "Access-Control-Request-Headers: Content-Type,Authorization" \
            "${API_URL}/v1/auth/login" \
            -i 2>&1 | grep -i "access-control"
    else
        echo -e "${RED}✗ Preflight falló (HTTP ${response})${NC}"
    fi
    echo ""
}

# Función para probar una petición GET normal
test_cors_get() {
    local origin=$1
    echo -e "${BLUE}Probando petición GET desde origen: ${origin}${NC}"
    
    response=$(curl -s -X GET \
        -H "Origin: ${origin}" \
        "${API_URL}/v1/users" \
        -i 2>&1 | head -20)
    
    if echo "$response" | grep -q "Access-Control-Allow-Origin"; then
        echo -e "${GREEN}✓ Petición GET permitida${NC}"
        echo "Cabeceras CORS:"
        echo "$response" | grep -i "access-control"
    else
        echo -e "${RED}✗ Petición GET rechazada o sin cabeceras CORS${NC}"
    fi
    echo ""
}

echo "1. Probando origen permitido (localhost:3000):"
echo "--------------------------------------"
test_preflight "http://localhost:3000"
test_cors_get "http://localhost:3000"

echo ""
echo "2. Probando origen permitido (localhost:4200):"
echo "--------------------------------------"
test_preflight "http://localhost:4200"
test_cors_get "http://localhost:4200"

echo ""
echo "3. Probando origen NO permitido (ejemplo.com):"
echo "--------------------------------------"
test_preflight "http://ejemplo.com"
test_cors_get "http://ejemplo.com"

echo ""
echo "4. Probando sin origen (Postman/curl):"
echo "--------------------------------------"
echo -e "${BLUE}Petición sin cabecera Origin (simulando Postman)${NC}"
response=$(curl -s -o /dev/null -w "%{http_code}" "${API_URL}/v1/users")
if [ "$response" -eq 200 ] || [ "$response" -eq 401 ]; then
    echo -e "${GREEN}✓ Petición permitida (HTTP ${response})${NC}"
else
    echo -e "${RED}✗ Petición rechazada (HTTP ${response})${NC}"
fi

echo ""
echo "======================================"
echo "Resumen:"
echo "======================================"
echo "Los orígenes permitidos en .env son:"
if [ -f .env ]; then
    CORS_ORIGIN_VALUE=$(grep '^CORS_ORIGIN=' .env | cut -d '=' -f 2)
    echo "CORS_ORIGIN=${CORS_ORIGIN_VALUE:-'No definido en .env'}"
else
    echo "Archivo .env no encontrado"
fi
echo ""
echo "Para modificar los orígenes permitidos, edita la variable"
echo "CORS_ORIGIN en el archivo .env"
echo "======================================"
