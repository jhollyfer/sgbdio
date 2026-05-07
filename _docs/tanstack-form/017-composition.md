---
id: form-composition
title: Form Composition
---

Uma crítica comum ao TanStack Form é que ele é verboso por padrão. Embora essa verbosidade _possa_ ser útil para fins educacionais — ajudando a reforçar o entendimento das nossas APIs — não é ideal em casos de uso em produção.

Por isso, enquanto `form.Field` permite o uso mais poderoso e flexível do TanStack Form, fornecemos APIs que o envolvem e tornam o código da sua aplicação menos verboso.

## Hooks de Form Personalizados

A forma mais poderosa de compor forms é criar hooks de form personalizados. Isso permite que você crie um hook de form adaptado às necessidades da sua aplicação, incluindo components de UI personalizados pré-vinculados e mais.

No seu uso mais básico, `createFormHook` é uma função que recebe um `fieldContext` e um `formContext` e retorna um hook `useAppForm`.

> Esse hook `useAppForm` não personalizado é idêntico ao `useForm`, mas isso mudará rapidamente conforme adicionamos mais opções ao `createFormHook`.

```tsx
import { createFormHookContexts, createFormHook } from "@tanstack/react-form";

// export useFieldContext for use in your custom components
export const { fieldContext, formContext, useFieldContext } =
  createFormHookContexts();

const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  // We'll learn more about these options later
  fieldComponents: {},
  formComponents: {},
});

function App() {
  const form = useAppForm({
    // Supports all useForm options
    defaultValues: {
      firstName: "John",
      lastName: "Doe",
    },
  });

  return <form.Field />; // ...
}
```

### Components de Field Pré-vinculados

Uma vez que essa estrutura esteja em vigor, você pode começar a adicionar components de field e form personalizados ao seu hook de form.

> Nota: o `useFieldContext` deve ser o mesmo exportado do seu context de form personalizado

```tsx
import { useFieldContext } from "./form-context.tsx";

export function TextField({ label }: { label: string }) {
  // The `Field` infers that it should have a `value` type of `string`
  const field = useFieldContext<string>();
  return (
    <label>
      <span>{label}</span>
      <input
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
      />
    </label>
  );
}
```

Depois você pode registrar esse component no seu hook de form.

```tsx
import { TextField } from "./text-field.tsx";

const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
  },
  formComponents: {},
});
```

E usá-lo no seu form:

```tsx
function App() {
  const form = useAppForm({
    defaultValues: {
      firstName: "John",
      lastName: "Doe",
    },
  });

  return (
    // Notice the `AppField` instead of `Field`; `AppField` provides the required context
    <form.AppField
      name="firstName"
      children={(field) => <field.TextField label="First Name" />}
    />
  );
}
```

Isso não apenas permite reutilizar a UI do seu component compartilhado, mas também mantém a segurança de tipos que você espera do TanStack Form: digitar `name` incorretamente resultará em um erro do TypeScript.

#### Uma nota sobre performance

Embora context seja uma ferramenta valiosa no ecossistema React, há uma preocupação legítima de muitos usuários de que fornecer um valor reativo através de um context cause re-renders desnecessários.

> Não está familiarizado com essa preocupação de performance? [O post do blog do Mark Erikson explicando por que o Redux resolve muitos desses problemas](https://blog.isquaredsoftware.com/2021/01/context-redux-differences/) é um ótimo ponto de partida.

Embora essa seja uma preocupação válida, não é um problema para o TanStack Form; os valores fornecidos através do context não são reativos por si só, mas sim instâncias de classe estáticas com propriedades reativas ([usando o TanStack Store como nossa implementação de signals para fazer tudo funcionar](https://tanstack.com/store)).

### Components de Form Pré-vinculados

Enquanto `form.AppField` resolve muitos dos problemas com boilerplate e reutilização de Field, ele não resolve o problema de boilerplate e reutilização do _form_.

Em particular, poder compartilhar instâncias de `form.Subscribe` para, digamos, um botão de submit reativo do form é um caso de uso comum.

```tsx
function SubscribeButton({ label }: { label: string }) {
  const form = useFormContext();
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <button type="submit" disabled={isSubmitting}>
          {label}
        </button>
      )}
    </form.Subscribe>
  );
}

const { useAppForm, withForm } = createFormHook({
  fieldComponents: {},
  formComponents: {
    SubscribeButton,
  },
  fieldContext,
  formContext,
});

function App() {
  const form = useAppForm({
    defaultValues: {
      firstName: "John",
      lastName: "Doe",
    },
  });

  return (
    <form.AppForm>
      // Notice the `AppForm` component wrapper; `AppForm` provides the required
      context
      <form.SubscribeButton label="Submit" />
    </form.AppForm>
  );
}
```

## Dividindo forms grandes em partes menores

Às vezes os forms ficam muito grandes; é assim que funciona às vezes. Embora o TanStack Form suporte bem forms grandes, nunca é divertido trabalhar com centenas ou milhares de linhas de código em arquivos únicos.

Para resolver isso, suportamos a divisão de forms em partes menores usando o higher-order component `withForm`.

```tsx
const { useAppForm, withForm } = createFormHook({
  fieldComponents: {
    TextField,
  },
  formComponents: {
    SubscribeButton,
  },
  fieldContext,
  formContext,
});

const ChildForm = withForm({
  // These values are only used for type-checking, and are not used at runtime
  // This allows you to `...formOpts` from `formOptions` without needing to redeclare the options
  defaultValues: {
    firstName: "John",
    lastName: "Doe",
  },
  // Optional, but adds props to the `render` function in addition to `form`
  props: {
    // These props are also set as default values for the `render` function
    title: "Child Form",
  },
  render: function Render({ form, title }) {
    return (
      <div>
        <p>{title}</p>
        <form.AppField
          name="firstName"
          children={(field) => <field.TextField label="First Name" />}
        />
        <form.AppForm>
          <form.SubscribeButton label="Submit" />
        </form.AppForm>
      </div>
    );
  },
});

function App() {
  const form = useAppForm({
    defaultValues: {
      firstName: "John",
      lastName: "Doe",
    },
  });

  return <ChildForm form={form} title={"Testing"} />;
}
```

### FAQ do `withForm`

> Por que um higher-order component em vez de um hook?

Embora hooks sejam o futuro do React, higher-order components ainda são uma ferramenta poderosa para composição. Em particular, a API do `withForm` nos permite ter forte segurança de tipos sem exigir que os usuários passem generics.

> Por que estou recebendo erros do ESLint sobre hooks em `render`?

O ESLint procura hooks no nível superior de uma função, e `render` pode não ser reconhecido como um component de nível superior, dependendo de como você o definiu.

```tsx
// This will cause ESLint errors with hooks usage
const ChildForm = withForm({
  // ...
  render: ({ form, title }) => {
    // ...
  },
});
```

```tsx
// This works fine
const ChildForm = withForm({
  // ...
  render: function Render({ form, title }) {
    // ...
  },
});
```

### Context como último recurso

Existem casos em que passar `form` com `withForm` não é viável. Você pode encontrar isso com components que não
permitem alterar suas props.

Por exemplo, considere o seguinte uso do TanStack Router:

```ts
function RouteComponent() {
  const form = useAppForm({...formOptions, /* ... */ })
  // <Outlet /> cannot be customized or receive additional props
  return <Outlet />
}
```

Em casos extremos como este, um fallback baseado em context está disponível para acessar a instância do form.

```ts
const { useAppForm, useTypedAppFormContext } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {},
  formComponents: {},
});
```

> [!IMPORTANT] Segurança de tipos
> Esse mecanismo existe exclusivamente para superar restrições de integração e deve ser evitado sempre que `withForm` for possível.
> O context não vai avisá-lo quando os tipos não coincidirem. Você corre risco de erros em tempo de execução com essa implementação.

Uso:

```tsx
// sharedOpts.ts
const formOpts = formOptions({
  /* ... */
});

function ParentComponent() {
  const form = useAppForm({ ...formOptions /* ... */ });

  return (
    <form.AppForm>
      <ChildComponent />
    </form.AppForm>
  );
}

function ChildComponent() {
  const form = useTypedAppFormContext({ ...formOptions });

  // You now have access to form components, field components and fields
}
```

## Reutilizando grupos de fields em múltiplos forms

Às vezes, um par de fields são tão intimamente relacionados que faz sentido agrupá-los e reutilizá-los — como o exemplo de senha listado no [guia de fields vinculados](./linked-fields.md). Em vez de repetir essa lógica em múltiplos forms, você pode utilizar o higher-order component `withFieldGroup`.

> Diferente do `withForm`, validators não podem ser especificados e podem ser qualquer valor.
> Certifique-se de que seus fields podem aceitar tipos de erro desconhecidos.

Reescrevendo o exemplo de senhas usando `withFieldGroup` ficaria assim:

```tsx
const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldComponents: {
    TextField,
    ErrorInfo,
  },
  formComponents: {
    SubscribeButton,
  },
  fieldContext,
  formContext,
});

type PasswordFields = {
  password: string;
  confirm_password: string;
};

// These default values are not used at runtime, but the keys are needed for mapping purposes.
// This allows you to spread `formOptions` without needing to redeclare it.
const defaultValues: PasswordFields = {
  password: "",
  confirm_password: "",
};

const FieldGroupPasswordFields = withFieldGroup({
  defaultValues,
  // You may also restrict the group to only use forms that implement this submit meta.
  // If none is provided, any form with the right defaultValues may use it.
  // onSubmitMeta: { action: '' }

  // Optional, but adds props to the `render` function in addition to `form`
  props: {
    // These default values are also for type-checking and are not used at runtime
    title: "Password",
  },
  // Internally, you will have access to a `group` instead of a `form`
  render: function Render({ group, title }) {
    // access reactive values using the group store
    const password = useStore(group.store, (state) => state.values.password);
    // or the form itself
    const isSubmitting = useStore(
      group.form.store,
      (state) => state.isSubmitting,
    );

    return (
      <div>
        <h2>{title}</h2>
        {/* Groups also have access to Field, Subscribe, Field, AppField and AppForm */}
        <group.AppField name="password">
          {(field) => <field.TextField label="Password" />}
        </group.AppField>
        <group.AppField
          name="confirm_password"
          validators={{
            onChangeListenTo: ["password"],
            onChange: ({ value, fieldApi }) => {
              // The form could be any values, so it is typed as 'unknown'
              const values: unknown = fieldApi.form.state.values;
              // use the group methods instead
              if (value !== group.getFieldValue("password")) {
                return "Passwords do not match";
              }
              return undefined;
            },
          }}
        >
          {(field) => (
            <div>
              <field.TextField label="Confirm Password" />
              <field.ErrorInfo />
            </div>
          )}
        </group.AppField>
      </div>
    );
  },
});
```

Agora podemos usar esses fields agrupados em qualquer form que implemente os valores padrão:

```tsx
// You are allowed to extend the group fields as long as the
// existing properties remain unchanged
type Account = PasswordFields & {
  provider: string;
  username: string;
};

// You may nest the group fields wherever you want
type FormValues = {
  name: string;
  age: number;
  account_data: PasswordFields;
  linked_accounts: Account[];
};

const defaultValues: FormValues = {
  name: "",
  age: 0,
  account_data: {
    password: "",
    confirm_password: "",
  },
  linked_accounts: [
    {
      provider: "TanStack",
      username: "",
      password: "",
      confirm_password: "",
    },
  ],
};

function App() {
  const form = useAppForm({
    defaultValues,
    // If the group didn't specify an `onSubmitMeta` property,
    // the form may implement any meta it wants.
    // Otherwise, the meta must be defined and match.
    onSubmitMeta: { action: "" },
  });

  return (
    <form.AppForm>
      <FieldGroupPasswordFields
        form={form}
        // You must specify where the fields can be found
        fields="account_data"
        title="Passwords"
      />
      <form.Field name="linked_accounts" mode="array">
        {(field) =>
          field.state.value.map((account, i) => (
            <FieldGroupPasswordFields
              key={account.provider}
              form={form}
              // The fields may be in nested fields
              fields={`linked_accounts[${i}]`}
              title={account.provider}
            />
          ))
        }
      </form.Field>
    </form.AppForm>
  );
}
```

### Mapeando valores de field group para um field diferente

Você pode querer manter os fields de senha no nível superior do seu form, ou renomear as propriedades para maior clareza. Você pode mapear os valores do field group
para sua localização real alterando a propriedade `field`:

> [!IMPORTANT]
> Devido a limitações do TypeScript, o mapeamento de fields só é permitido para objetos. Você pode usar records ou arrays no nível superior de um field group, mas não poderá mapear os fields.

```tsx
// To have an easier form, you can keep the fields on the top level
type FormValues = {
  name: string;
  age: number;
  password: string;
  confirm_password: string;
};

const defaultValues: FormValues = {
  name: "",
  age: 0,
  password: "",
  confirm_password: "",
};

function App() {
  const form = useAppForm({
    defaultValues,
  });

  return (
    <form.AppForm>
      <FieldGroupPasswordFields
        form={form}
        // You can map the fields to their equivalent deep key
        fields={{
          password: "password",
          confirm_password: "confirm_password",
          // or map them to differently named keys entirely
          // 'password': 'name'
        }}
        title="Passwords"
      />
    </form.AppForm>
  );
}
```

Se você espera que seus fields estejam sempre no nível superior do seu form, pode criar um mapa rápido
dos seus field groups usando uma função auxiliar:

```tsx
const defaultValues: PasswordFields = {
  password: '',
  confirm_password: '',
}

const passwordFields = createFieldMap(defaultValues)
/* This generates the following map:
 {
    'password': 'password',
    'confirm_password': 'confirm_password'
 }
*/

// Usage:
<FieldGroupPasswordFields
  form={form}
  fields={passwordFields}
  title="Passwords"
/>
```

## Tree-shaking de components de form e field

Embora os exemplos acima sejam ótimos para começar, eles não são ideais para certos casos de uso onde você pode ter centenas de components de form e field.
Em particular, você pode não querer incluir todos os seus components de form e field no bundle de cada arquivo que usa seu hook de form.

Para resolver isso, você pode combinar a API `createFormHook` do TanStack com os components `lazy` e `Suspense` do React:

```typescript
// src/hooks/form-context.ts
import { createFormHookContexts } from "@tanstack/react-form";

export const { fieldContext, useFieldContext, formContext, useFormContext } =
  createFormHookContexts();
```

```tsx
// src/components/text-field.tsx
import { useFieldContext } from "../hooks/form-context.tsx";

export default function TextField({ label }: { label: string }) {
  const field = useFieldContext<string>();

  return (
    <label>
      <span>{label}</span>
      <input
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
      />
    </label>
  );
}
```

```tsx
// src/hooks/form.ts
import { lazy } from "react";
import { createFormHook } from "@tanstack/react-form";

const TextField = lazy(() => import("../components/text-fields.tsx"));

const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
  },
  formComponents: {},
});
```

```tsx
// src/App.tsx
import { Suspense } from "react";
import { PeoplePage } from "./features/people/form.tsx";

export default function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <PeoplePage />
    </Suspense>
  );
}
```

Isso mostrará o fallback do Suspense enquanto o component `TextField` está sendo carregado, e então renderizará o form quando estiver carregado.

## Juntando tudo

Agora que cobrimos o básico de criar hooks de form personalizados, vamos juntar tudo em um único exemplo.

```tsx
// /src/hooks/form.ts, to be used across the entire app
const { fieldContext, useFieldContext, formContext, useFormContext } =
  createFormHookContexts();

function TextField({ label }: { label: string }) {
  const field = useFieldContext<string>();
  return (
    <label>
      <span>{label}</span>
      <input
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
      />
    </label>
  );
}

function SubscribeButton({ label }: { label: string }) {
  const form = useFormContext();
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => <button disabled={isSubmitting}>{label}</button>}
    </form.Subscribe>
  );
}

const { useAppForm, withForm } = createFormHook({
  fieldComponents: {
    TextField,
  },
  formComponents: {
    SubscribeButton,
  },
  fieldContext,
  formContext,
});

// /src/features/people/shared-form.ts, to be used across `people` features
const formOpts = formOptions({
  defaultValues: {
    firstName: "John",
    lastName: "Doe",
  },
});

// /src/features/people/nested-form.ts, to be used in the `people` page
const ChildForm = withForm({
  ...formOpts,
  // Optional, but adds props to the `render` function outside of `form`
  props: {
    title: "Child Form",
  },
  render: ({ form, title }) => {
    return (
      <div>
        <p>{title}</p>
        <form.AppField
          name="firstName"
          children={(field) => <field.TextField label="First Name" />}
        />
        <form.AppForm>
          <form.SubscribeButton label="Submit" />
        </form.AppForm>
      </div>
    );
  },
});

// /src/features/people/page.ts
const Parent = () => {
  const form = useAppForm({
    ...formOpts,
  });

  return <ChildForm form={form} title={"Testing"} />;
};
```

## Guia de Uso da API

Aqui está um gráfico para ajudá-lo a decidir quais APIs você deve usar:

![](https://raw.githubusercontent.com/TanStack/form/main/docs/assets/react_form_composability.svg)
