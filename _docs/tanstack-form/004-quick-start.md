---
id: quick-start
title: Quick Start
---

O TanStack Form é diferente da maioria das bibliotecas de form que você já usou. Ele foi projetado para uso em produção em larga escala, com foco em type safety, performance e composição para uma experiência de desenvolvedor incomparável.

Por isso, desenvolvemos [uma filosofia em torno do uso da biblioteca](../../philosophy.md) que valoriza escalabilidade e experiência do desenvolvedor a longo prazo em vez de trechos de código curtos e compartilháveis.

Aqui está um exemplo de um form seguindo muitas das nossas melhores práticas, que permitirá que você desenvolva rapidamente até forms de alta complexidade após uma curta experiência de integração:

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
// Form components that pre-bind events from the form hook; check our "Form Composition" guide for more
import { TextField, NumberField, SubmitButton } from "~our-app/ui-library";
// We also support Valibot, ArkType, and any other standard schema library
import { z } from "zod";

const { fieldContext, formContext } = createFormHookContexts();

// Allow us to bind components to the form to keep type safety but reduce production boilerplate
// Define this once to have a generator of consistent form instances throughout your app
const { useAppForm } = createFormHook({
  fieldComponents: {
    TextField,
    NumberField,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
});

const PeoplePage = () => {
  const form = useAppForm({
    defaultValues: {
      username: "",
      age: 0,
    },
    validators: {
      // Pass a schema or function to validate
      onChange: z.object({
        username: z.string(),
        age: z.number().min(13),
      }),
    },
    onSubmit: ({ value }) => {
      // Do something with form data
      alert(JSON.stringify(value, null, 2));
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <h1>Personal Information</h1>
      {/* Components are bound to `form` and `field` to ensure extreme type safety */}
      {/* Use `form.AppField` to render a component bound to a single field */}
      <form.AppField
        name="username"
        children={(field) => <field.TextField label="Full Name" />}
      />
      {/* The "name" property will throw a TypeScript error if typo'd  */}
      <form.AppField
        name="age"
        children={(field) => <field.NumberField label="Age" />}
      />
      {/* Components in `form.AppForm` have access to the form context */}
      <form.AppForm>
        <form.SubmitButton />
      </form.AppForm>
    </form>
  );
};

const rootElement = document.getElementById("root")!;
ReactDOM.createRoot(rootElement).render(<PeoplePage />);
```

Embora geralmente sugerimos usar `createFormHook` para reduzir o boilerplate a longo prazo, também suportamos components avulsos e outros comportamentos usando `useForm` e `form.Field`:

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { useForm } from "@tanstack/react-form";

const PeoplePage = () => {
  const form = useForm({
    defaultValues: {
      username: "",
      age: 0,
    },
    onSubmit: ({ value }) => {
      // Do something with form data
      alert(JSON.stringify(value, null, 2));
    },
  });

  return (
    <form.Field
      name="age"
      validators={{
        // We can choose between form-wide and field-specific validators
        onChange: ({ value }) =>
          value > 13 ? undefined : "Must be 13 or older",
      }}
      children={(field) => (
        <>
          <input
            name={field.name}
            value={field.state.value}
            onBlur={field.handleBlur}
            type="number"
            onChange={(e) => field.handleChange(e.target.valueAsNumber)}
          />
          {!field.state.meta.isValid && (
            <em>{field.state.meta.errors.join(",")}</em>
          )}
        </>
      )}
    />
  );
};

const rootElement = document.getElementById("root")!;
ReactDOM.createRoot(rootElement).render(<PeoplePage />);
```

Todas as propriedades de `useForm` podem ser usadas em `useAppForm` e todas as propriedades de `form.Field` podem ser usadas em `form.AppField`.
