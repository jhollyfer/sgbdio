---
id: server-functions
title: Server Functions
---

## O que sao Server Functions?

Server functions permitem que voce defina logica exclusiva do servidor que pode ser chamada de qualquer lugar da sua aplicacao - loaders, components, hooks ou outras server functions. Elas executam no servidor, mas podem ser invocadas a partir do codigo do cliente de forma transparente.

```tsx
import { createServerFn } from "@tanstack/react-start";

export const getServerTime = createServerFn().handler(async () => {
  // This runs only on the server
  return new Date().toISOString();
});

// Call from anywhere - components, loaders, hooks, etc.
const time = await getServerTime();
```

Server functions fornecem capacidades do servidor (acesso a banco de dados, variaveis de ambiente, sistema de arquivos) mantendo type safety atraves da fronteira de rede.

## Uso Basico

Server functions sao criadas com `createServerFn()` e podem especificar o metodo HTTP:

```tsx
import { createServerFn } from "@tanstack/react-start";

// GET request (default)
export const getData = createServerFn().handler(async () => {
  return { message: "Hello from server!" };
});

// POST request
export const saveData = createServerFn({ method: "POST" }).handler(async () => {
  // Server-only logic
  return { success: true };
});
```

## Onde Chamar Server Functions

Chame server functions a partir de:

- **Loaders de rota** - Perfeitos para fetching de dados
- **Components** - Use com o hook `useServerFn()`
- **Outras server functions** - Componha logica do servidor
- **Handlers de eventos** - Trate envios de formularios, cliques, etc.

```tsx
// In a route loader
export const Route = createFileRoute("/posts")({
  loader: () => getPosts(),
});

// In a component
function PostList() {
  const getPosts = useServerFn(getServerPosts);

  const { data } = useQuery({
    queryKey: ["posts"],
    queryFn: () => getPosts(),
  });
}
```

## Organizacao de Arquivos

Para aplicacoes maiores, considere organizar o codigo do lado do servidor em arquivos separados. Aqui esta uma abordagem:

```
src/utils/
├── users.functions.ts   # Server function wrappers (createServerFn)
├── users.server.ts      # Server-only helpers (DB queries, internal logic)
└── schemas.ts           # Shared validation schemas (client-safe)
```

- **`.functions.ts`** - Exporta wrappers de `createServerFn`, seguros para importar em qualquer lugar
- **`.server.ts`** - Codigo exclusivo do servidor, importado apenas dentro de handlers de server functions
- **`.ts`** (sem sufixo) - Codigo seguro para o cliente (tipos, schemas, constantes)

### Exemplo

```tsx
// users.server.ts - Server-only helpers
import { db } from "~/db";

export async function findUserById(id: string) {
  return db.query.users.findFirst({ where: eq(users.id, id) });
}
```

```tsx
// users.functions.ts - Server functions
import { createServerFn } from "@tanstack/react-start";
import { findUserById } from "./users.server";

export const getUser = createServerFn({ method: "GET" })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    return findUserById(data.id);
  });
```

### Importacoes Estaticas sao Seguras

Server functions podem ser importadas estaticamente em qualquer arquivo, incluindo components do cliente:

```tsx
// ✅ Safe - build process handles environment shaking
import { getUser } from "~/utils/users.functions";

function UserProfile({ id }) {
  const { data } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getUser({ data: { id } }),
  });
}
```

O processo de build substitui as implementacoes de server functions por stubs RPC nos bundles do cliente. O codigo real do servidor nunca chega ao navegador.

> [!WARNING]
> Evite importacoes dinamicas para server functions:
>
> ```tsx
> // ❌ Can cause bundler issues
> const { getUser } = await import("~/utils/users.functions");
> ```

## Parametros e Validacao

Server functions aceitam um unico parametro `data`. Como elas atravessam a fronteira de rede, a validacao garante type safety e correcao em runtime.

### Parametros Basicos

```tsx
import { createServerFn } from "@tanstack/react-start";

export const greetUser = createServerFn({ method: "GET" })
  .inputValidator((data: { name: string }) => data)
  .handler(async ({ data }) => {
    return `Hello, ${data.name}!`;
  });

await greetUser({ data: { name: "John" } });
```

### Validacao com Zod

Para validacao robusta, use bibliotecas de schema como Zod:

```tsx
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const UserSchema = z.object({
  name: z.string().min(1),
  age: z.number().min(0),
});

export const createUser = createServerFn({ method: "POST" })
  .inputValidator(UserSchema)
  .handler(async ({ data }) => {
    // data is fully typed and validated
    return `Created user: ${data.name}, age ${data.age}`;
  });
```

### Dados de Formulario

Trate envios de formularios com FormData:

```tsx
export const submitForm = createServerFn({ method: "POST" })
  .inputValidator((data) => {
    if (!(data instanceof FormData)) {
      throw new Error("Expected FormData");
    }

    return {
      name: data.get("name")?.toString() || "",
      email: data.get("email")?.toString() || "",
    };
  })
  .handler(async ({ data }) => {
    // Process form data
    return { success: true };
  });
```

## Tratamento de Erros e Redirecionamentos

Server functions podem lancar erros, redirecionamentos e respostas not-found que sao tratados automaticamente quando chamados a partir de ciclos de vida de rota ou components usando `useServerFn()`.

### Erros Basicos

```tsx
import { createServerFn } from "@tanstack/react-start";

export const riskyFunction = createServerFn().handler(async () => {
  if (Math.random() > 0.5) {
    throw new Error("Something went wrong!");
  }
  return { success: true };
});

// Errors are serialized to the client
try {
  await riskyFunction();
} catch (error) {
  console.log(error.message); // "Something went wrong!"
}
```

### Redirecionamentos

Use redirecionamentos para autenticacao, navegacao, etc:

```tsx
import { createServerFn } from "@tanstack/react-start";
import { redirect } from "@tanstack/react-router";

export const requireAuth = createServerFn().handler(async () => {
  const user = await getCurrentUser();

  if (!user) {
    throw redirect({ to: "/login" });
  }

  return user;
});
```

### Not Found

Lance erros not-found para recursos ausentes:

```tsx
import { createServerFn } from "@tanstack/react-start";
import { notFound } from "@tanstack/react-router";

export const getPost = createServerFn()
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const post = await db.findPost(data.id);

    if (!post) {
      throw notFound();
    }

    return post;
  });
```

## Topicos Avancados

Para padroes e recursos mais avancados de server functions, consulte estes guias dedicados:

### Context do Servidor e Tratamento de Requisicoes

Acesse headers de requisicao, cookies e personalize respostas:

```tsx
import { createServerFn } from "@tanstack/react-start";
import {
  getRequest,
  getRequestHeader,
  setResponseHeaders,
  setResponseStatus,
} from "@tanstack/react-start/server";

export const getCachedData = createServerFn({ method: "GET" }).handler(
  async () => {
    // Access the incoming request
    const request = getRequest();
    const authHeader = getRequestHeader("Authorization");

    // Set response headers (e.g., for caching)
    setResponseHeaders(
      new Headers({
        "Cache-Control": "public, max-age=300",
        "CDN-Cache-Control": "max-age=3600, stale-while-revalidate=600",
      }),
    );

    // Optionally set status code
    setResponseStatus(200);

    return fetchData();
  },
);
```

Utilitarios disponiveis:

- `getRequest()` - Acessa o objeto Request completo
- `getRequestHeader(name)` - Le um header de requisicao especifico
- `setResponseHeader(name, value)` - Define um unico header de resposta
- `setResponseHeaders(headers)` - Define multiplos headers de resposta via objeto Headers
- `setResponseStatus(code)` - Define o codigo de status HTTP

### Streaming

Transmita dados tipados de server functions para o cliente. Veja o [guia de Streaming de Dados a partir de Server Functions](./streaming-data-from-server-functions).

### Respostas Raw

Retorne objetos `Response`, dados binarios ou tipos de conteudo customizados.

### Progressive Enhancement

Use server functions sem JavaScript aproveitando a propriedade `.url` com formularios HTML.

### Middleware

Componha server functions com middleware para autenticacao, logging e logica compartilhada. Veja o [guia de Middleware](./middleware.md).

### Server Functions Estaticas

Faca cache dos resultados de server functions no tempo de build para geracao estatica. Veja [Server Functions Estaticas](./static-server-functions).

### Cancelamento de Requisicoes

Trate cancelamento de requisicoes com `AbortSignal` para operacoes de longa duracao.

### Geracao de ID de Funcao para build de producao

Server functions sao enderecadas por um ID de funcao gerado e estavel internamente. Esses IDs sao incorporados nos builds do cliente/SSR e usados pelo servidor para localizar e importar o modulo correto em runtime.

Por padrao, os IDs sao hashes SHA256 da mesma semente para manter os bundles compactos e evitar vazar caminhos de arquivo.
Se duas server functions acabarem com o mesmo ID (inclusive ao usar um gerador customizado), o sistema desduplicara adicionando um sufixo incremental como `_1`, `_2`, etc.

Personalizacao:

Voce pode personalizar a geracao de ID de funcao para o build de producao fornecendo uma funcao `generateFunctionId` ao configurar o plugin Vite do TanStack Start.

Prefira entradas deterministicas (filename + functionName) para que os IDs permanecam estaveis entre builds.

Por favor, note que esta personalizacao e **experimental** e sujeita a mudancas.

Exemplo:

```ts
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";

export default defineConfig({
  plugins: [
    tanstackStart({
      serverFns: {
        generateFunctionId: ({ filename, functionName }) => {
          // Return a custom ID string
          return crypto
            .createHash("sha1")
            .update(`${filename}--${functionName}`)
            .digest("hex");

          // If you return undefined, the default is used
          // return undefined
        },
      },
    }),
    react(),
  ],
});
```

---

> **Nota**: Server functions usam um processo de compilacao que extrai codigo do servidor dos bundles do cliente mantendo padroes de chamada transparentes. No cliente, as chamadas se tornam requisicoes `fetch` para o servidor.
