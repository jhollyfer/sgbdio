# sgbdio

Monorepo com **backend Fastify + PostgreSQL + Drizzle** (template genérico
com auth/RBAC, storage e fila de e-mail) e **frontend React 19 + TanStack
Start** (SSR via Nitro, scaffold ainda sem domínio próprio).

> Documentação detalhada do backend: [`backend/CLAUDE.md`](backend/CLAUDE.md).
> Visão geral do monorepo: [`CLAUDE.md`](CLAUDE.md).

---

## Sumário

- [Stack](#stack)
- [Estrutura do monorepo](#estrutura-do-monorepo)
- [Pré-requisitos](#pré-requisitos)
- [Instalação rápida (Docker)](#instalação-rápida-docker)
- [Desenvolvimento local](#desenvolvimento-local)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Scripts da raiz](#scripts-da-raiz)
- [RBAC](#rbac)
- [Testes](#testes)
- [Deploy / CI](#deploy--ci)

---

## Stack

### Backend

| Tecnologia              | Versão  | Uso                              |
| ----------------------- | ------- | -------------------------------- |
| Fastify                 | 5.x     | HTTP framework                   |
| TypeScript              | 5.9     | Linguagem                        |
| PostgreSQL + Drizzle    | 16 / 0.45 | Banco + ORM (drizzle-kit)      |
| pg (node-postgres)      | 8.x     | Driver                           |
| ioredis + BullMQ        | 5 / 5.x | Fila de e-mail                   |
| Zod + AJV               | 4 / 8   | Validação                        |
| @fastify/jwt            | 10      | JWT RS256 + cookies httpOnly     |
| Flydrive (AWS S3)       | -       | Storage local / S3               |
| Sharp                   | 0.34    | Processamento de imagens         |
| Nodemailer              | 8       | SMTP                             |
| fastify-decorators      | 3.16    | DI + controllers                 |
| Vitest                  | 4       | Testes (unit + e2e)              |

### Frontend

| Tecnologia                | Versão | Uso                            |
| ------------------------- | ------ | ------------------------------ |
| React                     | 19.2   | UI                             |
| @tanstack/react-start     | latest | SSR (Nitro)                    |
| @tanstack/react-router    | latest | File-based routing             |
| @tanstack/react-query     | latest | Server state (com SSR)         |
| @tanstack/react-form      | latest | Formulários                    |
| @tanstack/react-table     | latest | Tabelas                        |
| @tanstack/react-store     | latest | Client state                   |
| Tailwind CSS              | 4      | Estilização                    |
| Radix UI + shadcn         | 1.4    | Componentes (`new-york`/`zinc`)|
| @inlang/paraglide-js      | 2.13   | i18n (`en`/`de`)               |
| Vite                      | 8      | Build                          |
| Vitest                    | 4      | Testes                         |

---

## Estrutura do monorepo

```
sgbdio/
├── backend/                       # API Fastify + Postgres + Drizzle
├── frontend/                      # React + TanStack Start (Nitro)
├── _docs/                         # Documentação vendored
├── .github/workflows/             # CI: test + build + push :latest
├── docker-compose.yml             # Dev (build local)
├── docker-compose.oficial.yml     # Self-host (imagens :latest do Docker Hub)
├── setup.sh                       # Bootstrap (.env + JWT)
├── credential-generator.sh        # Gera JWT RS256 + cookie secret
├── install.md                     # Guia de instalação
└── package.json                   # Scripts agregadores
```

---

## Pré-requisitos

- Docker + Docker Compose (recomendado).
- Node.js 24+ e npm para desenvolvimento local.
- No Windows, usar Git Bash para rodar `setup.sh`.

---

## Instalação rápida (Docker)

```bash
# 1. Bootstrap: cria .env / .env.test, gera JWT RS256 + COOKIE_SECRET,
#    separa backend/.env e frontend/.env.
chmod +x ./setup.sh
./setup.sh

# 2. Sobe Postgres + Redis + API + App (build local)
docker compose up -d

# 3. Seed (idempotente — o docker-entrypoint do api já roda automaticamente)
docker exec -it sgbdio-api npm run seed
```

Acessos default:

| Serviço      | URL                                  |
| ------------ | ------------------------------------ |
| Frontend     | http://localhost:5173                |
| Backend      | http://localhost:3000                |
| Docs (API)   | http://localhost:3000/documentation  |
| OpenAPI JSON | http://localhost:3000/openapi.json   |

Guia completo + troubleshooting: [`install.md`](install.md).

---

## Desenvolvimento local

```bash
# Sobe Postgres + Redis em container
docker compose up -d postgres redis

# Backend (em um terminal)
cd backend
npm install
npm run seed    # roda migrations + seed bootstrap admin
npm run dev

# Frontend (em outro terminal)
cd frontend
npm install
npm run dev
```

---

## Variáveis de ambiente

Apenas as essenciais — schema completo em
[`backend/start/env.ts`](backend/start/env.ts) e exemplos em
[`.env.example`](.env.example).

| Variável                     | Quem usa | Descrição                                  |
| ---------------------------- | -------- | ------------------------------------------ |
| `DATABASE_URL`               | backend  | `postgres://user:pass@host:5432/db`        |
| `JWT_PUBLIC_KEY`             | backend  | RSA RS256 pública (base64)                 |
| `JWT_PRIVATE_KEY`            | backend  | RSA RS256 privada (base64)                 |
| `COOKIE_SECRET`              | backend  | Secret de cookies assinados                |
| `COOKIE_DOMAIN`              | backend  | Domínio dos cookies                        |
| `APPLICATION_SERVER_URL`     | backend  | URL pública da API                         |
| `APPLICATION_CLIENT_URL`     | backend  | URL pública do app (CORS auto)             |
| `ALLOWED_ORIGINS`            | backend  | Origens CORS extras (`;` separado)         |
| `REDIS_URL`                  | backend  | URL do Redis (BullMQ)                      |
| `STORAGE_DRIVER`             | backend  | `local` ou `s3`                            |
| `EMAIL_PROVIDER_*`           | backend  | SMTP (host/port/user/password/from)        |
| `BOOTSTRAP_MASTER_*`         | backend  | Email/senha/nome do admin inicial          |
| `SERVER_URL`                 | frontend | URL da API consumida em SSR (server-only)  |
| `VITE_APP_TITLE`             | frontend | Título exibido no app                      |

Chaves JWT são geradas pelo `setup.sh` (ou `./credential-generator.sh`).
**Nunca** use as chaves padrão em produção.

---

## Scripts da raiz

`package.json` na raiz agrega os scripts dos workspaces via `npm-run-all2`:

| Script                       | Ação                                |
| ---------------------------- | ----------------------------------- |
| `npm run lint:backend`       | ESLint backend (auto-fix)           |
| `npm run lint:frontend`      | ESLint frontend                     |
| `npm run build:backend`      | `cd backend && npm run build`       |
| `npm run build:frontend`     | `cd frontend && npm run build`      |
| `npm run build`              | Build de backend + frontend (paralelo) |
| `npm run test:unit:backend`  | Vitest unit (in-memory repos)       |
| `npm run test:e2e:backend`   | Vitest e2e (Postgres real)          |

---

## RBAC

| Role          | Permissões                                              |
| ------------- | ------------------------------------------------------- |
| MASTER        | Tudo. Único role com hard-delete de users.              |
| ADMINISTRATOR | CRUD de users (sem hard-delete). Default no sign-up público. |

`RoleMiddleware([Role.MASTER, Role.ADMINISTRATOR])` em controllers que precisam restrição.

---

## Testes

### Backend

| Tipo | Pattern                  | Banco                     |
| ---- | ------------------------ | ------------------------- |
| Unit | `*.use-case.spec.ts`     | Repositórios in-memory    |
| E2E  | `*.controller.spec.ts`   | Postgres real (truncate por test) |

```bash
cd backend && npm run test:unit
cd backend && npm run test:e2e
```

Helper: `backend/test/helpers/auth.helper.ts` (`createAuthenticatedUser`).

### Frontend

```bash
cd frontend && npm test
```

---

## Deploy / CI

- **GitHub Actions** (`.github/workflows/`): push em `main`/`develop` roda
  testes do backend (Postgres + Redis em service containers), builda backend
  e frontend e publica `marcosjhollyfer/sgbdio-api:latest` e
  `marcosjhollyfer/sgbdio-app:latest` no Docker Hub (`linux/amd64,linux/arm64`).
- **Self-host**: `docker-compose.oficial.yml` puxa as imagens `:latest`.

Composes:

- `docker-compose.yml` — desenvolvimento (build local).
- `docker-compose.oficial.yml` — self-host mínimo via Docker Hub.
