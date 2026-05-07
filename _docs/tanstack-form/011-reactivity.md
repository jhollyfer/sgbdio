---
id: reactivity
title: Reactivity
---

O Tanstack Form não causa re-renders ao interagir com o form. Então, você pode se encontrar tentando usar um valor de state do form ou field sem sucesso.

Se você quiser acessar valores reativos, precisará se inscrever neles usando um dos dois métodos: `useStore` ou o component `form.Subscribe`.

Alguns usos para essas inscrições são renderizar valores de fields atualizados, determinar o que renderizar com base em uma condição, ou usar valores de fields dentro da lógica do seu component.

> Para situações onde você quer "reagir" a gatilhos, confira a API de [listener](./listeners.md).

## useStore

O hook `useStore` é perfeito quando você precisa acessar valores do form dentro da lógica do seu component. O `useStore` recebe dois parâmetros. Primeiro, o store do form. Segundo, um seletor para especificar a parte do form na qual você deseja se inscrever.

```tsx
const firstName = useStore(form.store, (state) => state.values.firstName);
const errors = useStore(form.store, (state) => state.errorMap);
```

Você pode acessar qualquer parte do state do form no seletor.

> Note que o `useStore` causará um re-render completo do component sempre que o valor inscrito mudar.

Embora SEJA possível omitir o seletor, resista à tentação, pois omiti-lo resultaria em muitos re-renders desnecessários sempre que qualquer parte do state do form mudar.

## form.Subscribe

O component `form.Subscribe` é mais adequado quando você precisa reagir a algo dentro da UI do seu component. Por exemplo, exibir ou ocultar elementos da UI com base no valor de um field do form.

```tsx
<form.Subscribe
  selector={(state) => state.values.firstName}
  children={(firstName) => (
    <form.Field>
      {(field) => (
        <input
          name="lastName"
          value={field.state.lastName}
          onChange={field.handleChange}
        />
      )}
    </form.Field>
  )}
/>
```

> O component `form.Subscribe` não dispara re-renders no nível do component. Sempre que o valor inscrito mudar, apenas o component `form.Subscribe` é re-renderizado.

A escolha entre usar `useStore` ou `form.Subscribe` se resume basicamente ao seu caso de uso. Se você busca atualizações diretas na UI com base no state do form, use `form.Subscribe` por suas vantagens de otimização. E se você precisa da reatividade dentro da lógica, então `useStore` é a melhor escolha.
