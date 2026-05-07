#!/usr/bin/env bash

# Script de configuração inicial do projeto sgbdio
# Compatível com: Linux, macOS e Windows (Git Bash)

set -euo pipefail

echo "Configurando projeto sgbdio..."
echo ""

# Verificar se estamos na raiz do projeto
if [ ! -f "docker-compose.yml" ] && [ ! -f "docker-compose.oficial.yml" ]; then
    echo "Execute este script na raiz do projeto (onde está o docker-compose.yml)"
    exit 1
fi

echo "1. Verificando .env.example na raiz..."

if [ ! -f "./.env.example" ]; then
  echo "Arquivo ./.env.example não encontrado"
  exit 1
fi

if [ ! -f "./credential-generator.sh" ]; then
  echo "Arquivo ./credential-generator.sh não encontrado"
  exit 1
fi

# --------------------------------------------------
# Criar .env e .env.test
# --------------------------------------------------
echo ""
echo "2. Criando .env e gerando credenciais..."

cp ./.env.example ./.env
echo "Arquivo ./.env criado na raiz"

if [ -f "./.env.test.example" ]; then
    cp ./.env.test.example ./.env.test
    echo "Arquivo ./.env.test criado na raiz"
fi

chmod +x ./credential-generator.sh
echo "Gerando credenciais JWT RS256 + COOKIE_SECRET..."
./credential-generator.sh

# --------------------------------------------------
# Interpolação de variáveis (${VAR} no .env)
# --------------------------------------------------
echo ""
echo "3. Interpolando variáveis de ambiente..."

if ! command -v envsubst >/dev/null 2>&1; then
    echo "envsubst não encontrado. Instale o pacote 'gettext' e rode novamente."
    exit 1
fi

interpolate_env_file() {
    local file="$1"
    [ -f "$file" ] || return 0

    # Carrega valores no ambiente do subshell para o envsubst expandir
    (
        set -a
        # shellcheck disable=SC1090
        source "$file"
        set +a
        envsubst < "$file" > "${file}.tmp"
    )
    mv "${file}.tmp" "$file"
    echo "Interpolado: $file"
}

interpolate_env_file ./.env
interpolate_env_file ./.env.test

# --------------------------------------------------
# Separação backend / frontend
# --------------------------------------------------
echo ""
echo "4. Separando variáveis de ambiente..."

mkdir -p ./backend ./frontend

# backend/.env: tudo exceto VITE_* e SERVER_URL (server-only do frontend SSR)
grep -vE "^(VITE_[A-Z0-9_]*|SERVER_URL)=" ./.env > ./backend/.env 2>/dev/null || true
echo "Arquivo ./backend/.env criado (sem VITE_* e sem SERVER_URL)"

# frontend/.env: apenas VITE_* + SERVER_URL
grep -E "^(VITE_[A-Z0-9_]*|SERVER_URL)=" ./.env > ./frontend/.env 2>/dev/null || true
echo "Arquivo ./frontend/.env criado (VITE_* + SERVER_URL)"

if [ -f "./.env.test" ]; then
    cp ./.env.test ./backend/.env.test
    echo "Arquivo ./backend/.env.test criado"
fi

echo ""
echo "Configuração concluída com sucesso!"
echo ""
echo "Próximos passos (Docker):"
echo "   1. Execute: docker compose up -d --build"
echo "   2. Seed (idempotente, já roda no entrypoint): docker exec -it sgbdio-api npm run seed"
echo ""
echo "Próximos passos (self-host com imagens publicadas):"
echo "   1. Ajuste APPLICATION_SERVER_URL e APPLICATION_CLIENT_URL no .env"
echo "   2. Execute: docker compose -f docker-compose.oficial.yml up -d"
echo "   3. Execute: docker exec -it sgbdio-api npm run seed"
echo ""
echo "Acessos (local):"
echo "   Frontend:     http://localhost:5173"
echo "   Backend:      http://localhost:3000"
echo "   Docs (API):   http://localhost:3000/documentation"
echo "   OpenAPI JSON: http://localhost:3000/openapi.json"
echo ""
