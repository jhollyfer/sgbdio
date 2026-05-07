---
id: dynamic-validation
title: Dynamic Validation
---

Em muitos casos, você quer mudar as regras de validação dependendo do state do form ou de outras condições. O exemplo mais popular disso é quando você quer validar um field de forma diferente com base no fato de o usuário ter submetido o form pela primeira vez ou não.

Nós suportamos isso através da nossa função de validação `onDynamic`.

```tsx
import { revalidateLogic, useForm } from "@tanstack/react-form";

// ...

const form = useForm({
  defaultValues: {
    firstName: "",
    lastName: "",
  },
  // If this is omitted, `onDynamic` will not be called
  validationLogic: revalidateLogic(),
  validators: {
    onDynamic: ({ value }) => {
      if (!value.firstName) {
        return { firstName: "A first name is required" };
      }
      return undefined;
    },
  },
});
```

> [!IMPORTANT]
> Por padrão, `onDynamic` não é chamado; portanto, você deve passar `revalidateLogic()` para a opção `validationLogic` do `useForm`.

## Opções de Revalidação

`revalidateLogic` permite que você especifique quando a validação deve ser executada e mude as regras de validação dinamicamente com base no state atual de submissão do form.

Ela recebe dois argumentos:

- `mode`: O modo de validação antes da primeira submissão do form. Pode ser um dos seguintes:
  - `change`: Validar a cada mudança.
  - `blur`: Validar no blur.
  - `submit`: Validar no submit. (**padrão**)

- `modeAfterSubmission`: O modo de validação após o form ter sido submetido. Pode ser um dos seguintes:
  - `change`: Validar a cada mudança. (**padrão**)
  - `blur`: Validar no blur.
  - `submit`: Validar no submit.

Você pode, por exemplo, usar o seguinte para revalidar no blur após a primeira submissão:

```tsx
const form = useForm({
  // ...
  validationLogic: revalidateLogic({
    mode: "submit",
    modeAfterSubmission: "blur",
  }),
  // ...
});
```

## Acessando Erros

Assim como você pode acessar erros de uma validação `onChange` ou `onBlur`, você pode acessar erros da função de validação `onDynamic` usando o objeto `form.state.errorMap`.

```tsx
function App() {
  const form = useForm({
    // ...
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: ({ value }) => {
        if (!value.firstName) {
          return { firstName: "A first name is required" };
        }
        return undefined;
      },
    },
  });

  return <p>{form.state.errorMap.onDynamic?.firstName}</p>;
}
```

## Uso com Outra Lógica de Validação

Você pode usar a validação `onDynamic` junto com outra lógica de validação, como `onChange` ou `onBlur`.

```tsx
import { revalidateLogic, useForm } from "@tanstack/react-form";

function App() {
  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
    },
    validationLogic: revalidateLogic(),
    validators: {
      onChange: ({ value }) => {
        if (!value.firstName) {
          return { firstName: "A first name is required" };
        }
        return undefined;
      },
      onDynamic: ({ value }) => {
        if (!value.lastName) {
          return { lastName: "A last name is required" };
        }
        return undefined;
      },
    },
  });

  return (
    <div>
      <p>{form.state.errorMap.onChange?.firstName}</p>
      <p>{form.state.errorMap.onDynamic?.lastName}</p>
    </div>
  );
}
```

### Uso com Fields

Você também pode usar a validação `onDynamic` com fields, assim como faria com outra lógica de validação.

```tsx
function App() {
  const form = useForm({
    defaultValues: {
      name: "",
      age: 0,
    },
    validationLogic: revalidateLogic(),
    onSubmit({ value }) {
      alert(JSON.stringify(value));
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <form.Field
        name={"age"}
        validators={{
          onDynamic: ({ value }) =>
            value > 18 ? undefined : "Age must be greater than 18",
        }}
        children={(field) => (
          <div>
            <input
              type="number"
              onChange={(e) => field.handleChange(e.target.valueAsNumber)}
              onBlur={field.handleBlur}
              value={field.state.value}
            />
            <p style={{ color: "red" }}>
              {field.state.meta.errorMap.onDynamic}
            </p>
          </div>
        )}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Validação Assíncrona

A validação assíncrona também pode ser usada com `onDynamicAsync`, assim como com outra lógica de validação. Você pode até fazer debouncing da validação assíncrona para evitar chamadas excessivas.

```tsx
const form = useForm({
  defaultValues: {
    username: "",
  },
  validationLogic: revalidateLogic(),
  validators: {
    onDynamicAsyncDebounceMs: 500, // Debounce the async validation by 500ms
    onDynamicAsync: async ({ value }) => {
      if (!value.username) {
        return { username: "Username is required" };
      }
      // Simulate an async validation
      const isValid = await validateUsername(value.username);
      return isValid ? undefined : { username: "Username is already taken" };
    },
  },
});
```

### Validação com Standard Schema

Você também pode usar bibliotecas de validação com standard schema como Valibot ou Zod com a validação `onDynamic`. Isso permite que você defina regras de validação complexas que podem mudar dinamicamente com base no state do form.

```tsx
import { z } from "zod";

const schema = z.object({
  firstName: z.string().min(1, "A first name is required"),
  lastName: z.string().min(1, "A last name is required"),
});

const form = useForm({
  defaultValues: {
    firstName: "",
    lastName: "",
  },
  validationLogic: revalidateLogic(),
  validators: {
    onDynamic: schema,
  },
});
```
