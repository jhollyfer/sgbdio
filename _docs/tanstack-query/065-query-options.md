---
id: queryOptions
title: queryOptions
---

```tsx
queryOptions({
  queryKey,
  ...options,
});
```

**Opções**

Você geralmente pode passar tudo para `queryOptions` que também pode passar para [`useQuery`](./useQuery.md). Algumas opções não terão efeito quando encaminhadas para uma função como `queryClient.prefetchQuery`, mas o TypeScript ainda aceitará essas propriedades extras.

- `queryKey: QueryKey`
  - **Obrigatório**
  - A query key para gerar as opções.
- `experimental_prefetchInRender?: boolean`
  - Opcional
  - O padrão é `false`
  - Quando definido como `true`, as queries serão pré-buscadas durante o render, o que pode ser útil para certos cenários de otimização
  - Precisa ser ativado para a funcionalidade experimental `useQuery().promise`

[//]: # "Materials"

## Leitura adicional

Para saber mais sobre `QueryOptions`, confira [este artigo do TkDodo The Query Options API](https://tkdodo.eu/blog/the-query-options-api).

[//]: # "Materials"
