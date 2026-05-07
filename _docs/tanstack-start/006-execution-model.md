---
id: execution-model
title: Execution Model
---

Entender onde o codigo e executado e fundamental para construir aplicacoes TanStack Start. Este guia explica o modelo de execucao do TanStack Start e como controlar onde seu codigo e executado.

## Principio Central: Isomorfico por Padrao

**Todo codigo no TanStack Start e isomorfico por padrao** - ele e executado e incluido nos bundles do servidor e do cliente, a menos que seja explicitamente restringido.

```tsx
// ✅ This runs on BOTH server and client
function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

// ✅ Route loaders are ISOMORPHIC
export const Route = createFileRoute("/products")({
  loader: async () => {
    // This runs on server during SSR AND on client during navigation
    const response = await fetch("/api/products");
    return response.json();
  },
});
```

> **Entendimento Critico**: Os `loader`s de rota sao isomorficos - eles executam tanto no servidor quanto no cliente, nao apenas no servidor.

## A Fronteira de Execucao

Aplicacoes TanStack Start executam em dois ambientes:

### Ambiente do Servidor

- **Runtime Node.js** com acesso ao sistema de arquivos, bancos de dados, variaveis de ambiente
- **Durante o SSR** - Rendering inicial das paginas no servidor
- **Requisicoes de API** - Server functions executam no lado do servidor
- **Tempo de build** - Geracao estatica e pre-rendering

### Ambiente do Cliente

- **Runtime do navegador** com acesso ao DOM, localStorage, interacoes do usuario
- **Apos hydration** - O cliente assume apos o rendering inicial do servidor
- **Navegacao** - Loaders de rota executam no lado do cliente durante a navegacao
- **Interacoes do usuario** - Handlers de eventos, envio de formularios, etc.

## APIs de Controle de Execucao

### Execucao Apenas no Servidor

| API                      | Caso de Uso                   | Comportamento no Cliente       |
| ------------------------ | ----------------------------- | ------------------------------ |
| `createServerFn()`       | Chamadas RPC, mutations de dados | Requisicao de rede ao servidor |
| `createServerOnlyFn(fn)` | Funcoes utilitarias           | Lanca erro                     |

```tsx
import { createServerFn, createServerOnlyFn } from "@tanstack/react-start";

// RPC: Server execution, callable from client
const updateUser = createServerFn({ method: "POST" })
  .inputValidator((data: UserData) => data)
  .handler(async ({ data }) => {
    // Only runs on server, but client can call it
    return await db.users.update(data);
  });

// Utility: Server-only, client crashes if called
const getEnvVar = createServerOnlyFn(() => process.env.DATABASE_URL);
```

### Execucao Apenas no Cliente

| API                      | Caso de Uso                       | Comportamento no Servidor |
| ------------------------ | --------------------------------- | ------------------------- |
| `createClientOnlyFn(fn)` | Utilitarios do navegador          | Lanca erro                |
| `<ClientOnly>`           | Components que precisam de APIs do navegador | Renderiza fallback        |

```tsx
import { createClientOnlyFn } from "@tanstack/react-start";
import { ClientOnly } from "@tanstack/react-router";

// Utility: Client-only, server crashes if called
const saveToStorage = createClientOnlyFn((key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
});

// Component: Only renders children after hydration
function Analytics() {
  return (
    <ClientOnly fallback={null}>
      <GoogleAnalyticsScript />
    </ClientOnly>
  );
}
```

#### Hook useHydrated

Para um controle mais granular sobre comportamento dependente de hydration, use o hook `useHydrated`. Ele retorna um booleano indicando se o cliente foi hidratado:

```tsx
import { useHydrated } from "@tanstack/react-router";

function TimeZoneDisplay() {
  const hydrated = useHydrated();
  const timeZone = hydrated
    ? Intl.DateTimeFormat().resolvedOptions().timeZone
    : "UTC";

  return <div>Your timezone: {timeZone}</div>;
}
```

**Comportamento:**

- **Durante o SSR**: Sempre retorna `false`
- **Primeiro render no cliente**: Retorna `false`
- **Apos hydration**: Retorna `true` (e permanece `true` para todos os renders subsequentes)

Isso e util quando voce precisa renderizar conteudo condicionalmente baseado em dados do lado do cliente (como fuso horario do navegador, locale ou localStorage) enquanto fornece um fallback adequado para o rendering no servidor.

### Implementacoes Especificas por Ambiente

```tsx
import { createIsomorphicFn } from "@tanstack/react-start";

// Different implementation per environment
const getDeviceInfo = createIsomorphicFn()
  .server(() => ({ type: "server", platform: process.platform }))
  .client(() => ({ type: "client", userAgent: navigator.userAgent }));
```

## Padroes Arquiteturais

### Progressive Enhancement

Construa components que funcionam sem JavaScript e aprimoram com funcionalidade do lado do cliente:

```tsx
function SearchForm() {
  const [query, setQuery] = useState("");

  return (
    <form action="/search" method="get">
      <input
        name="q"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <ClientOnly fallback={<button type="submit">Search</button>}>
        <SearchButton onSearch={() => search(query)} />
      </ClientOnly>
    </form>
  );
}
```

### Armazenamento Consciente do Ambiente

```tsx
const storage = createIsomorphicFn()
  .server((key: string) => {
    // Server: File-based cache
    const fs = require("node:fs");
    return JSON.parse(fs.readFileSync(".cache", "utf-8"))[key];
  })
  .client((key: string) => {
    // Client: localStorage
    return JSON.parse(localStorage.getItem(key) || "null");
  });
```

### RPC vs Chamadas Diretas de Funcao

Entendendo quando usar server functions vs funcoes apenas do servidor:

```tsx
// createServerFn: RPC pattern - server execution, client callable
const fetchUser = createServerFn().handler(async () => await db.users.find());

// Usage from client component:
const user = await fetchUser(); // ✅ Network request

// createServerOnlyFn: Crashes if called from client
const getSecret = createServerOnlyFn(() => process.env.SECRET);

// Usage from client:
const secret = getSecret(); // ❌ Throws error
```

## Anti-Padroes Comuns

### Exposicao de Variaveis de Ambiente

```tsx
// ❌ Exposes to client bundle
const apiKey = process.env.SECRET_KEY;

// ✅ Server-only access
const apiKey = createServerOnlyFn(() => process.env.SECRET_KEY);
```

### Suposicoes Incorretas sobre o Loader

```tsx
// ❌ Assuming loader is server-only
export const Route = createFileRoute("/users")({
  loader: () => {
    // This runs on BOTH server and client!
    const secret = process.env.SECRET; // Exposed to client
    return fetch(`/api/users?key=${secret}`);
  },
});

// ✅ Use server function for server-only operations
const getUsersSecurely = createServerFn().handler(() => {
  const secret = process.env.SECRET; // Server-only
  return fetch(`/api/users?key=${secret}`);
});

export const Route = createFileRoute("/users")({
  loader: () => getUsersSecurely(), // Isomorphic call to server function
});
```

### Incompatibilidades de Hydration

```tsx
// ❌ Different content server vs client
function CurrentTime() {
  return <div>{new Date().toLocaleString()}</div>;
}

// ✅ Consistent rendering
function CurrentTime() {
  const [time, setTime] = useState<string>();

  useEffect(() => {
    setTime(new Date().toLocaleString());
  }, []);

  return <div>{time || "Loading..."}</div>;
}
```

## Deteccao de Ambiente Manual vs Orientada por API

```tsx
// Manual: You handle the logic
function logMessage(msg: string) {
  if (typeof window === "undefined") {
    console.log(`[SERVER]: ${msg}`);
  } else {
    console.log(`[CLIENT]: ${msg}`);
  }
}

// API: Framework handles it
const logMessage = createIsomorphicFn()
  .server((msg) => console.log(`[SERVER]: ${msg}`))
  .client((msg) => console.log(`[CLIENT]: ${msg}`));
```

## Framework de Decisao Arquitetural

**Escolha Apenas Servidor quando:**

- Acessar dados sensiveis (variaveis de ambiente, segredos)
- Operacoes no sistema de arquivos
- Conexoes com banco de dados
- Chaves de API externas

**Escolha Apenas Cliente quando:**

- Manipulacao do DOM
- APIs do navegador (localStorage, geolocalizacao)
- Tratamento de interacao do usuario
- Analytics/rastreamento

**Escolha Isomorfico quando:**

- Formatacao/transformacao de dados
- Logica de negocios
- Utilitarios compartilhados
- Loaders de rota (sao isomorficos por natureza)

## Consideracoes de Seguranca

### Analise de Bundle

Sempre verifique se codigo apenas do servidor nao esta incluido nos bundles do cliente:

```bash
# Analyze client bundle
npm run build
# Check dist/client for any server-only imports
```

### Estrategia de Variaveis de Ambiente

- **Expostas ao cliente**: Use o prefixo `VITE_` para variaveis acessiveis pelo cliente
- **Apenas servidor**: Acesse via `createServerOnlyFn()` ou `createServerFn()`
- **Nunca exponha**: URLs de banco de dados, chaves de API, segredos

### Error Boundaries

Trate erros de execucao servidor/cliente de forma elegante:

```tsx
function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundaryComponent
      fallback={<div>Something went wrong</div>}
      onError={(error) => {
        if (typeof window === "undefined") {
          console.error("[SERVER ERROR]:", error);
        } else {
          console.error("[CLIENT ERROR]:", error);
        }
      }}
    >
      {children}
    </ErrorBoundaryComponent>
  );
}
```

Entender o modelo de execucao do TanStack Start e crucial para construir aplicacoes seguras, performaticas e manteniveis. A abordagem isomorfica por padrao oferece flexibilidade enquanto as APIs de controle de execucao dao a voce controle preciso quando necessario.
