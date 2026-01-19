#!/bin/bash

# Script para probar Rate Limiting en todos los endpoints críticos
# Fecha: 19 de enero de 2026

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# URL base
BASE_URL="http://localhost:3000/v1"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  TESTS DE RATE LIMITING - SOCGERFLEET${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Verificar que el servidor está corriendo
echo -e "${YELLOW}🔍 Verificando que el servidor está corriendo...${NC}"
if curl -s "$BASE_URL" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Servidor respondiendo correctamente${NC}\n"
else
    echo -e "${RED}❌ ERROR: Servidor no está corriendo en $BASE_URL${NC}"
    echo -e "${YELLOW}Por favor, inicia el servidor con: npm run start:dev${NC}"
    exit 1
fi

# Función para verificar HTTP 429
check_rate_limit() {
    local response=$1
    local attempt=$2
    local limit=$3
    
    if echo "$response" | grep -q "429"; then
        echo -e "${GREEN}  ✅ Intento $attempt: BLOQUEADO (HTTP 429) - Rate limiting funcionando${NC}"
        return 0
    elif [ $attempt -le $limit ]; then
        echo -e "${BLUE}  ℹ️  Intento $attempt: PERMITIDO${NC}"
        return 1
    else
        echo -e "${RED}  ❌ Intento $attempt: DEBERÍA ESTAR BLOQUEADO pero no lo está${NC}"
        return 2
    fi
}

# TEST 1: /auth/login (5 intentos por minuto)
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}📝 TEST 1: /auth/login (límite: 5/minuto)${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
test1_failed=false
for i in {1..7}; do
    response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/login" \
        -H "Content-Type: application/json" \
        -d '{"email":"test@test.com","password":"wrongpassword"}')
    
    check_rate_limit "$response" $i 5
    status=$?
    
    if [ $status -eq 2 ]; then
        test1_failed=true
    fi
    
    sleep 0.5
done

if [ "$test1_failed" = false ]; then
    echo -e "${GREEN}✅ TEST 1 PASADO: Login rate limiting funciona correctamente${NC}\n"
else
    echo -e "${RED}❌ TEST 1 FALLIDO: Login rate limiting no funciona correctamente${NC}\n"
fi

# TEST 2: /auth/register (3 intentos por minuto)
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}📝 TEST 2: /auth/register (límite: 3/minuto)${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
test2_failed=false
for i in {1..5}; do
    response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/register" \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"test$i@test.com\",\"password\":\"Test123456\",\"username\":\"test$i\",\"firstName\":\"Test\",\"lastName\":\"User\"}")
    
    check_rate_limit "$response" $i 3
    status=$?
    
    if [ $status -eq 2 ]; then
        test2_failed=true
    fi
    
    sleep 0.5
done

if [ "$test2_failed" = false ]; then
    echo -e "${GREEN}✅ TEST 2 PASADO: Register rate limiting funciona correctamente${NC}\n"
else
    echo -e "${RED}❌ TEST 2 FALLIDO: Register rate limiting no funciona correctamente${NC}\n"
fi

# TEST 3: /auth/refresh (10 intentos por minuto)
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}📝 TEST 3: /auth/refresh (límite: 10/minuto)${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
test3_failed=false
for i in {1..12}; do
    response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/refresh" \
        -H "Content-Type: application/json" \
        -d '{"refreshToken":"fake-token-12345"}')
    
    check_rate_limit "$response" $i 10
    status=$?
    
    if [ $status -eq 2 ]; then
        test3_failed=true
    fi
    
    sleep 0.3
done

if [ "$test3_failed" = false ]; then
    echo -e "${GREEN}✅ TEST 3 PASADO: Refresh token rate limiting funciona correctamente${NC}\n"
else
    echo -e "${RED}❌ TEST 3 FALLIDO: Refresh token rate limiting no funciona correctamente${NC}\n"
fi

# TEST 4: /auth/request-password-reset (3 intentos por 15 minutos)
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}📝 TEST 4: /auth/request-password-reset (límite: 3/15min)${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
test4_failed=false
for i in {1..5}; do
    response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/request-password-reset" \
        -H "Content-Type: application/json" \
        -d '{"email":"test@test.com"}')
    
    check_rate_limit "$response" $i 3
    status=$?
    
    if [ $status -eq 2 ]; then
        test4_failed=true
    fi
    
    sleep 0.5
done

if [ "$test4_failed" = false ]; then
    echo -e "${GREEN}✅ TEST 4 PASADO: Request password reset rate limiting funciona correctamente${NC}\n"
else
    echo -e "${RED}❌ TEST 4 FALLIDO: Request password reset rate limiting no funciona correctamente${NC}\n"
fi

# TEST 5: /auth/reset-password (3 intentos por 15 minutos)
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}📝 TEST 5: /auth/reset-password (límite: 3/15min)${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
test5_failed=false
for i in {1..5}; do
    response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/reset-password" \
        -H "Content-Type: application/json" \
        -d '{"token":"fake-token-abc123","newPassword":"NewPass123456"}')
    
    check_rate_limit "$response" $i 3
    status=$?
    
    if [ $status -eq 2 ]; then
        test5_failed=true
    fi
    
    sleep 0.5
done

if [ "$test5_failed" = false ]; then
    echo -e "${GREEN}✅ TEST 5 PASADO: Reset password rate limiting funciona correctamente${NC}\n"
else
    echo -e "${RED}❌ TEST 5 FALLIDO: Reset password rate limiting no funciona correctamente${NC}\n"
fi

# RESUMEN FINAL
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}         RESUMEN DE TESTS${NC}"
echo -e "${BLUE}========================================${NC}"

total_tests=5
failed_tests=0

[ "$test1_failed" = false ] && echo -e "${GREEN}✅ TEST 1: Login${NC}" || { echo -e "${RED}❌ TEST 1: Login${NC}"; ((failed_tests++)); }
[ "$test2_failed" = false ] && echo -e "${GREEN}✅ TEST 2: Register${NC}" || { echo -e "${RED}❌ TEST 2: Register${NC}"; ((failed_tests++)); }
[ "$test3_failed" = false ] && echo -e "${GREEN}✅ TEST 3: Refresh Token${NC}" || { echo -e "${RED}❌ TEST 3: Refresh Token${NC}"; ((failed_tests++)); }
[ "$test4_failed" = false ] && echo -e "${GREEN}✅ TEST 4: Request Password Reset${NC}" || { echo -e "${RED}❌ TEST 4: Request Password Reset${NC}"; ((failed_tests++)); }
[ "$test5_failed" = false ] && echo -e "${GREEN}✅ TEST 5: Reset Password${NC}" || { echo -e "${RED}❌ TEST 5: Reset Password${NC}"; ((failed_tests++)); }

echo -e "${BLUE}========================================${NC}"
passed_tests=$((total_tests - failed_tests))
echo -e "Tests pasados: ${GREEN}$passed_tests${NC}/$total_tests"
echo -e "Tests fallidos: ${RED}$failed_tests${NC}/$total_tests"

if [ $failed_tests -eq 0 ]; then
    echo -e "\n${GREEN}🎉 ¡TODOS LOS TESTS PASARON! Rate limiting funciona correctamente.${NC}\n"
    exit 0
else
    echo -e "\n${RED}⚠️  ALGUNOS TESTS FALLARON. Revisa la configuración de rate limiting.${NC}\n"
    exit 1
fi
