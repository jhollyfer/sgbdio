---
id: linked-fields
title: Link Two Form Fields Together
---

Você pode se deparar com a necessidade de vincular dois fields, de modo que um seja validado quando o valor do outro mudar.
Um caso de uso comum é quando você tem um field `password` e um field `confirm_password`.
Nesse caso, você quer que o field `confirm_password` exiba um erro se seu valor não corresponder ao do field `password`, independentemente de qual field disparou a mudança de valor.

Imagine o seguinte fluxo do usuário:

- O usuário atualiza o field `confirm_password`.
- O usuário atualiza o field `password`.

Neste exemplo, o form ainda terá erros presentes porque a validação do field `confirm_password` não foi re-executada para marcá-lo como válido.

Para resolver isso, você precisa garantir que a validação do field `confirm_password` seja re-executada quando o field `password` for atualizado.
Para fazer isso, você pode adicionar uma prop `onChangeListenTo` ao field `confirm_password`.

```tsx
function App() {
  const form = useForm({
    defaultValues: {
      password: "",
      confirm_password: "",
    },
    // ...
  });

  return (
    <div>
      <form.Field name="password">
        {(field) => (
          <label>
            <div>Password</div>
            <input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </label>
        )}
      </form.Field>
      <form.Field
        name="confirm_password"
        validators={{
          onChangeListenTo: ["password"],
          onChange: ({ value, fieldApi }) => {
            if (value !== fieldApi.form.getFieldValue("password")) {
              return "Passwords do not match";
            }
            return undefined;
          },
        }}
      >
        {(field) => (
          <div>
            <label>
              <div>Confirm Password</div>
              <input
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </label>
            {field.state.meta.errors.map((err) => (
              <div key={err}>{err}</div>
            ))}
          </div>
        )}
      </form.Field>
    </div>
  );
}
```

Isso é semelhante à prop `onBlurListenTo`, que re-executa a validação quando o field vinculado perde o foco (blur).
