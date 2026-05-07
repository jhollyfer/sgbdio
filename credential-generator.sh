#!/bin/bash

# Função para gerar e inserir credenciais em um arquivo .env
generate_credentials_for_file() {
    local ENV_FILE="$1"
    
    # Verifica se o arquivo existe
    if [ ! -f "$ENV_FILE" ]; then
        echo "Arquivo $ENV_FILE não encontrado, pulando..."
        return 1
    fi
    
    echo "Gerando credenciais para $ENV_FILE..."
    
    # Gera as chaves temporárias
    openssl genrsa -out temp_private.pem 2048 2>/dev/null
    openssl rsa -in temp_private.pem -pubout -out temp_public.pem 2>/dev/null
    
    # Base64 encoding com suporte para macOS e Linux/Git Bash
    if [[ "$OSTYPE" == "darwin"* ]]; then
        JWT_PRIVATE_KEY=$(base64 < temp_private.pem | tr -d '\n')
        JWT_PUBLIC_KEY=$(base64 < temp_public.pem | tr -d '\n')
    else
        # Linux e Git Bash no Windows
        JWT_PRIVATE_KEY=$(base64 -w 0 temp_private.pem 2>/dev/null || base64 temp_private.pem | tr -d '\n')
        JWT_PUBLIC_KEY=$(base64 -w 0 temp_public.pem 2>/dev/null || base64 temp_public.pem | tr -d '\n')
    fi
    
    COOKIE_SECRET=$(openssl rand -hex 32)
    
    # Remove as chaves antigas se existirem (compatível com macOS e Linux/Git Bash)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' '/^JWT_PRIVATE_KEY=/d' "$ENV_FILE"
        sed -i '' '/^JWT_PUBLIC_KEY=/d' "$ENV_FILE"
        sed -i '' '/^COOKIE_SECRET=/d' "$ENV_FILE"
    else
        sed -i '/^JWT_PRIVATE_KEY=/d' "$ENV_FILE"
        sed -i '/^JWT_PUBLIC_KEY=/d' "$ENV_FILE"
        sed -i '/^COOKIE_SECRET=/d' "$ENV_FILE"
    fi
    
    # Adiciona as novas chaves
    echo "JWT_PRIVATE_KEY=$JWT_PRIVATE_KEY" >> "$ENV_FILE"
    echo "JWT_PUBLIC_KEY=$JWT_PUBLIC_KEY" >> "$ENV_FILE"
    echo "COOKIE_SECRET=$COOKIE_SECRET" >> "$ENV_FILE"
    
    # Remove os arquivos temporários
    rm -f temp_private.pem temp_public.pem
    
    echo "Chaves geradas e adicionadas ao arquivo $ENV_FILE com sucesso!"
}

# Gera credenciais para .env
generate_credentials_for_file ".env"

# Gera credenciais para .env.test (se existir)
generate_credentials_for_file ".env.test"