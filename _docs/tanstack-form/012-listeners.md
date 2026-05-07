---
id: listeners
title: Side effects for event triggers
---

Para situações onde você quer "afetar" ou "reagir" a gatilhos, existe a API de listener. Por exemplo, se você, como desenvolvedor, quiser resetar um field do form como resultado da mudança de outro field, você usaria a API de listener.

Imagine o seguinte fluxo do usuário:

- O usuário seleciona um país em um drop-down.
- O usuário então seleciona uma província em outro drop-down.
- O usuário muda o país selecionado para um diferente.

Neste exemplo, quando o usuário muda o país, a província selecionada precisa ser resetada, pois não é mais válida. Com a API de listener, podemos nos inscrever no evento `onChange` e disparar um reset no field "province" quando o listener é acionado.

Eventos que podem ser "ouvidos" são:

- `onChange`
- `onBlur`
- `onMount`
- `onSubmit`

```tsx
function App() {
  const form = useForm({
    defaultValues: {
      country: "",
      province: "",
    },
    // ...
  });

  return (
    <div>
      <form.Field
        name="country"
        listeners={{
          onChange: ({ value }) => {
            console.log(`Country changed to: ${value}, resetting province`);
            form.setFieldValue("province", "");
          },
        }}
      >
        {(field) => (
          <label>
            <div>Country</div>
            <input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </label>
        )}
      </form.Field>

      <form.Field name="province">
        {(field) => (
          <label>
            <div>Province</div>
            <input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </label>
        )}
      </form.Field>
    </div>
  );
}
```

### Debouncing Integrado

Se você está fazendo uma requisição de API dentro de um listener, pode querer aplicar debounce nas chamadas, pois isso pode causar problemas de performance.
Disponibilizamos um método fácil para aplicar debounce nos seus listeners adicionando `onChangeDebounceMs` ou `onBlurDebounceMs`.

```tsx
<form.Field
  name="country"
  listeners={{
    onChangeDebounceMs: 500, // 500ms debounce
    onChange: ({ value }) => {
      console.log(`Country changed to: ${value} without a change within 500ms, resetting province`)
      form.setFieldValue('province', '')
    },
  }}
>
  {(field) => (
    /* ... */
  )}
</form.Field>
```

### Listeners no nível do form

Em um nível mais alto, listeners também estão disponíveis no nível do form, permitindo acesso aos eventos `onMount` e `onSubmit`, e tendo `onChange` e `onBlur` propagados para todos os filhos do form. Listeners no nível do form também podem ter debounce aplicado da mesma forma discutida anteriormente.

Os listeners `onMount` e `onSubmit` possuem os seguintes parâmetros:

- `formApi`

Os listeners `onChange` e `onBlur` têm acesso a:

- `fieldApi`
- `formApi`

```tsx
const form = useForm({
  listeners: {
    onMount: ({ formApi }) => {
      // custom logging service
      loggingService("mount", formApi.state.values);
    },

    onChange: ({ formApi, fieldApi }) => {
      // autosave logic
      if (formApi.state.isValid) {
        formApi.handleSubmit();
      }

      // fieldApi represents the field that triggered the event.
      console.log(fieldApi.name, fieldApi.state.value);
    },
    onChangeDebounceMs: 500,
  },
});
```
