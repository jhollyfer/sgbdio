---
title: Render Optimizations
---

O TanStack Router inclui várias otimizações para garantir que seus components só façam re-render quando necessário. Essas otimizações incluem:

## structural sharing

O TanStack Router usa uma técnica chamada "structural sharing" para preservar o máximo de referências possível entre re-renders, o que é particularmente útil para state armazenado na URL, como search params.

Por exemplo, considere uma route `details` com dois search params, `foo` e `bar`, acessados assim:

```tsx
const search = Route.useSearch();
```

Quando apenas `bar` é alterado ao navegar de `/details?foo=f1&bar=b1` para `/details?foo=f1&bar=b2`, `search.foo` será referencialmente estável e apenas `search.bar` será substituído.

## Seletores refinados

Você pode acessar e se inscrever no state do router usando vários hooks como `useRouterState`, `useSearch` e outros. Se você quiser que um component específico faça re-render apenas quando um subconjunto particular do state do router, como um subconjunto dos search params, mudar, pode usar assinaturas parciais com a propriedade `select`.

```tsx
// component won't re-render when `bar` changes
const foo = Route.useSearch({ select: ({ foo }) => foo });
```

### structural sharing com seletores refinados

A função `select` pode realizar vários cálculos no state do router, permitindo que você retorne diferentes tipos de valores, como objetos. Por exemplo:

```tsx
const result = Route.useSearch({
  select: (search) => {
    return {
      foo: search.foo,
      hello: `hello ${search.foo}`,
    };
  },
});
```

Embora isso funcione, fará com que seu component faça re-render toda vez, pois `select` agora está retornando um novo objeto cada vez que é chamado.

Você pode evitar esse problema de re-render usando "structural sharing" como descrito acima. Por padrão, o structural sharing está desativado para manter a compatibilidade retroativa, mas isso pode mudar na v2.

Para habilitar o structural sharing para seletores refinados, você tem duas opções:

#### Habilitar por padrão nas opções do router:

```tsx
const router = createRouter({
  routeTree,
  defaultStructuralSharing: true,
});
```

#### Habilitar por uso de hook conforme mostrado aqui:

```tsx
const result = Route.useSearch({
  select: (search) => {
    return {
      foo: search.foo,
      hello: `hello ${search.foo}`,
    };
  },
  structuralSharing: true,
});
```

> [!IMPORTANT]
> O structural sharing funciona apenas com dados compatíveis com JSON. Isso significa que você não pode usar `select` para retornar itens como instâncias de classe se o structural sharing estiver habilitado.

Em linha com o design type-safe do TanStack Router, o TypeScript levantará um erro se você tentar o seguinte:

```tsx
const result = Route.useSearch({
  select: (search) => {
    return {
      date: new Date(),
    };
  },
  structuralSharing: true,
});
```

Se o structural sharing estiver habilitado por padrão nas opções do router, você pode evitar esse erro definindo `structuralSharing: false`.
