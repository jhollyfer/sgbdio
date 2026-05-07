---
id: code-execution-patterns
title: Code Execution Patterns
---

Este guia cobre padroes para controlar onde o codigo e executado na sua aplicacao TanStack Start - apenas servidor, apenas cliente ou isomorfico (ambos os ambientes). Para conceitos fundamentais, veja o guia do [Modelo de Execucao](./execution-model.md).

## Inicio Rapido

Configure as fronteiras de execucao na sua aplicacao TanStack Start:

```tsx
import {
  createServerFn,
  createServerOnlyFn,
  createClientOnlyFn,
  createIsomorphicFn,
} from "@tanstack/react-start";

// Server function (RPC call)
const getUsers = createServerFn().handler(async () => {
  return await db.users.findMany();
});

// Server-only utility (crashes on client)
const getSecret = createServerOnlyFn(() => process.env.API_SECRET);

// Client-only utility (crashes on server)
const saveToStorage = createClientOnlyFn((data: any) => {
  localStorage.setItem("data", JSON.stringify(data));
});

// Different implementations per environment
const logger = createIsomorphicFn()
  .server((msg) => console.log(`[SERVER]: ${msg}`))
  .client((msg) => console.log(`[CLIENT]: ${msg}`));
```

## Padroes de Implementacao

### Progressive Enhancement

```tsx
// Component works without JS, enhanced with JS
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

## Problemas Comuns

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

## Checklist de Producao

- [ ] **Analise de Bundle**: Verifique se codigo apenas do servidor nao esta no bundle do cliente
- [ ] **Variaveis de Ambiente**: Garanta que segredos usem `createServerOnlyFn()` ou `createServerFn()`
- [ ] **Logica do Loader**: Lembre-se de que loaders sao isomorficos, nao apenas do servidor
- [ ] **Fallbacks de ClientOnly**: Forneca fallbacks apropriados para evitar mudancas de layout
- [ ] **Error Boundaries**: Trate erros de execucao servidor/cliente de forma elegante

## Recursos Relacionados

- [Modelo de Execucao](./execution-model.md) - Conceitos fundamentais e padroes arquiteturais
- [Server Functions](./server-functions.md) - Mergulho profundo nos padroes de server functions
- [Variaveis de Ambiente](./environment-variables.md) - Tratamento seguro de variaveis de ambiente
- [Middleware](./middleware.md) - Padroes de middleware para server functions
