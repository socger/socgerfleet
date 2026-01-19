#!/bin/bash

# Script para verificar las cabeceras de seguridad de Helmet
# Uso: ./test-helmet-headers.sh

echo "🔍 Verificando cabeceras de seguridad de Helmet..."
echo "=================================================="
echo ""

# Colores para el output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar si el servidor está corriendo
if ! curl -s http://localhost:3000/v1/ > /dev/null 2>&1; then
    echo -e "${RED}❌ El servidor no está ejecutándose en http://localhost:3000${NC}"
    echo ""
    echo "Por favor, inicia el servidor con: npm run start:dev"
    exit 1
fi

echo -e "${GREEN}✅ Servidor corriendo en http://localhost:3000${NC}"
echo ""

# Obtener las cabeceras
echo "📋 Cabeceras de respuesta HTTP:"
echo "================================"
curl -I http://localhost:3000/v1/ 2>/dev/null | grep -E "^(Content-Security-Policy|X-|Strict-Transport-Security|Referrer-Policy):" || echo "No se encontraron cabeceras de seguridad adicionales"

echo ""
echo "🛡️  Cabeceras de seguridad configuradas por Helmet:"
echo "===================================================="

# Verificar cada cabecera importante
check_header() {
    local header_name=$1
    local expected=$2
    local result=$(curl -I http://localhost:3000/v1/ 2>/dev/null | grep -i "^${header_name}:")
    
    if [ -n "$result" ]; then
        echo -e "${GREEN}✅ ${header_name}${NC}"
        echo "   $result"
    else
        echo -e "${YELLOW}⚠️  ${header_name} no encontrada${NC}"
    fi
}

check_header "Content-Security-Policy" 
check_header "X-Content-Type-Options"
check_header "X-Frame-Options"
check_header "Strict-Transport-Security"
check_header "X-DNS-Prefetch-Control"
check_header "Referrer-Policy"

echo ""
echo "✅ Verificación completada"
echo ""
echo "📚 Para más información, visita: https://helmetjs.github.io/"
