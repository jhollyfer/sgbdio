# sgbdio

Monorepo com backend Fastify + PostgreSQL + Drizzle e frontend TanStack Start
(React 19 SSR via Nitro). Backend é um template genérico com autenticação
JWT + RBAC + storage + fila de e-mail. Frontend é um scaffold do
`create-tanstack-app` ainda sem produto definido.

## Estrutura do Monorepo

```
sgbdio/
├── backend/                       # API Fastify + TypeScript + PostgreSQL + Drizzle
│   └── CLAUDE.md                  # Arquitetura detalhada do backend
├── frontend/                      # React 19 + TanStack Start (Vite + Nitro)
├── _docs/                         # Documentação vendored (TanStack, shadcn, flydrive)
├── .github/workflows/             # CI: testa backend, builda + publica imagens no Docker Hub
├── docker-compose.yml             # Desenvolvimento (build local de api e app)
├── docker-compose.oficial.yml     # Self-host com imagens publicadas (:latest)
├── install.md                     # Guia de instalação
├── setup.sh                       # Bootstrap inicial (.env + JWT)
├── credential-generator.sh        # Gera JWT RS256 + COOKIE_SECRET
└── package.json                   # Scripts agregadores via npm-run-all2
```

## Serviços (Docker Compose)

| Serviço         | Tecnologia        | Porta (host) | Descrição                       |
| --------------- | ----------------- | ------------ | ------------------------------- |
| sgbdio-postgres | PostgreSQL 16     | 5432         | Banco de dados principal        |
| sgbdio-redis    | Redis 7 Alpine    | 6379         | BullMQ (fila de e-mail)         |
| sgbdio-api      | Fastify / Node 24 | 3000         | API REST + OpenAPI / Scalar     |
| sgbdio-app      | Nitro / React 19  | 5173         | Frontend SSR (TanStack Start)   |

```bash
docker compose up -d           # build local (dev)
docker compose -f docker-compose.oficial.yml up -d   # imagens :latest
```

## Stack

### Backend (`backend/`)

Fastify 5, fastify-decorators (DI), Drizzle ORM (PostgreSQL via `pg`), Zod +
AJV, JWT RS256 (`@fastify/jwt` + cookies httpOnly), BullMQ + ioredis,
Nodemailer, Flydrive (local|S3) + Sharp, Vitest (unit + e2e),
`@fastify/swagger` + `@scalar/fastify-api-reference`. Padrão Either/Result
para use cases. RBAC com 2 roles: **MASTER** e **ADMINISTRATOR**. Soft delete
em todas as entidades. Detalhes em [`backend/CLAUDE.md`](backend/CLAUDE.md).

### Frontend (`frontend/`)

React 19, TanStack Start (SSR via Nitro), TanStack Router (file-based),
TanStack Query (+ SSR), TanStack Form, TanStack Table, TanStack Store,
Tailwind CSS 4, shadcn (`new-york`/`zinc`), Radix UI, Paraglide JS (i18n,
locales `en`/`de` por default do scaffold), Vitest. Scaffold puro — ainda
sem domínio próprio.

## Configuração

Toda configuração é via env vars validadas com Zod em `backend/start/env.ts`
(infra: banco, JWT, cookies, CORS, Redis, SMTP, storage, bootstrap admin).
**Não há painel de configuração no banco** — tudo vem do `.env`.

Storage:

- `STORAGE_DRIVER=local` (default) — arquivos em `backend/_storage/`, servidos via
  hook em `/storage/{filename}`.
- `STORAGE_DRIVER=s3` — AWS SDK + presigned URLs.

## Comandos Essenciais

```bash
# Setup inicial (cria .env, gera JWT RS256, separa backend/frontend envs)
./setup.sh

# Subir o stack completo
docker compose up -d

# Seed (idempotente — também roda no docker-entrypoint.sh)
docker exec -it sgbdio-api npm run seed

# Backend local (Postgres + Redis em container)
docker compose up -d postgres redis
cd backend && npm install && npm run dev

# Frontend local
cd frontend && npm install && npm run dev

# Testes backend
cd backend && npm run test:unit   # in-memory repos
cd backend && npm run test:e2e    # Postgres real (truncate por test)
```

## CI/CD

GitHub Actions na branch `main`/`develop`:

1. `main-test-backend.yml` — Vitest unit + e2e (sobe Postgres 16 + Redis 7
   como service containers).
2. `main-build-backend.yml` / `main-build-frontend.yml` — `npm run build` e
   upload do artifact.
3. `main-docker-backend.yml` / `main-docker-frontend.yml` — build + push das
   imagens `marcosjhollyfer/sgbdio-api:latest` e
   `marcosjhollyfer/sgbdio-app:latest` no Docker Hub (multi-arch
   `linux/amd64,linux/arm64`).

Secrets esperados: `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`.

Self-host puxa essas imagens via `docker-compose.oficial.yml`.
