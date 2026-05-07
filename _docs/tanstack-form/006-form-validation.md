---
id: form-validation
title: Form and Field Validation
---

No núcleo da funcionalidade do TanStack Form está o conceito de validação. O TanStack Form torna a validação altamente personalizável:

- Você pode controlar quando a validação é realizada (onChange, on input, onBlur, onSubmit, etc.)
- As regras de validação podem ser definidas no nível do field ou no nível do form
- A validação pode ser síncrona ou assíncrona (por exemplo, como resultado de uma chamada à API)

## Quando a validação é realizada?

Depende de você! O component `<Field />` aceita alguns callbacks como props, como `onChange` ou `onBlur`. Esses callbacks recebem o valor atual do field, assim como o objeto `fieldApi`, para que você possa realizar a validação. Se encontrar um erro de validação, simplesmente retorne a mensagem de erro como uma string, e ela estará disponível em `field.state.meta.errors`.

Aqui está um exemplo:

```tsx
<form.Field
  name="age"
  validators={{
    onChange: ({ value }) =>
      value < 13 ? "You must be 13 to make an account" : undefined,
  }}
>
  {(field) => (
    <>
      <label htmlFor={field.name}>Age:</label>
      <input
        id={field.name}
        name={field.name}
        value={field.state.value}
        type="number"
        onChange={(e) => field.handleChange(e.target.valueAsNumber)}
      />
      {!field.state.meta.isValid && (
        <em role="alert">{field.state.meta.errors.join(", ")}</em>
      )}
    </>
  )}
</form.Field>
```

No exemplo acima, a validação é feita a cada tecla digitada (`onChange`). Se, em vez disso, quiséssemos que a validação fosse feita quando o field perde o foco, mudaríamos o código acima assim:

```tsx
<form.Field
  name="age"
  validators={{
    onBlur: ({ value }) =>
      value < 13 ? "You must be 13 to make an account" : undefined,
  }}
>
  {(field) => (
    <>
      <label htmlFor={field.name}>Age:</label>
      <input
        id={field.name}
        name={field.name}
        value={field.state.value}
        type="number"
        // Listen to the onBlur event on the field
        onBlur={field.handleBlur}
        // We always need to implement onChange, so that TanStack Form receives the changes
        onChange={(e) => field.handleChange(e.target.valueAsNumber)}
      />
      {!field.state.meta.isValid && (
        <em role="alert">{field.state.meta.errors.join(", ")}</em>
      )}
    </>
  )}
</form.Field>
```

Então, você pode controlar quando a validação é feita implementando o callback desejado. Você pode até realizar diferentes partes da validação em momentos diferentes:

```tsx
<form.Field
  name="age"
  validators={{
    onChange: ({ value }) =>
      value < 13 ? "You must be 13 to make an account" : undefined,
    onBlur: ({ value }) => (value < 0 ? "Invalid value" : undefined),
  }}
>
  {(field) => (
    <>
      <label htmlFor={field.name}>Age:</label>
      <input
        id={field.name}
        name={field.name}
        value={field.state.value}
        type="number"
        // Listen to the onBlur event on the field
        onBlur={field.handleBlur}
        // We always need to implement onChange, so that TanStack Form receives the changes
        onChange={(e) => field.handleChange(e.target.valueAsNumber)}
      />
      {!field.state.meta.isValid && (
        <em role="alert">{field.state.meta.errors.join(", ")}</em>
      )}
    </>
  )}
</form.Field>
```

No exemplo acima, estamos validando coisas diferentes no mesmo field em momentos diferentes (a cada tecla digitada e ao tirar o foco do field). Como `field.state.meta.errors` é um array, todos os erros relevantes em um dado momento são exibidos. Você também pode usar `field.state.meta.errorMap` para obter erros com base em _quando_ a validação foi feita (onChange, onBlur, etc.). Mais informações sobre exibição de erros abaixo.

## Exibindo Erros

Uma vez que você tenha sua validação configurada, pode mapear os erros de um array para exibi-los na sua UI:

```tsx
<form.Field
  name="age"
  validators={{
    onChange: ({ value }) =>
      value < 13 ? "You must be 13 to make an account" : undefined,
  }}
>
  {(field) => {
    return (
      <>
        {/* ... */}
        {!field.state.meta.isValid && (
          <em>{field.state.meta.errors.join(",")}</em>
        )}
      </>
    );
  }}
</form.Field>
```

Ou use a propriedade `errorMap` para acessar o erro específico que você está procurando:

```tsx
<form.Field
  name="age"
  validators={{
    onChange: ({ value }) =>
      value < 13 ? "You must be 13 to make an account" : undefined,
  }}
>
  {(field) => (
    <>
      {/* ... */}
      {field.state.meta.errorMap["onChange"] ? (
        <em>{field.state.meta.errorMap["onChange"]}</em>
      ) : null}
    </>
  )}
</form.Field>
```

Vale mencionar que nosso array `errors` e o `errorMap` correspondem aos tipos retornados pelos validators. Isso significa que:

```tsx
<form.Field
  name="age"
  validators={{
    onChange: ({ value }) => (value < 13 ? { isOldEnough: false } : undefined),
  }}
>
  {(field) => (
    <>
      {/* ... */}
      {/* errorMap.onChange is type `{isOldEnough: false} | undefined` */}
      {/* meta.errors is type `Array<{isOldEnough: false} | undefined>` */}
      {!field.state.meta.errorMap["onChange"]?.isOldEnough ? (
        <em>The user is not old enough</em>
      ) : null}
    </>
  )}
</form.Field>
```

## Validação no nível do field vs no nível do form

Como mostrado acima, cada `<Field>` aceita suas próprias regras de validação através dos callbacks como `onChange` e `onBlur`. Também é possível definir regras de validação no nível do form (ao contrário de field por field) passando callbacks semelhantes ao hook `useForm()`.

Exemplo:

```tsx
export default function App() {
  const form = useForm({
    defaultValues: {
      age: 0,
    },
    onSubmit: async ({ value }) => {
      console.log(value);
    },
    validators: {
      // Add validators to the form the same way you would add them to a field
      onChange({ value }) {
        if (value.age < 13) {
          return "Must be 13 or older to sign";
        }
        return undefined;
      },
    },
  });

  // Subscribe to the form's `errorMap` so that updates to it will cause re-renders
  // Alternatively, you can use `form.Subscribe`
  const formErrorMap = useStore(form.store, (state) => state.errorMap);

  return (
    <div>
      {/* ... */}
      {formErrorMap.onChange ? (
        <div>
          <em>There was an error on the form: {formErrorMap.onChange}</em>
        </div>
      ) : null}
      {/* ... */}
    </div>
  );
}
```

### Definindo erros no nível do field a partir dos validators do form

Você pode definir erros nos fields a partir dos validators do form. Um caso de uso comum para isso é validar todos os fields no submit chamando um único endpoint de API no validator `onSubmitAsync` do form.

```tsx
export default function App() {
  const form = useForm({
    defaultValues: {
      age: 0,
      socials: [],
      details: {
        email: "",
      },
    },
    validators: {
      onSubmitAsync: async ({ value }) => {
        // Validate the value on the server
        const hasErrors = await verifyDataOnServer(value);
        if (hasErrors) {
          return {
            form: "Invalid data", // The `form` key is optional
            fields: {
              age: "Must be 13 or older to sign",
              // Set errors on nested fields with the field's name
              "socials[0].url": "The provided URL does not exist",
              "details.email": "An email is required",
            },
          };
        }

        return null;
      },
    },
  });

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <form.Field name="age">
          {(field) => (
            <>
              <label htmlFor={field.name}>Age:</label>
              <input
                id={field.name}
                name={field.name}
                value={field.state.value}
                type="number"
                onChange={(e) => field.handleChange(e.target.valueAsNumber)}
              />
              {!field.state.meta.isValid && (
                <em role="alert">{field.state.meta.errors.join(", ")}</em>
              )}
            </>
          )}
        </form.Field>
        <form.Subscribe
          selector={(state) => [state.errorMap]}
          children={([errorMap]) =>
            errorMap.onSubmit ? (
              <div>
                <em>There was an error on the form: {errorMap.onSubmit}</em>
              </div>
            ) : null
          }
        />
        {/*...*/}
      </form>
    </div>
  );
}
```

> Algo que vale mencionar é que se você tem uma função de validação do form que retorna um erro, esse erro pode ser sobrescrito pela validação específica do field.
>
> Isso significa que:
>
> ```jsx
> const form = useForm({
>   defaultValues: {
>     age: 0,
>   },
>   validators: {
>     onChange: ({ value }) => {
>       return {
>         fields: {
>           age: value.age < 12 ? "Too young!" : undefined,
>         },
>       };
>     },
>   },
> });
>
> // ...
>
> return (
>   <form.Field
>     name="age"
>     validators={{
>       onChange: ({ value }) => (value % 2 === 0 ? "Must be odd!" : undefined),
>     }}
>     children={() => <>{/* ... */}</>}
>   />
> );
> ```
>
> Mostrará apenas `'Must be odd!'` mesmo que o erro 'Too young!' seja retornado pela validação no nível do form.

## Validação Funcional Assíncrona

Embora suspeitemos que a maioria das validações será síncrona, existem muitos casos em que uma chamada de rede ou outra operação assíncrona seria útil para validar.

Para isso, temos os métodos dedicados `onChangeAsync`, `onBlurAsync` e outros que podem ser usados para validação:

```tsx
<form.Field
  name="age"
  validators={{
    onChangeAsync: async ({ value }) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return value < 13 ? "You must be 13 to make an account" : undefined;
    },
  }}
>
  {(field) => (
    <>
      <label htmlFor={field.name}>Age:</label>
      <input
        id={field.name}
        name={field.name}
        value={field.state.value}
        type="number"
        onChange={(e) => field.handleChange(e.target.valueAsNumber)}
      />
      {!field.state.meta.isValid && (
        <em role="alert">{field.state.meta.errors.join(", ")}</em>
      )}
    </>
  )}
</form.Field>
```

Validators síncronos e assíncronos podem coexistir. Por exemplo, é possível definir tanto `onBlur` quanto `onBlurAsync` no mesmo field:

```tsx
<form.Field
  name="age"
  validators={{
    onBlur: ({ value }) => (value < 13 ? "You must be at least 13" : undefined),
    onBlurAsync: async ({ value }) => {
      const currentAge = await fetchCurrentAgeOnProfile();
      return value < currentAge ? "You can only increase the age" : undefined;
    },
  }}
>
  {(field) => (
    <>
      <label htmlFor={field.name}>Age:</label>
      <input
        id={field.name}
        name={field.name}
        value={field.state.value}
        type="number"
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.valueAsNumber)}
      />
      {!field.state.meta.isValid && (
        <em role="alert">{field.state.meta.errors.join(", ")}</em>
      )}
    </>
  )}
</form.Field>
```

O método de validação síncrono (`onBlur`) é executado primeiro, e o método assíncrono (`onBlurAsync`) só é executado se o síncrono (`onBlur`) for bem-sucedido. Para alterar esse comportamento, defina a opção `asyncAlways` como `true`, e o método assíncrono será executado independentemente do resultado do método síncrono.

### Debouncing Embutido

Embora chamadas assíncronas sejam o caminho para validar contra o banco de dados, executar uma requisição de rede a cada tecla digitada é uma boa maneira de fazer um DDoS no seu banco de dados.

Em vez disso, habilitamos um método fácil de fazer debouncing nas suas chamadas `async` adicionando uma única propriedade:

```tsx
<form.Field
  name="age"
  asyncDebounceMs={500}
  validators={{
    onChangeAsync: async ({ value }) => {
      // ...
    },
  }}
  children={(field) => {
    return <>{/* ... */}</>;
  }}
/>
```

Isso fará debouncing de cada chamada assíncrona com um atraso de 500ms. Você pode até sobrescrever essa propriedade por validação:

```tsx
<form.Field
  name="age"
  asyncDebounceMs={500}
  validators={{
    onChangeAsyncDebounceMs: 1500,
    onChangeAsync: async ({ value }) => {
      // ...
    },
    onBlurAsync: async ({ value }) => {
      // ...
    },
  }}
  children={(field) => {
    return <>{/* ... */}</>;
  }}
/>
```

Isso executará `onChangeAsync` a cada 1500ms, enquanto `onBlurAsync` será executado a cada 500ms.

## Validação através de Bibliotecas de Schema

Embora funções ofereçam mais flexibilidade e personalização sobre sua validação, elas podem ser um pouco verbosas. Para ajudar a resolver isso, existem bibliotecas que fornecem validação baseada em schema para tornar a validação abreviada e com tipos estritos substancialmente mais fácil. Você também pode definir um único schema para todo o seu form e passá-lo aos validators no nível do form; os erros serão propagados automaticamente para os fields.

### Bibliotecas de Standard Schema

O TanStack Form suporta nativamente todas as bibliotecas que seguem a [especificação Standard Schema](https://github.com/standard-schema/standard-schema), mais notavelmente:

- [Zod](https://zod.dev/)
- [Valibot](https://valibot.dev/)
- [ArkType](https://arktype.io/)
- [Effect/Schema](https://effect.website/docs/schema/standard-schema/)

_Nota:_ certifique-se de usar a versão mais recente das bibliotecas de schema, pois versões mais antigas podem não suportar Standard Schema ainda.

> A validação não fornecerá valores transformados. Veja [tratamento de submissão](./submission-handling.md) para mais informações.

Para usar schemas dessas bibliotecas, você pode passá-los para as props `validators` da mesma forma que faria com uma função personalizada:

```tsx
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

Validators assíncronos no nível do form e do field também são suportados:

```tsx
<form.Field
  name="age"
  validators={{
    onChange: z.number().gte(13, "You must be 13 to make an account"),
    onChangeAsyncDebounceMs: 500,
    onChangeAsync: z.number().refine(
      async (value) => {
        const currentAge = await fetchCurrentAgeOnProfile();
        return value >= currentAge;
      },
      {
        message: "You can only increase the age",
      },
    ),
  }}
  children={(field) => {
    return <>{/* ... */}</>;
  }}
/>
```

Se você precisar de ainda mais controle sobre sua validação com Standard Schema, pode combinar um Standard Schema com uma função callback assim:

```tsx
<form.Field
  name="age"
  asyncDebounceMs={500}
  validators={{
    onChangeAsync: async ({ value, fieldApi }) => {
      const errors = fieldApi.parseValueWithSchema(
        z.number().gte(13, "You must be 13 to make an account"),
      );
      if (errors) return errors;
      // continue with your validation
    },
  }}
  children={(field) => {
    return <>{/* ... */}</>;
  }}
/>
```

## Prevenindo que forms inválidos sejam submetidos

Os callbacks, como `onChange` e `onBlur`, também são executados quando o form é submetido e a submissão é bloqueada porque o form é inválido.

O objeto de state do form tem uma flag `canSubmit` que é `false` quando qualquer field é inválido e o form foi tocado (`canSubmit` é true até que o form seja tocado, mesmo que alguns fields sejam "tecnicamente" inválidos com base em suas props `onChange`/`onBlur`).

Você pode se inscrever em `canSubmit` via `form.Subscribe` e usar o valor para, por exemplo, desabilitar o botão de submit quando o form é inválido (na prática, botões desabilitados não são acessíveis, use `aria-disabled` em vez disso).

```tsx
const form = useForm(/* ... */);

return (
  /* ... */

  // Dynamic submit button
  <form.Subscribe
    selector={(state) => [state.canSubmit, state.isSubmitting]}
    children={([canSubmit, isSubmitting]) => (
      <button type="submit" disabled={!canSubmit}>
        {isSubmitting ? "..." : "Submit"}
      </button>
    )}
  />
);
```

Para prevenir que o form seja submetido antes de qualquer interação, combine as flags `canSubmit` com `isPristine`. Uma condição simples como `!canSubmit || isPristine` desabilita efetivamente as submissões até que o usuário tenha feito alterações.
