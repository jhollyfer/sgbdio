---
title: Textarea
description: Exibe um textarea de formulario ou um component que se parece com um textarea.
base: radix
component: true
---

```tsx
import { Textarea } from "@/components/ui/textarea";

export function TextareaDemo() {
  return <Textarea placeholder="Type your message here." />;
}
```

## Instalacao

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Comando</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add textarea
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Copie e cole o seguinte codigo no seu projeto.</Step>

<ComponentSource
  name="textarea"
  title="components/ui/textarea.tsx"
  styleName="radix-nova"
/>

<Step>Atualize os caminhos de importacao para corresponder a configuracao do seu projeto.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Uso

```tsx
import { Textarea } from "@/components/ui/textarea";
```

```tsx
<Textarea />
```

## Exemplos

### Campo

Use `Field`, `FieldLabel` e `FieldDescription` para criar um textarea com um label e uma descricao.

```tsx
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

export function TextareaField() {
  return (
    <Field>
      <FieldLabel htmlFor="textarea-message">Message</FieldLabel>
      <FieldDescription>Enter your message below.</FieldDescription>
      <Textarea id="textarea-message" placeholder="Type your message here." />
    </Field>
  );
}
```

### Desabilitado

Use a prop `disabled` para desabilitar o textarea. Para estilizar o state desabilitado, adicione o atributo `data-disabled` ao component `Field`.

```tsx
import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

export function TextareaDisabled() {
  return (
    <Field data-disabled>
      <FieldLabel htmlFor="textarea-disabled">Message</FieldLabel>
      <Textarea
        id="textarea-disabled"
        placeholder="Type your message here."
        disabled
      />
    </Field>
  );
}
```

### Invalido

Use a prop `aria-invalid` para marcar o textarea como invalido. Para estilizar o state invalido, adicione o atributo `data-invalid` ao component `Field`.

```tsx
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

export function TextareaInvalid() {
  return (
    <Field data-invalid>
      <FieldLabel htmlFor="textarea-invalid">Message</FieldLabel>
      <Textarea
        id="textarea-invalid"
        placeholder="Type your message here."
        aria-invalid
      />
      <FieldDescription>Please enter a valid message.</FieldDescription>
    </Field>
  );
}
```

### Botao

Combine com `Button` para criar um textarea com um botao de envio.

```tsx
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function TextareaButton() {
  return (
    <div className="grid w-full gap-2">
      <Textarea placeholder="Type your message here." />
      <Button>Send message</Button>
    </div>
  );
}
```

## RTL

Para habilitar o suporte RTL no shadcn/ui, consulte o [guia de configuracao RTL](/docs/rtl).

```tsx
"use client";

import * as React from "react";
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/examples/radix/ui-rtl/field";
import { Textarea } from "@/examples/radix/ui-rtl/textarea";

import {
  useTranslation,
  type Translations,
} from "@/components/language-selector";

const translations: Translations = {
  en: {
    dir: "ltr",
    values: {
      label: "Feedback",
      placeholder: "Your feedback helps us improve...",
      description: "Share your thoughts about our service.",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      label: "التعليقات",
      placeholder: "تعليقاتك تساعدنا على التحسين...",
      description: "شاركنا أفكارك حول خدمتنا.",
    },
  },
  he: {
    dir: "rtl",
    values: {
      label: "משוב",
      placeholder: "המשוב שלך עוזר לנו להשתפר...",
      description: "שתף את מחשבותיך על השירות שלנו.",
    },
  },
};

export function TextareaRtl() {
  const { dir, t } = useTranslation(translations, "ar");

  return (
    <Field className="w-full max-w-xs" dir={dir}>
      <FieldLabel htmlFor="feedback" dir={dir}>
        {t.label}
      </FieldLabel>
      <Textarea id="feedback" placeholder={t.placeholder} dir={dir} rows={4} />
      <FieldDescription dir={dir}>{t.description}</FieldDescription>
    </Field>
  );
}
```
