---
id: environment-variables
title: Environment Variables
---

Aprenda como configurar e usar variaveis de ambiente de forma segura na sua aplicacao TanStack Start em diferentes contextos (server functions, codigo do cliente e processos de build).

## Inicio Rapido

TanStack Start carrega automaticamente arquivos `.env` e disponibiliza variaveis nos contextos de servidor e cliente com limites de seguranca adequados.

```bash
# .env
DATABASE_URL=postgresql://user:pass@localhost:5432/mydb
VITE_APP_NAME=My TanStack Start App
```

```typescript
// Server function - can access any environment variable
const getUser = createServerFn().handler(async () => {
  const db = await connect(process.env.DATABASE_URL) // ✅ Server-only
  return db.user.findFirst()
})

// Client component - only VITE_ prefixed variables
export function AppHeader() {
  return <h1>{import.meta.env.VITE_APP_NAME}</h1> // ✅ Client-safe
}
```

## Contextos de Variaveis de Ambiente

### Contexto do Lado do Servidor (Server Functions e API Routes)

Server functions podem acessar **qualquer** variavel de ambiente usando `process.env`:

```typescript
import { createServerFn } from "@tanstack/react-start";

// Database connection (server-only)
const connectToDatabase = createServerFn().handler(async () => {
  const connectionString = process.env.DATABASE_URL; // No prefix needed
  const apiKey = process.env.EXTERNAL_API_SECRET; // Stays on server

  // These variables are never exposed to the client
  return await database.connect(connectionString);
});

// Authentication (server-only)
const authenticateUser = createServerFn()
  .inputValidator(z.object({ token: z.string() }))
  .handler(async ({ data }) => {
    const jwtSecret = process.env.JWT_SECRET; // Server-only
    return jwt.verify(data.token, jwtSecret);
  });
```

### Contexto do Lado do Cliente (Components e Codigo do Cliente)

Codigo do cliente so pode acessar variaveis com o prefixo `VITE_`:

```typescript
// Client configuration
export function ApiProvider({ children }: { children: React.ReactNode }) {
  const apiUrl = import.meta.env.VITE_API_URL     // ✅ Public
  const apiKey = import.meta.env.VITE_PUBLIC_KEY  // ✅ Public

  // This would be undefined (security feature):
  // const secret = import.meta.env.DATABASE_URL   // ❌ Undefined

  return (
    <ApiContext.Provider value={{ apiUrl, apiKey }}>
      {children}
    </ApiContext.Provider>
  )
}

// Feature flags
export function FeatureGatedComponent() {
  const enableNewFeature = import.meta.env.VITE_ENABLE_NEW_FEATURE === 'true'

  if (!enableNewFeature) return null

  return <NewFeature />
}
```

## Configuracao de Arquivos de Ambiente

### Hierarquia de Arquivos (Carregados em Ordem)

TanStack Start carrega automaticamente arquivos de ambiente nesta ordem:

```
.env.local          # Sobrescrita local (adicione ao .gitignore)
.env.production     # Variaveis especificas de producao
.env.development    # Variaveis especificas de desenvolvimento
.env                # Variaveis padrao (commite no git)
```

### Exemplo de Configuracao

**.env** (commitado no repositorio):

```bash
# Public configuration
VITE_APP_NAME=My TanStack Start App
VITE_API_URL=https://api.example.com
VITE_SENTRY_DSN=https://...

# Server configuration templates
DATABASE_URL=postgresql://localhost:5432/myapp_dev
REDIS_URL=redis://localhost:6379
```

**.env.local** (adicione ao .gitignore):

```bash
# Override for local development
DATABASE_URL=postgresql://user:password@localhost:5432/myapp_local
STRIPE_SECRET_KEY=sk_test_...
JWT_SECRET=your-local-secret
```

**.env.production**:

```bash
# Production overrides
VITE_API_URL=https://api.myapp.com
DATABASE_POOL_SIZE=20
```

## Padroes Comuns

### Configuracao de Banco de Dados

```typescript
// src/lib/database.ts
import { createServerFn } from "@tanstack/react-start";

const getDatabaseConnection = createServerFn().handler(async () => {
  const config = {
    url: process.env.DATABASE_URL,
    maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || "10"),
    ssl: process.env.NODE_ENV === "production",
  };

  return createConnection(config);
});
```

### Configuracao do Provedor de Autenticacao

```typescript
// src/lib/auth.ts (Server)
export const authConfig = {
  secret: process.env.AUTH_SECRET,
  providers: {
    auth0: {
      domain: process.env.AUTH0_DOMAIN,
      clientId: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET, // Server-only
    }
  }
}

// src/components/AuthProvider.tsx (Client)
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      // No client secret here - it stays on the server
    >
      {children}
    </Auth0Provider>
  )
}
```

### Integracao com API Externa

```typescript
// src/lib/external-api.ts
import { createServerFn } from "@tanstack/react-start";

// Server-side API calls (can use secret keys)
const fetchUserData = createServerFn()
  .inputValidator(z.object({ userId: z.string() }))
  .handler(async ({ data }) => {
    const response = await fetch(
      `${process.env.EXTERNAL_API_URL}/users/${data.userId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.EXTERNAL_API_SECRET}`,
          "Content-Type": "application/json",
        },
      },
    );

    return response.json();
  });

// Client-side API calls (public endpoints only)
export function usePublicData() {
  const apiUrl = import.meta.env.VITE_PUBLIC_API_URL;

  return useQuery({
    queryKey: ["public-data"],
    queryFn: () => fetch(`${apiUrl}/public/stats`).then((r) => r.json()),
  });
}
```

### Feature Flags e Configuracao

```typescript
// src/config/features.ts
export const featureFlags = {
  enableNewDashboard: import.meta.env.VITE_ENABLE_NEW_DASHBOARD === 'true',
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  debugMode: import.meta.env.VITE_DEBUG_MODE === 'true',
}

// Usage in components
export function Dashboard() {
  if (featureFlags.enableNewDashboard) {
    return <NewDashboard />
  }

  return <LegacyDashboard />
}
```

## Type Safety

### Declaracoes TypeScript

Crie `src/env.d.ts` para adicionar type safety:

```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Client-side environment variables
  readonly VITE_APP_NAME: string;
  readonly VITE_API_URL: string;
  readonly VITE_AUTH0_DOMAIN: string;
  readonly VITE_AUTH0_CLIENT_ID: string;
  readonly VITE_SENTRY_DSN?: string;
  readonly VITE_ENABLE_NEW_DASHBOARD?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Server-side environment variables
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly DATABASE_URL: string;
      readonly REDIS_URL: string;
      readonly JWT_SECRET: string;
      readonly AUTH0_CLIENT_SECRET: string;
      readonly STRIPE_SECRET_KEY: string;
      readonly NODE_ENV: "development" | "production" | "test";
    }
  }
}

export {};
```

### Validacao em Runtime

Use Zod para validacao em runtime das variaveis de ambiente:

```typescript
// src/config/env.ts
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  NODE_ENV: z.enum(["development", "production", "test"]),
});

const clientEnvSchema = z.object({
  VITE_APP_NAME: z.string(),
  VITE_API_URL: z.string().url(),
  VITE_AUTH0_DOMAIN: z.string(),
  VITE_AUTH0_CLIENT_ID: z.string(),
});

// Validate server environment
export const serverEnv = envSchema.parse(process.env);

// Validate client environment
export const clientEnv = clientEnvSchema.parse(import.meta.env);
```

## Melhores Praticas de Seguranca

### 1. Nunca Exponha Segredos ao Cliente

```typescript
// ❌ WRONG - Secret exposed to client bundle
const config = {
  apiKey: import.meta.env.VITE_SECRET_API_KEY, // This will be in your JS bundle!
};

// ✅ CORRECT - Keep secrets on server
const getApiData = createServerFn().handler(async () => {
  const response = await fetch(apiUrl, {
    headers: { Authorization: `Bearer ${process.env.SECRET_API_KEY}` },
  });
  return response.json();
});
```

### 2. Use Prefixos Apropriados

```bash
# ✅ Server-only (no prefix)
DATABASE_URL=postgresql://...
JWT_SECRET=super-secret-key
STRIPE_SECRET_KEY=sk_live_...

# ✅ Client-safe (VITE_ prefix)
VITE_APP_NAME=My App
VITE_API_URL=https://api.example.com
VITE_SENTRY_DSN=https://...
```

### 3. Valide Variaveis Obrigatorias

```typescript
// src/config/validation.ts
const requiredServerEnv = ["DATABASE_URL", "JWT_SECRET"] as const;

const requiredClientEnv = ["VITE_APP_NAME", "VITE_API_URL"] as const;

// Validate on server startup
for (const key of requiredServerEnv) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

// Validate client environment at build time
for (const key of requiredClientEnv) {
  if (!import.meta.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}
```

## Checklist de Producao

- [ ] Todas as variaveis sensiveis sao apenas do servidor (sem prefixo `VITE_`)
- [ ] Variaveis do cliente usam o prefixo `VITE_`
- [ ] `.env.local` esta no `.gitignore`
- [ ] Variaveis de ambiente de producao estao configuradas na plataforma de hospedagem
- [ ] Variaveis de ambiente obrigatorias sao validadas na inicializacao
- [ ] Sem segredos hardcoded no codigo fonte
- [ ] URLs de banco de dados usam connection pooling em producao
- [ ] Chaves de API sao rotacionadas regularmente

## Problemas Comuns

### Variavel de Ambiente esta Undefined

**Problema**: `import.meta.env.MY_VARIABLE` retorna `undefined`

**Solucoes**:

1. **Adicione o prefixo correto**: Use o prefixo `VITE_` (ex: `VITE_MY_VARIABLE`)
2. **Reinicie o servidor de desenvolvimento** apos adicionar novas variaveis
3. **Verifique a localizacao do arquivo**: O arquivo `.env` deve estar na raiz do projeto
4. **Verifique a configuracao do bundler**: Garanta que as variaveis estao sendo injetadas corretamente

**Exemplo**:

```bash
# ❌ Won't work in client code
API_KEY=abc123

# ✅ Works in client code
VITE_API_KEY=abc123

# ❌ Won't bundle the variable (assuming it is not set in the environment of the build)
npm run build

# ✅ Works in client code and will bundle the variable for production
VITE_API_KEY=abc123 npm run build
```

### Variaveis de Ambiente do Cliente em Runtime na Producao

**Problema**: Se variaveis `VITE_` sao substituidas apenas no tempo de build, como disponibilizar variaveis em runtime no cliente?

**Solucoes**:

Passe variaveis do servidor para o cliente:

```tsx
const getRuntimeVar = createServerFn({ method: "GET" }).handler(() => {
  return process.env.MY_RUNTIME_VAR; // notice `process.env` on the server, and no `VITE_` prefix
});

export const Route = createFileRoute("/")({
  loader: async () => {
    const foo = await getRuntimeVar();
    return { foo };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { foo } = Route.useLoaderData();
  // ... use your variable however you want
}
```

### Variavel Nao Atualiza

**Problema**: Alteracoes em variaveis de ambiente nao sao refletidas

**Solucoes**:

1. Reinicie o servidor de desenvolvimento
2. Verifique se voce esta modificando o arquivo `.env` correto
3. Verifique a hierarquia de arquivos (`.env.local` sobrescreve `.env`)

### Erros de TypeScript

**Problema**: `Property 'VITE_MY_VAR' does not exist on type 'ImportMetaEnv'`

**Solucao**: Adicione ao `src/env.d.ts`:

```typescript
interface ImportMetaEnv {
  readonly VITE_MY_VAR: string;
}
```

### Seguranca: Segredo Exposto ao Cliente

**Problema**: Dados sensiveis aparecendo no bundle do cliente

**Solucoes**:

1. Remova o prefixo `VITE_` de variaveis sensiveis
2. Mova operacoes sensiveis para server functions
3. Use ferramentas de build para verificar se nao ha segredos no bundle do cliente

### Erros de Build em Producao

**Problema**: Variaveis de ambiente ausentes no build de producao

**Solucoes**:

1. Configure as variaveis na plataforma de hospedagem
2. Valide variaveis obrigatorias no tempo de build
3. Use arquivos `.env` especificos do deploy

## Configuracao de Build do Servidor

### Substituicao Estatica de `NODE_ENV`

Por padrao, o TanStack Start substitui estaticamente `process.env.NODE_ENV` nos **builds do servidor** no tempo de build. Isso habilita a eliminacao de codigo morto (tree-shaking) para caminhos de codigo somente de desenvolvimento no seu bundle do servidor.

**Por que isso importa:** O Vite substitui automaticamente `process.env.NODE_ENV` nos builds do cliente, mas builds do servidor executam no Node.js onde `process.env` e um objeto real de runtime. Sem a substituicao estatica, codigo como este permaneceria no seu bundle de producao do servidor:

```typescript
if (process.env.NODE_ENV === "development") {
  // This code would NOT be eliminated without static replacement
  enableDevTools();
  logDebugInfo();
}
```

Com a substituicao estatica habilitada (o padrao), o bundler ve `"production" === 'development'` e elimina o bloco inteiro.

### Configurando a Substituicao Estatica

A substituicao e controlada pela opcao `server.build.staticNodeEnv`:

```ts
// vite.config.ts
import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    tanstackStart({
      server: {
        build: {
          // Replace process.env.NODE_ENV at build time (default: true)
          staticNodeEnv: true,
        },
      },
    }),
    viteReact(),
  ],
});
```

O valor de substituicao e determinado nesta ordem:

1. `process.env.NODE_ENV` no tempo de build (se definido)
2. O `mode` do Vite (ex: de `--mode staging`)
3. `"production"` (fallback)

### Quando Desabilitar a Substituicao Estatica

Defina `staticNodeEnv: false` se voce precisa que `NODE_ENV` permaneca dinamico em runtime:

```ts
tanstackStart({
  server: {
    build: {
      staticNodeEnv: false, // Keep NODE_ENV dynamic at runtime
    },
  },
});
```

Razoes comuns para desabilitar:

- **Mesmo build, multiplos ambientes**: Fazendo deploy de um unico artefato de build para staging e producao
- **Deteccao de ambiente em runtime**: Codigo que precisa verificar o ambiente real de runtime
- **Testando builds de producao localmente**: Executando builds de producao com `NODE_ENV=development`

> **Nota:** Desabilitar a substituicao estatica significa que caminhos de codigo somente de desenvolvimento permanecerao no seu bundle de producao e serao avaliados em runtime.

> **Importante:** Se voce desabilitar `staticNodeEnv`, voce **deve** definir `NODE_ENV=production` em runtime ao executar seu servidor em producao. Sem isso, o React (e possivelmente outras bibliotecas) executara em modo de desenvolvimento, que e significativamente mais lento e inclui avisos e verificacoes extras nao destinados ao uso em producao.

## Recursos Relacionados

- [Padroes de Execucao de Codigo](./code-execution-patterns.md) - Aprenda sobre execucao de codigo servidor vs cliente
- [Server Functions](./server-functions.md) - Saiba mais sobre codigo do lado do servidor
- [Hospedagem](./hosting.md) - Configuracao de variaveis de ambiente especificas da plataforma
- [Variaveis de Ambiente do Vite](https://vitejs.dev/guide/env-and-mode.html) - Documentacao oficial do Vite
