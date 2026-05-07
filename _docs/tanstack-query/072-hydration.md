---
id: hydration
title: hydration
---

## `dehydrate`

`dehydrate` cria uma representação congelada de um `cache` que pode ser posteriormente hidratada com `HydrationBoundary` ou `hydrate`. Isso é útil para passar queries pré-buscadas do servidor para o cliente ou persistir queries no localStorage ou outros locais persistentes. Por padrão, apenas queries bem-sucedidas são incluídas.

```tsx
import { dehydrate } from "@tanstack/react-query";

const dehydratedState = dehydrate(queryClient, {
  shouldDehydrateQuery,
  shouldDehydrateMutation,
});
```

**Opções**

- `client: QueryClient`
  - **Obrigatório**
  - O `queryClient` que deve ser desidratado
- `options: DehydrateOptions`
  - Opcional
  - `shouldDehydrateMutation: (mutation: Mutation) => boolean`
    - Opcional
    - Se deve desidratar mutations.
    - A função é chamada para cada mutation no cache
      - Retorne `true` para incluir essa mutation na dehydration, ou `false` caso contrário
    - O padrão é incluir apenas mutations pausadas
    - Se você quiser estender a função mantendo o comportamento padrão, importe e execute `defaultShouldDehydrateMutation` como parte da instrução de retorno
  - `shouldDehydrateQuery: (query: Query) => boolean`
    - Opcional
    - Se deve desidratar queries.
    - A função é chamada para cada query no cache
      - Retorne `true` para incluir essa query na dehydration, ou `false` caso contrário
    - O padrão é incluir apenas queries bem-sucedidas
    - Se você quiser estender a função mantendo o comportamento padrão, importe e execute `defaultShouldDehydrateQuery` como parte da instrução de retorno
  - `serializeData?: (data: any) => any` Uma função para transformar (serializar) dados durante a dehydration.
  - `shouldRedactErrors?: (error: unknown) => boolean`
    - Opcional
    - Se deve ocultar erros do servidor durante a dehydration.
    - A função é chamada para cada erro no cache
      - Retorne `true` para ocultar esse erro, ou `false` caso contrário
    - O padrão é ocultar todos os erros

**Retornos**

- `dehydratedState: DehydratedState`
  - Isso inclui tudo que é necessário para hidratar o `queryClient` posteriormente
  - Você **não deve** depender do formato exato dessa resposta, ele não faz parte da API pública e pode mudar a qualquer momento
  - Esse resultado não está em formato serializado, você precisa fazer isso por conta própria se desejar

### Limitações

Alguns sistemas de armazenamento (como a [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API) do navegador) exigem que os valores sejam serializáveis em JSON. Se você precisar desidratar valores que não são automaticamente serializáveis para JSON (como `Error` ou `undefined`), você precisa serializá-los por conta própria. Como apenas queries bem-sucedidas são incluídas por padrão, para incluir também `Errors`, você precisa fornecer `shouldDehydrateQuery`, por exemplo:

```tsx
// server
const state = dehydrate(client, { shouldDehydrateQuery: () => true }); // to also include Errors
const serializedState = mySerialize(state); // transform Error instances to objects

// client
const state = myDeserialize(serializedState); // transform objects back to Error instances
hydrate(client, state);
```

## `hydrate`

`hydrate` adiciona um state previamente desidratado em um `cache`.

```tsx
import { hydrate } from "@tanstack/react-query";

hydrate(queryClient, dehydratedState, options);
```

**Opções**

- `client: QueryClient`
  - **Obrigatório**
  - O `queryClient` para hidratar o state
- `dehydratedState: DehydratedState`
  - **Obrigatório**
  - O state para hidratar no cliente
- `options: HydrateOptions`
  - Opcional
  - `defaultOptions: DefaultOptions`
    - Opcional
    - `mutations: MutationOptions` As opções padrão de mutation a serem usadas para as mutations hidratadas.
    - `queries: QueryOptions` As opções padrão de query a serem usadas para as queries hidratadas.
    - `deserializeData?: (data: any) => any` Uma função para transformar (desserializar) dados antes de serem colocados no cache.
  - `queryClient?: QueryClient`
    - Use isso para utilizar um QueryClient personalizado. Caso contrário, será usado o do context mais próximo.

### Limitações

Se as queries que você está tentando hidratar já existem no queryCache, `hydrate` só as sobrescreverá se os dados forem mais recentes do que os dados presentes no cache. Caso contrário, eles **não** serão aplicados.

[//]: # "HydrationBoundary"

## `HydrationBoundary`

`HydrationBoundary` adiciona um state previamente desidratado no `queryClient` que seria retornado por `useQueryClient()`. Se o cliente já contiver dados, as novas queries serão mescladas de forma inteligente com base no timestamp de atualização.

```tsx
import { HydrationBoundary } from "@tanstack/react-query";

function App() {
  return <HydrationBoundary state={dehydratedState}>...</HydrationBoundary>;
}
```

> Nota: Apenas `queries` podem ser desidratadas com um `HydrationBoundary`.

**Opções**

- `state: DehydratedState`
  - O state para hidratar
- `options: HydrateOptions`
  - Opcional
  - `defaultOptions: QueryOptions`
    - As opções padrão de query a serem usadas para as queries hidratadas.
  - `queryClient?: QueryClient`
    - Use isso para utilizar um QueryClient personalizado. Caso contrário, será usado o do context mais próximo.

[//]: # "HydrationBoundary"
