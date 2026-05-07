# Guia de Instalação — sgbdio

## Pré-requisitos

- **Docker** + **Docker Compose** (recomendado).
- **Node.js 24+** + **npm** (para dev local).
- **Git Bash** no Windows.

---

## 1. Bootstrap

Na raiz do projeto, em qualquer SO:

```bash
chmod +x ./setup.sh
./setup.sh
```

O `setup.sh`:

- Copia `.env.example` → `.env` e `.env.test.example` → `.env.test`.
- Gera `JWT_PRIVATE_KEY`, `JWT_PUBLIC_KEY` (RSA RS256, base64) e `COOKIE_SECRET`
  via `credential-generator.sh`.
- Separa as variáveis em `backend/.env` (sem `VITE_*` e sem `SERVER_URL`) e
  `frontend/.env` (apenas `VITE_*` + `SERVER_URL`).

> No Windows, rode dentro do Git Bash.

---

## 2. Subir o stack via Docker

```bash
docker compose up -d
```

Sobe quatro serviços: `sgbdio-postgres`, `sgbdio-redis`, `sgbdio-api`,
`sgbdio-app`.

O `docker-entrypoint.sh` da API roda **migrations + seeders** automaticamente
no boot (idempotente). Para rodar seed manualmente:

```bash
docker exec -it sgbdio-api npm run seed
```

### Acessos

| Serviço      | URL                                  |
| ------------ | ------------------------------------ |
| Frontend     | http://localhost:5173                |
| Backend      | http://localhost:3000                |
| Docs (API)   | http://localhost:3000/documentation  |
| OpenAPI JSON | http://localhost:3000/openapi.json   |

---

## 3. Self-host com imagens publicadas

Para puxar as imagens prontas do Docker Hub
(`marcosjhollyfer/sgbdio-api:latest` e `marcosjhollyfer/sgbdio-app:latest`):

```bash
# Ajuste APPLICATION_SERVER_URL e APPLICATION_CLIENT_URL no .env para o host público.
docker compose -f docker-compose.oficial.yml up -d
docker exec -it sgbdio-api npm run seed
```

> O `docker-compose.oficial.yml` usa as mesmas variáveis do `.env`, mas
> consome imagens já buildadas pelo CI. Não há build local.

---

## 4. Desenvolvimento local

Subindo só os serviços de infra em container e rodando backend / frontend
direto na máquina:

```bash
# Postgres + Redis
docker compose up -d postgres redis

# Backend (terminal 1)
cd backend
npm install
npm run seed
npm run dev

# Frontend (terminal 2)
cd frontend
npm install
npm run dev
```

---

## Variáveis de ambiente

Os defaults em `.env.example` apontam para `127.0.0.1` (host nativo) porque o
cenário típico de dev é Postgres + Redis em container e backend/frontend
rodando na máquina. Quando o stack inteiro sobe via `docker compose up -d`, o
próprio compose sobrescreve `DATABASE_URL` e `REDIS_URL` para usar os hosts
internos da rede Docker (`postgres`, `redis`).

Schema validado por Zod em [`backend/start/env.ts`](backend/start/env.ts).

### Principais

| Variável                 | Default dev                                             |
| ------------------------ | ------------------------------------------------------- |
| `NODE_ENV`               | `development`                                           |
| `PORT`                   | `3000`                                                  |
| `DATABASE_URL`           | `postgres://postgres:postgres@127.0.0.1:5432/sgbdio`    |
| `APPLICATION_SERVER_URL` | `http://localhost:3000`                                 |
| `APPLICATION_CLIENT_URL` | `http://localhost:5173`                                 |
| `REDIS_URL`              | `redis://localhost:6379`                                |
| `STORAGE_DRIVER`         | `local`                                                 |
| `COOKIE_DOMAIN`          | `localhost`                                             |
| `BOOTSTRAP_MASTER_EMAIL` | `master@example.com`                                    |
| `BOOTSTRAP_MASTER_PASSWORD` | `Master@123`                                         |

### Storage S3 (opcional)

Defina `STORAGE_DRIVER=s3` e preencha:

```env
STORAGE_ENDPOINT=https://s3.amazonaws.com
STORAGE_REGION=us-east-1
STORAGE_BUCKET=sgbdio
STORAGE_ACCESS_KEY=...
STORAGE_SECRET_KEY=...
```

### SMTP (opcional)

Para a fila de e-mail (BullMQ + Nodemailer):

```env
EMAIL_PROVIDER_HOST=smtp.example.com
EMAIL_PROVIDER_PORT=587
EMAIL_PROVIDER_USER=...
EMAIL_PROVIDER_PASSWORD=...
EMAIL_PROVIDER_FROM=no-reply@example.com
EMAIL_WORKER_CONCURRENCY=5
```

### Segurança (JWT + cookies)

As chaves RS256 e o `COOKIE_SECRET` são gerados pelo `setup.sh`. Para
regerar manualmente:

```bash
./credential-generator.sh
```

> **Nunca** use as chaves de exemplo em produção. Cada deploy deve ter as suas.

---

## Limpeza completa (reset)

```bash
docker compose down --volumes --remove-orphans
docker volume rm sgbdio_postgres_data sgbdio_redis_data 2>/dev/null || true
```

> Apaga **todos** os dados do Postgres e Redis.

---

## Troubleshooting

### `setup.sh` sem permissão

```bash
chmod +x ./setup.sh ./credential-generator.sh
```

### Container não encontrado

```bash
docker ps
docker compose ps
```

### Erro de conexão com Postgres

- `.env` aponta para `127.0.0.1:5432` (default dev nativo). Em compose, o
  próprio compose sobrescreve para `postgres:5432`.
- Confira saúde do container: `docker compose ps`.
- Confira `DATABASE_URL` no `.env`.

### Migrations não rodaram

```bash
docker exec -it sgbdio-api npm run db:migrate
docker exec -it sgbdio-api npm run seed
```

Para inspecionar o banco:

```bash
docker exec -it sgbdio-api npm run db:studio
```
