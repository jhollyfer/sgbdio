# Backend Template

Backend genérico em Fastify + TypeScript + PostgreSQL + Drizzle. Recursos
inclusos: autenticação JWT (cookie), CRUD de usuários, perfil, upload/serve
de arquivos, fila de e-mail (BullMQ).

## Tech Stack

| Tecnologia | Uso |
|------------|-----|
| Fastify 5 | HTTP framework |
| TypeScript 5.9 | Linguagem |
| PostgreSQL + Drizzle ORM | Banco + ODM (drizzle-kit para migrations) |
| pg (node-postgres) | Driver |
| Redis + BullMQ | Fila de email |
| Zod | Validação |
| AJV + ajv-errors | Validação Fastify schema |
| JWT RS256 | Autenticação |
| Flydrive + AWS S3 | Storage (local/S3) |
| Sharp | Processamento de imagem |
| Nodemailer | Email (SMTP) |
| Vitest | Testes |
| fastify-decorators | DI + Controller decorators |

## Estrutura

```
backend/
├── bin/server.ts                  # Entry point — connectDatabase + migrate + listen + email worker
├── start/
│   ├── kernel.ts                  # Fastify kernel — plugins, CORS, JWT, Swagger, error handler, storage hook
│   └── env.ts                     # Validação de env vars com Zod
├── config/
│   ├── database.config.ts         # Pool pg + drizzle + runMigrations
│   ├── storage.config.ts          # Flydrive (local/S3) baseado em STORAGE_DRIVER
│   ├── redis.config.ts            # ioredis
│   └── email.config.ts            # buildNodemailerConfig (lê env vars)
├── application/
│   ├── core/                      # Either, exception, role.core, controllers loader, di-registry
│   ├── middlewares/               # authentication, role
│   ├── repositories/              # User, Storage, ValidationToken (contract + drizzle + in-memory)
│   ├── services/                  # email, email-queue (BullMQ), password (bcrypt), storage (Flydrive)
│   ├── utils/                     # JWT tokens, cookies
│   └── resources/                 # account, authentication, users + health-check + welcome
├── database/
│   ├── schema/                    # Drizzle schema (users, storage, validation-tokens)
│   ├── migrations/                # drizzle-kit output
│   └── seeders/
│       ├── 0001-bootstrap-admin.seed.ts
│       └── main.ts                # Orquestrador (connectDatabase + migrate + run all seeders)
├── drizzle.config.ts              # drizzle-kit config
├── docker-entrypoint.sh           # Roda seeders (que rodam migrations) antes do server
├── templates/email/               # EJS templates
└── test/                          # Setup (e2e via Postgres + truncate), auth helper
```

## Camadas

| Camada | Responsabilidade |
|--------|------------------|
| Controller (`*.controller.ts`) | HTTP: parse, validar, chamar use-case, formatar response |
| Validator (`*.validator.ts`) | Schemas Zod |
| Use Case (`*.use-case.ts`) | Lógica de negócio. Retorna `Either<HTTPException, T>` |
| Repository (`*-contract.repository.ts` + `*-drizzle.repository.ts` + `*-in-memory.repository.ts`) | Acesso a dados |
| Service (`*-contract.service.ts` + impl) | Cross-cutting (email, storage, password) |
| Middleware | Auth JWT + role |

## Padrões

### Either / Result Pattern
```ts
const result = await useCase.execute(input);
if (result.isLeft()) return response.status(result.value.code).send(result.value);
return response.status(200).send(result.value);
```

### TypeScript patterns (skill enforced)

- **No `any`** — use `unknown` + narrowing
- **No `as Type`** — só `as const`. Use type guards / Zod
- **No ternary** — `if/else` em statements; `cond && <X/>` em JSX
- **Object mapper, não enum**:
  ```ts
  export const Role = { MASTER: 'MASTER', ADMINISTRATOR: 'ADMINISTRATOR' } as const;
  export type Role = (typeof Role)[keyof typeof Role];
  ```
- **Return type explícito** em toda function (incluindo callbacks)
- **React FCs** retornam `React.JSX.Element` (N/A neste backend)

### Soft Delete
Todas as entidades usam `trashed: boolean` + `trashed_at: timestamptz`. Hard
delete é exceção (e.g., `users/delete` restrito a MASTER).

### RBAC

| Role | Permissões |
|------|-----------|
| MASTER | Todas. Único role com hard-delete de users. |
| ADMINISTRATOR | CRUD de users (exceto hard-delete). Default para sign-up público. |

`RoleMiddleware([Role.MASTER, Role.ADMINISTRATOR])` em controllers que precisam restrição.

## Comandos CLI

```bash
npm run dev          # Dev mode (watch + SWC)
npm run build        # tsc + tsup -> /build
npm run start        # Produção (build/bin/server.js)

npm run db:generate  # Gera migration a partir do schema
npm run db:migrate   # Aplica migrations pendentes
npm run db:push      # Push direto sem migration (dev only)
npm run db:studio    # Drizzle Studio UI

npm run seed         # Roda main.ts (migrate + bootstrap admin)
npm run seed:prod    # Versão build (seed/main.js)

npm run test:unit    # Vitest unit (in-memory repos)
npm run test:e2e     # Vitest e2e (Postgres real, truncate por test)
npm run test:coverage

npm run lint         # ESLint --fix
```

## Resposta padrão

### Sucesso
```json
{ "data": [...], "meta": { "total": 100, "page": 1, "perPage": 10, "lastPage": 10, "firstPage": 1 } }
```

### Erro
```json
{ "message": "Não encontrado", "code": 404, "cause": "USER_NOT_FOUND", "errors": { "campo": "mensagem" } }
```

## DI (di-registry.ts)

Repositories: User, Storage, ValidationToken (Drizzle).
Services: Email (Nodemailer), EmailQueue (BullMQ), Password (Bcrypt), Storage (Flydrive).

Para adicionar nova dependência:
1. Cria contract (abstract class)
2. Cria implementação concreta
3. Registra em `di-registry.ts` com `injectablesHolder.injectService(Contract, Impl)`

## Boot

```
1. connectDatabase()        — pg Pool + Drizzle
2. runMigrations()          — drizzle migrate
3. kernel.ready() + listen()
4. startEmailWorker()       — BullMQ consumer
```

`docker-entrypoint.sh` chama `npm run seed` antes do servidor (idempotente).

## Variáveis de Ambiente

Ver `.env.example`. Validadas em `start/env.ts` com Zod.

| Grupo | Vars |
|-------|------|
| App | `NODE_ENV`, `PORT`, `APPLICATION_SERVER_URL`, `APPLICATION_CLIENT_URL` |
| Database | `DATABASE_URL` (postgres://...) |
| Auth | `JWT_PUBLIC_KEY`, `JWT_PRIVATE_KEY`, `COOKIE_SECRET`, `COOKIE_DOMAIN` |
| CORS | `ALLOWED_ORIGINS` (separado por `;`, suporta `*.dominio.com`) |
| Redis | `REDIS_URL` |
| SMTP | `EMAIL_PROVIDER_HOST/PORT/USER/PASSWORD/FROM`, `EMAIL_WORKER_CONCURRENCY` |
| Storage | `STORAGE_DRIVER` (`local`\|`s3`), `STORAGE_ENDPOINT/REGION/BUCKET/ACCESS_KEY/SECRET_KEY` |
| Bootstrap | `BOOTSTRAP_MASTER_EMAIL`, `BOOTSTRAP_MASTER_PASSWORD`, `BOOTSTRAP_MASTER_NAME` |

`.env` para dev/prod, `.env.test` para testes (sempre `127.0.0.1`).

## Tests

`test/setup.e2e.ts` conecta Postgres real, roda migrations no `beforeAll`,
TRUNCATE em todas as tabelas no `beforeEach`. Use `createAuthenticatedUser()`
em `test/helpers/auth.helper.ts` para autenticar requests via supertest.

Specs antigos foram removidos durante a migração mongo→postgres. Crie novos
seguindo os padrões: `*.use-case.spec.ts` (unit, in-memory) e
`*.controller.spec.ts` (e2e, Postgres real).

## Storage

- `STORAGE_DRIVER=local`: salva em `_storage/`, kernel hook serve `/storage/{filename}`
- `STORAGE_DRIVER=s3`: usa AWS SDK + presigned URLs
- Imagens (jpeg/png/gif/bmp/tiff) viraj WebP 1200x1200 (qualidade 80) automaticamente
- Tabela `storage` registra metadados; arquivo físico é responsabilidade do `StorageService`

## Cookie/JWT

- AccessToken: 24h, payload `{ sub, email, role, type: "ACCESS" }`
- RefreshToken: 7d, payload `{ sub, type: "REFRESH" }`
- Cookies: httpOnly, sameSite none(prod)/lax(dev), secure(prod), path /
- Extração: cookie `accessToken` (preferencial) ou header `Authorization: Bearer <token>`

## Erro Handling

`HTTPException` com factories (`BadRequest`, `Unauthorized`, `NotFound`, `Forbidden`, `Conflict`, `UnprocessableEntity`, `InternalServerError`). Mensagens em PT-BR. Field errors via 3º arg (`errors: Record<string, string>`).

Global handler em `kernel.ts` captura: HTTPException → ZodError → FST_ERR_VALIDATION → fallback 500.

Endpoints OpenAPI: `/openapi.json` (raw), `/documentation` (Scalar UI).
