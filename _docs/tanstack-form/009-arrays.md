---
id: arrays
title: Arrays
---

O TanStack Form suporta arrays como valores em um form, incluindo valores de sub-objetos dentro de um array.

## Uso Básico

Para usar um array, você pode utilizar `field.state.value` em um valor de array:

```jsx
function App() {
  const form = useForm({
    defaultValues: {
      people: [],
    },
  });

  return (
    <form.Field name="people" mode="array">
      {(field) => (
        <div>
          {field.state.value.map((_, i) => {
            // ...
          })}
        </div>
      )}
    </form.Field>
  );
}
```

Isso gerará o JSX mapeado toda vez que você executar `pushValue` no `field`:

```jsx
<button onClick={() => field.pushValue({ name: "", age: 0 })} type="button">
  Add person
</button>
```

Por fim, você pode usar um subfield da seguinte forma:

```jsx
<form.Field key={i} name={`people[${i}].name`}>
  {(subField) => (
    <input
      value={subField.state.value}
      onChange={(e) => subField.handleChange(e.target.value)}
    />
  )}
</form.Field>
```

## Exemplo Completo

```jsx
function App() {
  const form = useForm({
    defaultValues: {
      people: [],
    },
    onSubmit({ value }) {
      alert(JSON.stringify(value));
    },
  });

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <form.Field name="people" mode="array">
          {(field) => {
            return (
              <div>
                {field.state.value.map((_, i) => {
                  return (
                    <form.Field key={i} name={`people[${i}].name`}>
                      {(subField) => {
                        return (
                          <div>
                            <label>
                              <div>Name for person {i}</div>
                              <input
                                value={subField.state.value}
                                onChange={(e) =>
                                  subField.handleChange(e.target.value)
                                }
                              />
                            </label>
                          </div>
                        );
                      }}
                    </form.Field>
                  );
                })}
                <button
                  onClick={() => field.pushValue({ name: "", age: 0 })}
                  type="button"
                >
                  Add person
                </button>
              </div>
            );
          }}
        </form.Field>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <button type="submit" disabled={!canSubmit}>
              {isSubmitting ? "..." : "Submit"}
            </button>
          )}
        />
      </form>
    </div>
  );
}
```
