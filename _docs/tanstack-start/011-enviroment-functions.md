---
id: environment-functions
title: Environment Functions
---

## O que sao Funcoes de Ambiente?

Funcoes de ambiente sao utilitarios projetados para definir e controlar a execucao de funcoes com base no ambiente de execucao — se o codigo esta rodando no cliente ou no servidor. Esses utilitarios ajudam a garantir que a logica especifica do ambiente seja executada de forma segura e intencional, prevenindo erros em tempo de execucao e melhorando a manutencao em aplicacoes full-stack ou isomorficas.

O Start fornece tres funcoes de ambiente principais:

- `createIsomorphicFn`: Compoe uma unica funcao que se adapta tanto ao ambiente do cliente quanto do servidor.
- `createServerOnlyFn`: Cria uma funcao que so pode ser executada no servidor.
- `createClientOnlyFn`: Cria uma funcao que so pode ser executada no cliente.

---

## Funcoes Isomorficas

Use `createIsomorphicFn()` para definir funcoes que se comportam de maneira diferente dependendo se sao chamadas no cliente ou no servidor. Isso e util para compartilhar logica entre ambientes de forma segura, delegando o comportamento especifico de cada ambiente para os handlers apropriados.

### Implementacao Completa

```tsx
import { createIsomorphicFn } from "@tanstack/react-start";

const getEnv = createIsomorphicFn()
  .server(() => "server")
  .client(() => "client");

const env = getEnv();
// ℹ️ On the **server**, it returns `'server'`.
// ℹ️ On the **client**, it returns `'client'`.
```

### Implementacao Parcial (Servidor)

Aqui esta um exemplo de `createIsomorphicFn()` com apenas a implementacao do servidor:

```tsx
import { createIsomorphicFn } from "@tanstack/react-start";

const serverImplementationOnly = createIsomorphicFn().server(() => "server");

const server = serverImplementationOnly();
// ℹ️ On the **server**, it returns `'server'`.
// ℹ️ On the **client**, it is no-op (returns `undefined`)
```

### Implementacao Parcial (Cliente)

Aqui esta um exemplo de `createIsomorphicFn()` com apenas a implementacao do cliente:

```tsx
import { createIsomorphicFn } from "@tanstack/react-start";

const clientImplementationOnly = createIsomorphicFn().client(() => "client");

const client = clientImplementationOnly();
// ℹ️ On the **server**, it is no-op (returns `undefined`)
// ℹ️ On the **client**, it returns `'client'`.
```

### Sem Implementacao

Aqui esta um exemplo de `createIsomorphicFn()` sem nenhuma implementacao especifica de ambiente:

```tsx
import { createIsomorphicFn } from "@tanstack/react-start";

const noImplementation = createIsomorphicFn();

const noop = noImplementation();
// ℹ️ On both **client** and **server**, it is no-op (returns `undefined`)
```

#### O que e um no-op?

Um no-op (abreviacao de "no operation") e uma funcao que nao faz nada quando executada - ela simplesmente retorna `undefined` sem realizar nenhuma operacao.

```tsx
// basic no-op implementation
function noop() {}
```

---

## Funcoes `env`Only

Os helpers `createServerOnlyFn` e `createClientOnlyFn` garantem execucao estritamente vinculada ao ambiente. Eles asseguram que a funcao retornada so possa ser chamada no contexto de execucao correto. Se usados incorretamente, lancam erros descritivos em tempo de execucao para prevenir a execucao nao intencional de logica.

### `createServerOnlyFn`

```tsx
import { createServerOnlyFn } from "@tanstack/react-start";

const foo = createServerOnlyFn(() => "bar");

foo(); // ✅ On server: returns "bar"
// ❌ On client: throws "createServerOnlyFn() functions can only be called on the server!"
```

### `createClientOnlyFn`

```tsx
import { createClientOnlyFn } from "@tanstack/react-start";

const foo = createClientOnlyFn(() => "bar");

foo(); // ✅ On client: returns "bar"
// ❌ On server: throws "createClientOnlyFn() functions can only be called on the client!"
```

> [!NOTE]
> Essas funcoes sao uteis para acesso a API, leitura do sistema de arquivos, uso de APIs do navegador ou outras operacoes que sao invalidas ou inseguras fora do ambiente pretendido.

## Tree Shaking

As funcoes de ambiente passam por tree-shaking com base no ambiente para cada bundle produzido.

Funcoes criadas usando `createIsomorphicFn()` passam por tree-shaking. Todo o codigo dentro de `.client()` nao e incluido no bundle do servidor, e vice-versa.

No servidor, funcoes criadas usando `createClientOnlyFn()` sao substituidas por uma funcao que lanca um `Error` no servidor. O inverso e verdadeiro para funcoes `createServerOnlyFn` no cliente.
