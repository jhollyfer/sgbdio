---
id: submission-handling
title: Submission handling
---

## Passando dados adicionais para o tratamento de submit

Você pode ter múltiplos tipos de comportamento de submit, por exemplo, voltar à página anterior ou permanecer no form.
Você pode fazer isso especificando a propriedade `onSubmitMeta`. Esses metadados serão passados para a função `onSubmit`.

> Nota: se `form.handleSubmit()` for chamado sem metadados, ele usará o padrão fornecido.

```tsx
import { useForm } from "@tanstack/react-form";

type FormMeta = {
  submitAction: "continue" | "backToMenu" | null;
};

// Metadata is not required to call form.handleSubmit().
// Specify what values to use as default if no meta is passed
const defaultMeta: FormMeta = {
  submitAction: null,
};

function App() {
  const form = useForm({
    defaultValues: {
      data: "",
    },
    // Define what meta values to expect on submission
    onSubmitMeta: defaultMeta,
    onSubmit: async ({ value, meta }) => {
      // Do something with the values passed via handleSubmit
      console.log(`Selected action - ${meta.submitAction}`, value);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {/* ... */}
      <button
        type="submit"
        // Overwrites the default specified in onSubmitMeta
        onClick={() => form.handleSubmit({ submitAction: "continue" })}
      >
        Submit and continue
      </button>
      <button
        type="submit"
        onClick={() => form.handleSubmit({ submitAction: "backToMenu" })}
      >
        Submit and back to menu
      </button>
    </form>
  );
}
```

## Transformando dados com Standard Schemas

Embora o Tanstack Form forneça [suporte a Standard Schema](./validation.md) para validação, ele não preserva os dados de saída do Schema.

O valor passado para a função `onSubmit` sempre será os dados de entrada. Para receber os dados de saída de um Standard Schema, faça o parse na função `onSubmit`:

```tsx
const schema = z.object({
  age: z.string().transform((age) => Number(age)),
});

// Tanstack Form uses the input type of Standard Schemas
const defaultValues: z.input<typeof schema> = {
  age: "13",
};

const form = useForm({
  defaultValues,
  validators: {
    onChange: schema,
  },
  onSubmit: ({ value }) => {
    const inputAge: string = value.age;
    // Pass it through the schema to get the transformed value
    const result = schema.parse(value);
    const outputAge: number = result.age;
  },
});
```
