---
id: custom-errors
title: Custom Errors
---

O TanStack Form oferece total flexibilidade nos tipos de valores de erro que você pode retornar dos validators. Erros do tipo string são os mais comuns e fáceis de trabalhar, mas a biblioteca permite que você retorne qualquer tipo de valor dos seus validators.

Como regra geral, qualquer valor truthy é considerado um erro e marcará o form ou field como inválido, enquanto valores falsy (`false`, `undefined`, `null`, etc.) significam que não há erro, e o form ou field é válido.

## Retornando Valores String dos Forms

```tsx
<form.Field
  name="username"
  validators={{
    onChange: ({ value }) =>
      value.length < 3 ? "Username must be at least 3 characters" : undefined,
  }}
/>
```

Para validação no nível do form afetando múltiplos fields:

```tsx
const form = useForm({
  defaultValues: {
    username: "",
    email: "",
  },
  validators: {
    onChange: ({ value }) => {
      return {
        fields: {
          username:
            value.username.length < 3 ? "Username too short" : undefined,
          email: !value.email.includes("@") ? "Invalid email" : undefined,
        },
      };
    },
  },
});
```

Erros do tipo string são o tipo mais comum e são facilmente exibidos na sua UI:

```tsx
{
  field.state.meta.errors.map((error, i) => (
    <div key={i} className="error">
      {error}
    </div>
  ));
}
```

### Números

Úteis para representar quantidades, limites ou magnitudes:

```tsx
<form.Field
  name="age"
  validators={{
    onChange: ({ value }) => (value < 18 ? 18 - value : undefined),
  }}
/>
```

Exibição na UI:

```tsx
// TypeScript knows the error is a number based on your validator
<div className="error">
  You need {field.state.meta.errors[0]} more years to be eligible
</div>
```

### Booleanos

Flags simples para indicar state de erro:

```tsx
<form.Field
  name="accepted"
  validators={{
    onChange: ({ value }) => (!value ? true : undefined),
  }}
/>
```

Exibição na UI:

```tsx
{
  field.state.meta.errors[0] === true && (
    <div className="error">You must accept the terms</div>
  );
}
```

### Objetos

Objetos de erro ricos com múltiplas propriedades:

```tsx
<form.Field
  name="email"
  validators={{
    onChange: ({ value }) => {
      if (!value.includes("@")) {
        return {
          message: "Invalid email format",
          severity: "error",
          code: 1001,
        };
      }
      return undefined;
    },
  }}
/>
```

Exibição na UI:

```tsx
{
  typeof field.state.meta.errors[0] === "object" && (
    <div className={`error ${field.state.meta.errors[0].severity}`}>
      {field.state.meta.errors[0].message}
      <small> (Code: {field.state.meta.errors[0].code})</small>
    </div>
  );
}
```

No exemplo acima, a mensagem renderizada, o código e a estilização dependem do evento de erro que você deseja exibir.

### Arrays

Múltiplas mensagens de erro para um único field:

```tsx
<form.Field
  name="password"
  validators={{
    onChange: ({ value }) => {
      const errors = [];
      if (value.length < 8) errors.push("Password too short");
      if (!/[A-Z]/.test(value)) errors.push("Missing uppercase letter");
      if (!/[0-9]/.test(value)) errors.push("Missing number");

      return errors.length ? errors : undefined;
    },
  }}
/>
```

Exibição na UI:

```tsx
{
  Array.isArray(field.state.meta.errors) && (
    <ul className="error-list">
      {field.state.meta.errors.map((err, i) => (
        <li key={i}>{err}</li>
      ))}
    </ul>
  );
}
```

## A Prop `disableErrorFlat` nos Fields

Por padrão, o TanStack Form achata os erros de todas as fontes de validação (`onChange`, `onBlur`, `onSubmit`) em um único array `errors`. A prop `disableErrorFlat` preserva as fontes dos erros:

```tsx
<form.Field
  name="email"
  disableErrorFlat
  validators={{
    onChange: ({ value }) =>
      !value.includes("@") ? "Invalid email format" : undefined,
    onBlur: ({ value }) =>
      !value.endsWith(".com") ? "Only .com domains allowed" : undefined,
    onSubmit: ({ value }) => (value.length < 5 ? "Email too short" : undefined),
  }}
/>
```

Sem `disableErrorFlat`, todos os erros seriam combinados em `field.state.meta.errors`. Com ela, você pode acessar os erros pela sua fonte:

```tsx
{
  field.state.meta.errorMap.onChange && (
    <div className="real-time-error">{field.state.meta.errorMap.onChange}</div>
  );
}

{
  field.state.meta.errorMap.onBlur && (
    <div className="blur-feedback">{field.state.meta.errorMap.onBlur}</div>
  );
}

{
  field.state.meta.errorMap.onSubmit && (
    <div className="submit-error">{field.state.meta.errorMap.onSubmit}</div>
  );
}
```

Isso é útil para:

- Exibir diferentes tipos de erros com diferentes tratamentos visuais
- Priorizar erros (por exemplo, exibir erros de submit de forma mais proeminente)
- Implementar divulgação progressiva de erros

## Segurança de Tipos de `errors` e `errorMap`

O TanStack Form oferece forte segurança de tipos para tratamento de erros. Cada chave no `errorMap` possui exatamente o tipo retornado pelo seu validator correspondente, enquanto o array `errors` contém um tipo union de todos os possíveis valores de erro de todos os validators:

```tsx
<form.Field
  name="password"
  validators={{
    onChange: ({ value }) => {
      // This returns a string or undefined
      return value.length < 8 ? "Too short" : undefined;
    },
    onBlur: ({ value }) => {
      // This returns an object or undefined
      if (!/[A-Z]/.test(value)) {
        return { message: "Missing uppercase", level: "warning" };
      }
      return undefined;
    },
  }}
  children={(field) => {
    // TypeScript knows that errors[0] can be string | { message: string, level: string } | undefined
    const error = field.state.meta.errors[0];

    // Type-safe error handling
    if (typeof error === "string") {
      return <div className="string-error">{error}</div>;
    } else if (error && typeof error === "object") {
      return <div className={error.level}>{error.message}</div>;
    }

    return null;
  }}
/>
```

A propriedade `errorMap` também é totalmente tipada, correspondendo aos tipos de retorno das suas funções de validação:

```tsx
// With disableErrorFlat
<form.Field
  name="email"
  disableErrorFlat
  validators={{
    onChange: ({ value }): string | undefined =>
      !value.includes("@") ? "Invalid email" : undefined,
    onBlur: ({ value }): { code: number, message: string } | undefined =>
      !value.endsWith(".com") ? { code: 100, message: "Wrong domain" } : undefined
  }}
  children={(field) => {
    // TypeScript knows the exact type of each error source
    const onChangeError: string | undefined = field.state.meta.errorMap.onChange;
    const onBlurError: { code: number, message: string } | undefined = field.state.meta.errorMap.onBlur;

    return (/* ... */);
  }}
/>
```

Essa segurança de tipos ajuda a capturar erros em tempo de compilação em vez de em tempo de execução, tornando seu código mais confiável e fácil de manter.
