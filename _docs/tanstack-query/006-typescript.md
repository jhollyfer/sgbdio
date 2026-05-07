---
id: typescript
title: TypeScript
---

O React Query agora é escrito em **TypeScript** para garantir que a biblioteca e seus projetos sejam type-safe!

Coisas para ter em mente:

- Os tipos atualmente requerem o uso do TypeScript **v4.7** ou superior
- Mudanças nos tipos neste repositório são consideradas **não-breaking** e geralmente são lançadas como mudanças de versão semver **patch** (caso contrário, cada melhoria de tipo seria uma versão major!).
- É **altamente recomendado que você trave a versão do pacote react-query em uma release patch específica e atualize com a expectativa de que os tipos podem ser corrigidos ou atualizados entre qualquer release**
- A API pública não relacionada a tipos do React Query ainda segue o semver de forma bem rigorosa.

## Inferência de Tipos

Os tipos no React Query geralmente fluem muito bem, de modo que você não precisa fornecer anotações de tipo por conta própria

[//]: # "TypeInference1"

```tsx
const { data } = useQuery({
  //    ^? const data: number | undefined
  queryKey: ["test"],
  queryFn: () => Promise.resolve(5),
});
```

[typescript playground](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAbzgVwM4FMCKz1QJ5wC+cAZlBCHAORToCGAxjALQCOO+VAsAFC8MQAdqnhIAJnRh0icALwoM2XHgAUAbSqDkIAEa4qAXQA0cFQEo5APjgAFciGAYAdLVQQANgDd0KgKxmzXgB6ILgw8IA9AH5eIA)

[//]: # "TypeInference1"
[//]: # "TypeInference2"

```tsx
const { data } = useQuery({
  //      ^? const data: string | undefined
  queryKey: ["test"],
  queryFn: () => Promise.resolve(5),
  select: (data) => data.toString(),
});
```

[typescript playground](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAbzgVwM4FMCKz1QJ5wC+cAZlBCHAORToCGAxjALQCOO+VAsAFC8MQAdqnhIAJnRh0icALwoM2XHgAUAbSox0IqgF0ANHBUBKOQD44ABXIhgGAHS1UEADYA3dCoCsxw0gwu6EwAXHASUuZhknT2MBAAyjBQwIIA5iaExrwA9Nlw+QUAegD8vEA)

[//]: # "TypeInference2"

Isso funciona melhor se sua `queryFn` tiver um tipo de retorno bem definido. Tenha em mente que a maioria das bibliotecas de fetching de dados retorna `any` por padrão, então certifique-se de extraí-la para uma função com tipagem adequada:

[//]: # "TypeInference3"

```tsx
const fetchGroups = (): Promise<Group[]> =>
  axios.get("/groups").then((response) => response.data);

const { data } = useQuery({ queryKey: ["groups"], queryFn: fetchGroups });
//      ^? const data: Group[] | undefined
```

[typescript playground](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAbzgVwM4FMCKz1QJ5wC+cAZlBCHAORToCGAxjALQCOO+VAsAFCiSw4dAB7AIqUuUpURY1Nx68YeMOjgBxcsjBwAvIjjAAJgC44AO2QgARriK9eDCOdTwS6GAwAWmiNon6ABQAlGYAClLAGAA8vtoA2gC6AHx6qbLiAHQA5h6BVAD02Vpg8sGZMF7o5oG0qJAuarqpdQ0YmUZ0MHTBDjxOLvBInd1EeigY2Lh4gfFUxX6lVIkANKQe3nGlvTwFBXAHhwB6APxwA65wI3RmW0lwAD4o5kboJMDm6Ea8QA)

[//]: # "TypeInference3"

## Narrowing de Tipos

O React Query usa um [tipo de union discriminada](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-func.html#discriminated-unions) para o resultado da query, discriminado pelo campo `status` e pelas flags booleanas de status derivadas. Isso vai permitir que você verifique, por exemplo, o status `success` para tornar `data` definido:

[//]: # "TypeNarrowing"

```tsx
const { data, isSuccess } = useQuery({
  queryKey: ["test"],
  queryFn: () => Promise.resolve(5),
});

if (isSuccess) {
  data;
  //  ^? const data: number
}
```

[typescript playground](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAbzgVwM4FMCKz1QJ5wC+cAZlBCHAORToCGAxjALQCOO+VAsAFC8MQAdqnhIAJnRh0ANHGCoAysgYN0qVETgBeFBmy48ACgDaVGGphUAurMMBKbQD44ABXIh56AHS1UEADYAbuiGAKx2dry8wCRwhvJKKmqoDgi8cBlwElK8APS5GQB6APy8hLxAA)

[//]: # "TypeNarrowing"

## Tipando o campo error

O tipo do error é `Error` por padrão, porque é o que a maioria dos usuários espera.

[//]: # "TypingError"

```tsx
const { error } = useQuery({ queryKey: ["groups"], queryFn: fetchGroups });
//      ^? const error: Error
```

[typescript playground](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAbzgVwM4FMCKz1QJ5wC+cAZlBCHAOQACMAhgHaoMDGA1gPRTr2swBaAI458VALAAoUJFhx6AD2ARUpcpSqLlqCZKkw8YdHADi5ZGDgBeRHGAATAFxxGyEACNcRKVNYRm8CToMKwAFmYQFqo2ABQAlM4ACurAGAA8ERYA2gC6AHzWBVoqAHQA5sExVJxl5mA6cSUwoeiMMTyokMzGVgUdXRgl9vQMcT6SfgG2uORQRNYoGNi4eDFZVLWR9VQ5ADSkwWGZ9WOSnJxwl1cAegD8QA)

[//]: # "TypingError"

Se você quiser lançar um erro customizado, ou algo que não seja um `Error`, você pode especificar o tipo do campo error:

[//]: # "TypingError2"

```tsx
const { error } = useQuery<Group[], string>(["groups"], fetchGroups);
//      ^? const error: string | null
```

[//]: # "TypingError2"

No entanto, isso tem a desvantagem de que a inferência de tipos para todos os outros generics do `useQuery` não funcionará mais. Geralmente não é considerado uma boa prática lançar algo que não seja um `Error`, então se você tem uma subclasse como `AxiosError` você pode usar _narrowing de tipos_ para tornar o campo error mais específico:

[//]: # "TypingError3"

```tsx
import axios from "axios";

const { error } = useQuery({ queryKey: ["groups"], queryFn: fetchGroups });
//      ^? const error: Error | null

if (axios.isAxiosError(error)) {
  error;
  // ^? const error: AxiosError
}
```

[typescript playground](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAbzgVwM4FMCKz1QJ5wC+cAZlBCHAOQACMAhgHaoMDGA1gPRTr2swBaAI458VALAAoUJFhx6AD2ARUpcpSqLlqCZKkw8YdHADi5ZGDgBeRHGAATAFxxGyEACNcRKVNYRm8CToMKwAFmYQFqo2ABQAlM4ACurAGAA8ERYA2gC6AHzWBVoqAHQA5sExVJxl5mA6cSUwoeiMMTyokMzGVgUdXRgl9vQMcT6SfgG2uORQRNYoGNi4eDFIIisA0uh4zllUtZH1VDkANHAb+ABijM5BIeF1qoRjkpyccJ9fAHoA-OPAEhwGLFVAlVIAQSUKgAolBZjEZtA4nFEFJPkioOi4O84H8pIQgA)

[//]: # "TypingError3"

### Registrando um Error global

O TanStack Query v5 permite definir um tipo de Error global para tudo, sem precisar especificar generics nos locais de chamada, alterando a interface `Register`. Isso vai garantir que a inferência ainda funcione, mas o campo error será do tipo especificado. Se você quiser forçar que os locais de chamada façam narrowing de tipo explícito, defina `defaultError` como `unknown`:

[//]: # "RegisterErrorType"

```tsx
import "@tanstack/react-query";

declare module "@tanstack/react-query" {
  interface Register {
    // Use unknown so call sites must narrow explicitly.
    defaultError: unknown;
  }
}

const { error } = useQuery({ queryKey: ["groups"], queryFn: fetchGroups });
//      ^? const error: unknown | null
```

[//]: # "RegisterErrorType"
[//]: # "TypingMeta"

## Tipando meta

### Registrando Meta global

De forma similar ao registro de um [tipo de error global](#registrando-um-error-global), você também pode registrar um tipo `Meta` global. Isso garante que o campo opcional `meta` em [queries](./reference/useQuery.md) e [mutations](./reference/useMutation.md) permaneça consistente e seja type-safe. Note que o tipo registrado deve estender `Record<string, unknown>` para que `meta` continue sendo um objeto.

```ts
import "@tanstack/react-query";

interface MyMeta extends Record<string, unknown> {
  // Your meta type definition.
}

declare module "@tanstack/react-query" {
  interface Register {
    queryMeta: MyMeta;
    mutationMeta: MyMeta;
  }
}
```

[//]: # "TypingMeta"
[//]: # "TypingQueryAndMutationKeys"

## Tipando query keys e mutation keys

### Registrando os tipos de query key e mutation key

De forma similar ao registro de um [tipo de error global](#registrando-um-error-global), você também pode registrar tipos globais de `QueryKey` e `MutationKey`. Isso permite que você forneça mais estrutura às suas keys, de forma que corresponda à hierarquia da sua aplicação, e que elas sejam tipadas em toda a superfície da biblioteca. Note que o tipo registrado deve estender o tipo `Array`, para que suas keys continuem sendo um array.

```ts
import "@tanstack/react-query";

type QueryKey = ["dashboard" | "marketing", ...ReadonlyArray<unknown>];

declare module "@tanstack/react-query" {
  interface Register {
    queryKey: QueryKey;
    mutationKey: QueryKey;
  }
}
```

[//]: # "TypingQueryAndMutationKeys"
[//]: # "TypingQueryOptions"

## Tipando Query Options

Se você colocar as opções da query inline no `useQuery`, você terá inferência de tipos automática. No entanto, você pode querer extrair as opções da query em uma função separada para compartilhá-las entre `useQuery` e, por exemplo, `prefetchQuery`. Nesse caso, você perderia a inferência de tipos. Para recuperá-la, você pode usar o helper `queryOptions`:

```ts
import { queryOptions } from "@tanstack/react-query";

function groupOptions() {
  return queryOptions({
    queryKey: ["groups"],
    queryFn: fetchGroups,
    staleTime: 5 * 1000,
  });
}

useQuery(groupOptions());
queryClient.prefetchQuery(groupOptions());
```

Além disso, a `queryKey` retornada por `queryOptions` conhece a `queryFn` associada a ela, e podemos aproveitar essa informação de tipo para fazer com que funções como `queryClient.getQueryData` também reconheçam esses tipos:

```ts
function groupOptions() {
  return queryOptions({
    queryKey: ["groups"],
    queryFn: fetchGroups,
    staleTime: 5 * 1000,
  });
}

const data = queryClient.getQueryData(groupOptions().queryKey);
//     ^? const data: Group[] | undefined
```

Sem `queryOptions`, o tipo de `data` seria `unknown`, a menos que passássemos um generic para ele:

```ts
const data = queryClient.getQueryData<Group[]>(["groups"]);
```

Note que a inferência de tipos via `queryOptions` _não_ funciona para `queryClient.getQueriesData`, porque ele retorna um array de tuplas com dados heterogêneos e `unknown`. Se você tem certeza do tipo de dados que sua query vai retornar, especifique-o explicitamente:

```ts
const entries = queryClient.getQueriesData<Group[]>(groupOptions().queryKey);
//     ^? const entries: Array<[QueryKey, Group[] | undefined]>
```

## Tipando Mutation Options

De forma similar ao `queryOptions`, você pode usar `mutationOptions` para extrair opções de mutation em uma função separada:

```ts
function groupMutationOptions() {
  return mutationOptions({
    mutationKey: ["addGroup"],
    mutationFn: addGroup,
  });
}

useMutation({
  ...groupMutationOptions(),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ["groups"] }),
});
useIsMutating(groupMutationOptions());
queryClient.isMutating(groupMutationOptions());
```

[//]: # "TypingQueryOptions"

## Desabilitando queries de forma typesafe usando `skipToken`

Se você está usando TypeScript, pode usar o `skipToken` para desabilitar uma query. Isso é útil quando você quer desabilitar uma query baseado em uma condição, mas ainda quer manter a query type-safe.
Leia mais sobre isso no guia [Desabilitando Queries](./guides/disabling-queries.md).

[//]: # "Materials"

## Leitura Complementar

Para dicas e truques sobre inferência de tipos, veja o artigo [React Query and TypeScript](https://tkdodo.eu/blog/react-query-and-type-script). Para descobrir como obter a melhor segurança de tipos possível, você pode ler [Type-safe React Query](https://tkdodo.eu/blog/type-safe-react-query). [The Query Options API](https://tkdodo.eu/blog/the-query-options-api) descreve como a inferência de tipos funciona com a função helper `queryOptions`.

[//]: # "Materials"
