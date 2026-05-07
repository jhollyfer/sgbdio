---
id: basic-concepts
title: Basic Concepts and Terminology
---

Esta página apresenta os conceitos básicos e a terminologia usada na biblioteca `@tanstack/react-form`. Familiarizar-se com esses conceitos vai ajudar você a entender e trabalhar melhor com a biblioteca.

## Opções do Form

Você pode personalizar seu form criando opções de configuração com a função `formOptions`. Essas opções podem ser compartilhadas entre múltiplos forms.

Exemplo:

```tsx
interface User {
  firstName: string;
  lastName: string;
  hobbies: Array<string>;
}
const defaultUser: User = { firstName: "", lastName: "", hobbies: [] };

const formOpts = formOptions({
  defaultValues: defaultUser,
});
```

## Instância do Form

Uma instância de Form é um objeto que representa um form individual e fornece métodos e propriedades para trabalhar com o form. Você cria uma instância de Form usando o hook `useForm` fornecido pelas opções do form. O hook aceita um objeto com uma função `onSubmit`, que é chamada quando o form é submetido.

```tsx
const form = useForm({
  ...formOpts,
  onSubmit: async ({ value }) => {
    // Do something with form data
    console.log(value);
  },
});
```

Você também pode criar uma instância de Form sem usar `formOptions` utilizando a API standalone `useForm`:

```tsx
interface User {
  firstName: string;
  lastName: string;
  hobbies: Array<string>;
}
const defaultUser: User = { firstName: "", lastName: "", hobbies: [] };

const form = useForm({
  defaultValues: defaultUser,
  onSubmit: async ({ value }) => {
    // Do something with form data
    console.log(value);
  },
});
```

## Field

Um Field representa um único elemento de entrada do form, como um input de texto ou um checkbox. Fields são criados usando o component `form.Field` fornecido pela instância do Form. O component aceita uma prop `name`, que deve corresponder a uma chave nos valores padrão do form. Ele também aceita uma prop `children`, que é uma função render prop que recebe um objeto `field` como argumento.

Exemplo:

```tsx
<form.Field
  name="firstName"
  children={(field) => (
    <>
      <input
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
      />
      <FieldInfo field={field} />
    </>
  )}
/>
```

Se você encontrar problemas ao usar `children` como props, certifique-se de verificar suas regras de linting.

Exemplo (ESLint):

```json
  "rules": {
    "react/no-children-prop": [
      true,
      {
        "allowFunctions": true
      }
    ],
  }
```

## State do Field

Cada field tem seu próprio state, que inclui seu valor atual, status de validação, mensagens de erro e outros metadados. Você pode acessar o state de um field usando a propriedade `field.state`.

Exemplo:

```ts
const {
  value,
  meta: { errors, isValidating },
} = field.state;
```

Existem quatro states nos metadados que podem ser úteis para ver como o usuário interage com um field:

- **isTouched**: é `true` quando o usuário altera ou tira o foco do field
- **isDirty**: é `true` quando o valor do field é alterado, mesmo que seja revertido ao padrão. Oposto de `isPristine`
- **isPristine**: é `true` até que o usuário altere o valor do field. Oposto de `isDirty`
- **isBlurred**: é `true` quando o field perde o foco (blur)
- **isDefaultValue**: é `true` quando o valor atual do field é o valor padrão

```ts
const { isTouched, isDirty, isPristine, isBlurred } = field.state.meta;
```

![Field states](https://raw.githubusercontent.com/TanStack/form/main/docs/assets/field-states.png)

## Entendendo 'isDirty' em Diferentes Bibliotecas

State `dirty` não persistente

- **Bibliotecas**: React Hook Form (RHF), Formik, Final Form.
- **Comportamento**: Um field é 'dirty' se seu valor difere do padrão. Reverter ao valor padrão o torna 'limpo' novamente.

State `dirty` persistente

- **Bibliotecas**: Angular Form, Vue FormKit.
- **Comportamento**: Um field permanece 'dirty' uma vez alterado, mesmo que seja revertido ao valor padrão.

Nós escolhemos o modelo de state 'dirty' persistente. No entanto, introduzimos a flag `isDefaultValue` para também suportar um state 'dirty' não persistente.

```ts
const { isDefaultValue, isTouched } = field.state.meta;

// The following line will re-create the non-persistent `dirty` functionality.
const nonPersistentIsDirty = !isDefaultValue;
```

![Field states extended](https://raw.githubusercontent.com/TanStack/form/main/docs/assets/field-states-extended.png)

## API do Field

A API do Field é um objeto passado para a função render prop ao criar um field. Ela fornece métodos para trabalhar com o state do field.

Exemplo:

```tsx
<input
  value={field.state.value}
  onBlur={field.handleBlur}
  onChange={(e) => field.handleChange(e.target.value)}
/>
```

## Validação

`@tanstack/react-form` oferece validação tanto síncrona quanto assíncrona pronta para uso. Funções de validação podem ser passadas ao component `form.Field` usando a prop `validators`.

Exemplo:

```tsx
<form.Field
  name="firstName"
  validators={{
    onChange: ({ value }) =>
      !value
        ? "A first name is required"
        : value.length < 3
          ? "First name must be at least 3 characters"
          : undefined,
    onChangeAsync: async ({ value }) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return value.includes("error") && 'No "error" allowed in first name';
    },
  }}
  children={(field) => (
    <>
      <input
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
      />
      <FieldInfo field={field} />
    </>
  )}
/>
```

## Validação com Bibliotecas de Schema Padrão

Além das opções de validação escritas manualmente, também suportamos a especificação [Standard Schema](https://github.com/standard-schema/standard-schema).

Você pode definir um schema usando qualquer uma das bibliotecas que implementam a especificação e passá-lo a um validator de form ou field.

Bibliotecas suportadas incluem:

- [Zod](https://zod.dev/) (v3.24.0 ou superior)
- [Valibot](https://valibot.dev/) (v1.0.0 ou superior)
- [ArkType](https://arktype.io/) (v2.1.20 ou superior)
- [Yup](https://github.com/jquense/yup) (v1.7.0 ou superior)

```tsx
import { z } from "zod";

const userSchema = z.object({
  age: z.number().gte(13, "You must be 13 to make an account"),
});

function App() {
  const form = useForm({
    defaultValues: {
      age: 0,
    },
    validators: {
      onChange: userSchema,
    },
  });
  return (
    <div>
      <form.Field
        name="age"
        children={(field) => {
          return <>{/* ... */}</>;
        }}
      />
    </div>
  );
}
```

## Reatividade

`@tanstack/react-form` oferece diversas maneiras de se inscrever em mudanças de state do form e do field, mais notavelmente o hook `useStore(form.store)` e o component `form.Subscribe`. Esses métodos permitem otimizar o desempenho de render do seu form atualizando components apenas quando necessário.

Exemplo:

```tsx
const firstName = useStore(form.store, (state) => state.values.firstName)
//...
<form.Subscribe
  selector={(state) => [state.canSubmit, state.isSubmitting]}
  children={([canSubmit, isSubmitting]) => (
    <button type="submit" disabled={!canSubmit}>
      {isSubmitting ? '...' : 'Submit'}
    </button>
  )}
/>
```

É importante lembrar que, embora a prop `selector` do hook `useStore` seja opcional, é fortemente recomendado fornecer uma, pois omiti-la resultará em re-renders desnecessários.

```tsx
// Correct use
const firstName = useStore(form.store, (state) => state.values.firstName);
const errors = useStore(form.store, (state) => state.errorMap);
// Incorrect use
const store = useStore(form.store);
```

Nota: O uso do hook `useField` para obter reatividade é desencorajado, pois ele foi projetado para ser usado de forma consciente dentro do component `form.Field`. Em vez disso, você pode querer usar `useStore(form.store)`.

## Listeners

`@tanstack/react-form` permite que você reaja a gatilhos específicos e "escute" eles para disparar efeitos colaterais.

Exemplo:

```tsx
<form.Field
  name="country"
  listeners={{
    onChange: ({ value }) => {
      console.log(`Country changed to: ${value}, resetting province`);
      form.setFieldValue("province", "");
    },
  }}
/>
```

Mais informações podem ser encontradas em [Listeners](./listeners.md)

## Array Fields

Array fields permitem que você gerencie uma lista de valores dentro de um form, como uma lista de hobbies. Você pode criar um array field usando o component `form.Field` com a prop `mode="array"`.

Ao trabalhar com array fields, você pode usar os métodos `pushValue`, `removeValue`, `swapValues` e `moveValue` para adicionar, remover, trocar e mover um valor de um índice para outro dentro do array, respectivamente. Métodos auxiliares adicionais como `insertValue`, `replaceValue` e `clearValues` também estão disponíveis para inserir, substituir e limpar valores do array.

Exemplo:

```tsx
<form.Field
  name="hobbies"
  mode="array"
  children={(hobbiesField) => (
    <div>
      Hobbies
      <div>
        {!hobbiesField.state.value.length
          ? "No hobbies found."
          : hobbiesField.state.value.map((_, i) => (
              <div key={i}>
                <form.Field
                  name={`hobbies[${i}].name`}
                  children={(field) => {
                    return (
                      <div>
                        <label htmlFor={field.name}>Name:</label>
                        <input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => hobbiesField.removeValue(i)}
                        >
                          X
                        </button>
                        <FieldInfo field={field} />
                      </div>
                    );
                  }}
                />
                <form.Field
                  name={`hobbies[${i}].description`}
                  children={(field) => {
                    return (
                      <div>
                        <label htmlFor={field.name}>Description:</label>
                        <input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                        <FieldInfo field={field} />
                      </div>
                    );
                  }}
                />
              </div>
            ))}
      </div>
      <button
        type="button"
        onClick={() =>
          hobbiesField.pushValue({
            name: "",
            description: "",
            yearsOfExperience: 0,
          })
        }
      >
        Add hobby
      </button>
    </div>
  )}
/>
```

## Botões de Reset

Ao usar `<button type="reset">` com o `form.reset()` do TanStack Form, você precisa prevenir o comportamento padrão de reset do HTML para evitar resets inesperados dos elementos do form (especialmente elementos `<select>`) para seus valores HTML iniciais.
Use `event.preventDefault()` dentro do handler `onClick` do botão para prevenir o reset nativo do form.

Exemplo:

```tsx
<button
  type="reset"
  onClick={(event) => {
    event.preventDefault();
    form.reset();
  }}
>
  Reset
</button>
```

Alternativamente, você pode usar `<button type="button">` para prevenir o reset HTML nativo.

```tsx
<button
  type="button"
  onClick={() => {
    form.reset();
  }}
>
  Reset
</button>
```

Esses são os conceitos básicos e a terminologia usada na biblioteca `@tanstack/react-form`. Entender esses conceitos vai ajudar você a trabalhar de forma mais eficiente com a biblioteca e criar forms complexos com facilidade.
