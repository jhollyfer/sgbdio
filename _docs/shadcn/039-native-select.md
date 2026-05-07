---
title: Native Select
description: Um elemento select HTML nativo estilizado com integracao consistente ao sistema de design.
base: radix
component: true
---

import { InfoIcon } from "lucide-react"

<Callout variant="info" icon={<InfoIcon className="!translate-y-[3px]" />}>
Para um component select estilizado, consulte o component [Select](/docs/components/select).
</Callout>

```tsx
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";

export function NativeSelectDemo() {
  return (
    <NativeSelect>
      <NativeSelectOption value="">Select status</NativeSelectOption>
      <NativeSelectOption value="todo">Todo</NativeSelectOption>
      <NativeSelectOption value="in-progress">In Progress</NativeSelectOption>
      <NativeSelectOption value="done">Done</NativeSelectOption>
      <NativeSelectOption value="cancelled">Cancelled</NativeSelectOption>
    </NativeSelect>
  );
}
```

## Instalacao

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add native-select
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Copie e cole o codigo a seguir no seu projeto.</Step>

<ComponentSource
  name="native-select"
  title="components/ui/native-select.tsx"
  styleName="radix-nova"
/>

<Step>Atualize os caminhos de importacao para corresponder a configuracao do seu projeto.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Uso

```tsx showLineNumbers
import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "@/components/ui/native-select";
```

```tsx showLineNumbers
<NativeSelect>
  <NativeSelectOption value="">Select a fruit</NativeSelectOption>
  <NativeSelectOption value="apple">Apple</NativeSelectOption>
  <NativeSelectOption value="banana">Banana</NativeSelectOption>
  <NativeSelectOption value="blueberry">Blueberry</NativeSelectOption>
  <NativeSelectOption value="pineapple">Pineapple</NativeSelectOption>
</NativeSelect>
```

## Exemplos

### Grupos

Use `NativeSelectOptGroup` para organizar opcoes em categorias.

```tsx
import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "@/components/ui/native-select";

export function NativeSelectGroups() {
  return (
    <NativeSelect>
      <NativeSelectOption value="">Select department</NativeSelectOption>
      <NativeSelectOptGroup label="Engineering">
        <NativeSelectOption value="frontend">Frontend</NativeSelectOption>
        <NativeSelectOption value="backend">Backend</NativeSelectOption>
        <NativeSelectOption value="devops">DevOps</NativeSelectOption>
      </NativeSelectOptGroup>
      <NativeSelectOptGroup label="Sales">
        <NativeSelectOption value="sales-rep">Sales Rep</NativeSelectOption>
        <NativeSelectOption value="account-manager">
          Account Manager
        </NativeSelectOption>
        <NativeSelectOption value="sales-director">
          Sales Director
        </NativeSelectOption>
      </NativeSelectOptGroup>
      <NativeSelectOptGroup label="Operations">
        <NativeSelectOption value="support">
          Customer Support
        </NativeSelectOption>
        <NativeSelectOption value="product-manager">
          Product Manager
        </NativeSelectOption>
        <NativeSelectOption value="ops-manager">
          Operations Manager
        </NativeSelectOption>
      </NativeSelectOptGroup>
    </NativeSelect>
  );
}
```

### Desabilitado

Adicione a prop `disabled` ao component `NativeSelect` para desabilitar o select.

```tsx
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";

export function NativeSelectDisabled() {
  return (
    <NativeSelect disabled>
      <NativeSelectOption value="">Disabled</NativeSelectOption>
      <NativeSelectOption value="apple">Apple</NativeSelectOption>
      <NativeSelectOption value="banana">Banana</NativeSelectOption>
      <NativeSelectOption value="blueberry">Blueberry</NativeSelectOption>
    </NativeSelect>
  );
}
```

### Invalido

Use `aria-invalid` para exibir erros de validacao e o atributo `data-invalid` no component `Field` para estilizacao.

```tsx
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";

export function NativeSelectInvalid() {
  return (
    <NativeSelect aria-invalid="true">
      <NativeSelectOption value="">Error state</NativeSelectOption>
      <NativeSelectOption value="apple">Apple</NativeSelectOption>
      <NativeSelectOption value="banana">Banana</NativeSelectOption>
      <NativeSelectOption value="blueberry">Blueberry</NativeSelectOption>
    </NativeSelect>
  );
}
```

## Native Select vs Select

- Use `NativeSelect` para comportamento nativo do navegador, melhor desempenho ou dropdowns otimizados para mobile.
- Use `Select` para estilizacao personalizada, animacoes ou interacoes complexas.

## RTL

Para habilitar o suporte a RTL no shadcn/ui, consulte o [guia de configuracao RTL](/docs/rtl).

```tsx
"use client";

import * as React from "react";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/examples/radix/ui-rtl/native-select";

import {
  useTranslation,
  type Translations,
} from "@/components/language-selector";

const translations: Translations = {
  en: {
    dir: "ltr",
    values: {
      placeholder: "Select status",
      todo: "Todo",
      inProgress: "In Progress",
      done: "Done",
      cancelled: "Cancelled",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      placeholder: "اختر الحالة",
      todo: "مهام",
      inProgress: "قيد التنفيذ",
      done: "منجز",
      cancelled: "ملغي",
    },
  },
  he: {
    dir: "rtl",
    values: {
      placeholder: "בחר סטטוס",
      todo: "לעשות",
      inProgress: "בתהליך",
      done: "הושלם",
      cancelled: "בוטל",
    },
  },
};

export function NativeSelectRtl() {
  const { dir, t } = useTranslation(translations, "ar");

  return (
    <NativeSelect dir={dir}>
      <NativeSelectOption value="">{t.placeholder}</NativeSelectOption>
      <NativeSelectOption value="todo">{t.todo}</NativeSelectOption>
      <NativeSelectOption value="in-progress">
        {t.inProgress}
      </NativeSelectOption>
      <NativeSelectOption value="done">{t.done}</NativeSelectOption>
      <NativeSelectOption value="cancelled">{t.cancelled}</NativeSelectOption>
    </NativeSelect>
  );
}
```

## Referencia da API

### NativeSelect

O component select principal que envolve o elemento select HTML nativo.

```tsx
<NativeSelect>
  <NativeSelectOption value="option1">Option 1</NativeSelectOption>
  <NativeSelectOption value="option2">Option 2</NativeSelectOption>
</NativeSelect>
```

### NativeSelectOption

Representa uma opcao individual dentro do select.

| Prop       | Type      | Default |
| ---------- | --------- | ------- |
| `value`    | `string`  |         |
| `disabled` | `boolean` | `false` |

### NativeSelectOptGroup

Agrupa opcoes relacionadas para melhor organizacao.

| Prop       | Type      | Default |
| ---------- | --------- | ------- |
| `label`    | `string`  |         |
| `disabled` | `boolean` | `false` |

```tsx
<NativeSelectOptGroup label="Fruits">
  <NativeSelectOption value="apple">Apple</NativeSelectOption>
  <NativeSelectOption value="banana">Banana</NativeSelectOption>
</NativeSelectOptGroup>
```
