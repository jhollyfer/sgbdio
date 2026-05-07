---
id: ui-libraries
title: UI Libraries
---

## Uso do TanStack Form com Bibliotecas de UI

TanStack Form é uma biblioteca headless, oferecendo total flexibilidade para estilizar como você preferir. É compatível com uma ampla variedade de bibliotecas de UI, incluindo `Chakra UI`, `Tailwind`, `Material UI`, `Mantine`, `shadcn/ui`, ou até CSS puro.

Este guia foca em `Chakra UI`, `Material UI`, `Mantine` e `shadcn/ui`, mas os conceitos são aplicáveis a qualquer biblioteca de UI da sua escolha.

### Pré-requisitos

Antes de integrar o TanStack Form com uma biblioteca de UI, certifique-se de que as dependências necessárias estão instaladas no seu projeto:

- Para `Chakra UI`, siga as instruções de instalação no [site oficial](https://chakra-ui.com/docs/get-started/installation)
- Para `Material UI`, siga as instruções de instalação no [site oficial](https://mui.com/material-ui/getting-started/).
- Para `Mantine`, consulte a [documentação](https://mantine.dev/).
- Para `shadcn/ui`, consulte o [site oficial](https://ui.shadcn.com/).

Nota: Embora você possa misturar bibliotecas, geralmente é aconselhável manter apenas uma para garantir consistência e minimizar o tamanho do bundle.

### Exemplo com Mantine

Aqui está um exemplo demonstrando a integração do TanStack Form com components do Mantine:

```tsx
import { TextInput, Checkbox } from "@mantine/core";
import { useForm } from "@tanstack/react-form";

export default function App() {
  const { Field, handleSubmit, state } = useForm({
    defaultValues: {
      name: "",
      isChecked: false,
    },
    onSubmit: async ({ value }) => {
      // Handle form submission
      console.log(value);
    },
  });

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <Field
          name="name"
          children={({ state, handleChange, handleBlur }) => (
            <TextInput
              defaultValue={state.value}
              onChange={(e) => handleChange(e.target.value)}
              onBlur={handleBlur}
              placeholder="Enter your name"
            />
          )}
        />
        <Field
          name="isChecked"
          children={({ state, handleChange, handleBlur }) => (
            <Checkbox
              onChange={(e) => handleChange(e.target.checked)}
              onBlur={handleBlur}
              checked={state.value}
            />
          )}
        />
      </form>
      <div>
        <pre>{JSON.stringify(state.values, null, 2)}</pre>
      </div>
    </>
  );
}
```

- Inicialmente, utilizamos o hook `useForm` do TanStack e desestruturamos as propriedades necessárias. Esse passo é opcional; alternativamente, você poderia usar `const form = useForm()` se preferir. A inferência de tipos do TypeScript garante uma experiência suave independentemente da abordagem.
- O component `Field`, derivado do `useForm`, aceita várias propriedades, como `validators`. Para esta demonstração, focamos em duas propriedades principais: `name` e `children`.
  - A propriedade `name` identifica cada `Field`, por exemplo, `name` no nosso exemplo.
  - A propriedade `children` aproveita o conceito de render props, permitindo integrar components sem abstrações desnecessárias.
- O design do TanStack depende fortemente de render props, fornecendo acesso a `children` dentro do component `Field`. Essa abordagem é totalmente type-safe. Ao integrar com components do Mantine, como `TextInput`, desestruturamos seletivamente propriedades como `state.value`, `handleChange` e `handleBlur`. Essa abordagem seletiva se deve às pequenas diferenças de tipos entre `TextInput` e o `field` que obtemos no children.
- Seguindo esses passos, você pode integrar components do Mantine com o TanStack Form de forma transparente.
- Essa metodologia é igualmente aplicável a outros components, como `Checkbox`, garantindo integração consistente entre diferentes elementos de UI.

### Uso com Material UI

O processo para integrar components do Material UI é similar. Aqui está um exemplo usando TextField e Checkbox do Material UI:

```tsx
<Field
  name="name"
  children={({ state, handleChange, handleBlur }) => {
    return (
      <TextField
        id="filled-basic"
        label="Filled"
        variant="filled"
        defaultValue={state.value}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={handleBlur}
        placeholder="Enter your name"
      />
    );
  }}
/>

<Field
  name="isMuiCheckBox"
  children={({ state, handleChange, handleBlur }) => {
    return (
      <MuiCheckbox
        onChange={(e) => handleChange(e.target.checked)}
        onBlur={handleBlur}
        checked={state.value}
      />
    );
  }}
/>

```

- A abordagem de integração é a mesma do Mantine.
- A principal diferença está nas propriedades específicas e opções de estilização dos components do Material UI.

### Uso com shadcn/ui

O processo para integrar components do shadcn/ui é similar. Aqui está um exemplo usando Input e Checkbox do shadcn/ui:

```tsx
<Field
  name="name"
  children={({ state, handleChange, handleBlur }) => (
    <Input
      value={state.value}
      onChange={(e) => handleChange(e.target.value)}
      onBlur={handleBlur}
      placeholder="Enter your name"
    />
  )}
/>
<Field
  name="isChecked"
  children={({ state, handleChange, handleBlur }) => (
    <Checkbox
      onCheckedChange={(checked) => handleChange(checked === true)}
      onBlur={handleBlur}
      checked={state.value}
    />
  )}
/>
```

- A abordagem de integração é a mesma do Mantine e Material UI.
- A principal diferença está nas propriedades específicas e opções de estilização dos components do shadcn/ui.
- Observe a propriedade onCheckedChange do Checkbox em vez de onChange.

A biblioteca ShadCN inclui um guia dedicado cobrindo cenários comuns para integração do TanStack Form com seus components: [https://ui.shadcn.com/docs/forms/tanstack-form](https://ui.shadcn.com/docs/forms/tanstack-form)

### Uso com Chakra UI

O processo para integrar components do Chakra UI é similar. Aqui está um exemplo usando Input e Checkbox do Chakra UI:

```tsx
<Field
  name="name"
  children={({ state, handleChange, handleBlur }) => (
    <Input
      value={state.value}
      onChange={(e) => handleChange(e.target.value)}
      onBlur={handleBlur}
      placeholder="Enter your name"
    />
  )}
/>
<Field
  name="isChecked"
  children={({ state, handleChange, handleBlur }) => (
    <Checkbox.Root
      checked={state.value}
      onCheckedChange={(details) => handleChange(!!details.checked)}
      onBlur={handleBlur}
    >
      <Checkbox.HiddenInput />
      <Checkbox.Control />
      <Checkbox.Label>Accept terms</Checkbox.Label>
    </Checkbox.Root>
  )}
/>
```

- A abordagem de integração é a mesma do Mantine, Material UI e shadcn/ui.
- O Chakra UI expõe seu Checkbox como um component composável com partes separadas `Checkbox.Root`, `Checkbox.Control`, `Checkbox.Label` e `Checkbox.HiddenInput` que você conecta entre si.
- A dupla negação `!!` é usada em `onCheckedChange` para converter o state `"indeterminate"` do Chakra para um booleano, garantindo que corresponda ao state do form. Veja a [documentação do Checkbox do Chakra UI](https://chakra-ui.com/docs/components/checkbox#indeterminate) para mais detalhes.
- Alternativamente, o Chakra UI oferece um component Checkbox pré-composto que funciona da mesma forma que seus exemplos padrão, sem exigir composição manual. Você pode saber mais sobre essa abordagem de component fechado na [documentação do Checkbox do Chakra UI](https://chakra-ui.com/docs/components/checkbox#closed-component).
- A integração com o TanStack Form funciona de forma idêntica com qualquer abordagem — basta conectar os handlers `checked`, `onCheckedChange` e `onBlur` ao component escolhido.

Exemplo usando o component Checkbox fechado:

```tsx
<Field
  name="isChecked"
  children={({ state, handleChange, handleBlur }) => (
    <Checkbox
      checked={state.value}
      onCheckedChange={(details) => handleChange(!!details.checked)}
      onBlur={handleBlur}
    >
      Accept terms
    </Checkbox>
  )}
/>
```
