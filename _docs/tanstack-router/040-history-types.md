---
title: History Types
---

Embora não seja necessário conhecer a API `@tanstack/history` em si para usar o TanStack Router, é uma boa ideia entender como ela funciona. Internamente, o TanStack Router requer e usa uma abstração de `history` para gerenciar o histórico de roteamento.

Se você não criar uma instância de history, uma instância orientada ao navegador dessa API é criada para você quando o router é inicializado. Se você precisar de um tipo especial de API de history, pode usar o pacote `@tanstack/history` para criar a sua própria:

- `createBrowserHistory`: O tipo de history padrão.
- `createHashHistory`: Um tipo de history que usa um hash para rastrear o histórico.
- `createMemoryHistory`: Um tipo de history que mantém o histórico na memória.

Uma vez que você tenha uma instância de history, pode passá-la para o construtor do `Router`:

```ts
import { createMemoryHistory, createRouter } from "@tanstack/react-router";

const memoryHistory = createMemoryHistory({
  initialEntries: ["/"], // Pass your initial url
});

const router = createRouter({ routeTree, history: memoryHistory });
```

## Roteamento pelo Navegador

O `createBrowserHistory` é o tipo de history padrão. Ele usa a API de histórico do navegador para gerenciar o histórico do navegador.

## Roteamento por Hash

O roteamento por hash pode ser útil se o seu servidor não suporta reescritas para index.html em requisições HTTP (entre outros ambientes que não possuem um servidor).

```ts
import { createHashHistory, createRouter } from "@tanstack/react-router";

const hashHistory = createHashHistory();

const router = createRouter({ routeTree, history: hashHistory });
```

## Roteamento em Memória

O roteamento em memória é útil em ambientes que não são um navegador ou quando você não quer que os components interajam com a URL.

```ts
import { createMemoryHistory, createRouter } from "@tanstack/react-router";

const memoryHistory = createMemoryHistory({
  initialEntries: ["/"], // Pass your initial url
});

const router = createRouter({ routeTree, history: memoryHistory });
```

Consulte o [Guia de SSR](./ssr.md#server-history) para uso no servidor para renderização do lado do servidor.
