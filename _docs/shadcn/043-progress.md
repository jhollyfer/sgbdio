---
title: Progress
description: Exibe um indicador mostrando o progresso de conclusão de uma tarefa, tipicamente exibido como uma barra de progresso.
base: radix
component: true
links:
  doc: https://www.radix-ui.com/docs/primitives/components/progress
  api: https://www.radix-ui.com/docs/primitives/components/progress#api-reference
---

```tsx
"use client";

import * as React from "react";
import { Progress } from "@/components/ui/progress";

export function ProgressDemo() {
  const [progress, setProgress] = React.useState(13);

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, []);

  return <Progress value={progress} className="w-[60%]" />;
}
```

## Instalação

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Comando</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add progress
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Instale as seguintes dependências:</Step>

```bash
npm install radix-ui
```

<Step>Copie e cole o código a seguir no seu projeto.</Step>

<ComponentSource
  name="progress"
  title="components/ui/progress.tsx"
  styleName="radix-nova"
/>

<Step>Atualize os caminhos de importação para corresponder à configuração do seu projeto.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Uso

```tsx showLineNumbers
import { Progress } from "@/components/ui/progress";
```

```tsx showLineNumbers
<Progress value={33} />
```

## Exemplos

### Label

Use um component `Field` para adicionar um label à barra de progresso.

```tsx
import { Field, FieldLabel } from "@/components/ui/field";
import { Progress } from "@/components/ui/progress";

export function ProgressWithLabel() {
  return (
    <Field className="w-full max-w-sm">
      <FieldLabel htmlFor="progress-upload">
        <span>Upload progress</span>
        <span className="ml-auto">66%</span>
      </FieldLabel>
      <Progress value={66} id="progress-upload" />
    </Field>
  );
}
```

### Controlado

Uma barra de progresso que pode ser controlada por um slider.

```tsx
"use client";

import * as React from "react";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";

export function ProgressControlled() {
  const [value, setValue] = React.useState([50]);

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Progress value={value[0]} />
      <Slider
        value={value}
        onValueChange={setValue}
        min={0}
        max={100}
        step={1}
      />
    </div>
  );
}
```

## RTL

Para habilitar o suporte a RTL no shadcn/ui, consulte o [guia de configuração RTL](/docs/rtl).

```tsx
"use client";

import * as React from "react";
import { Field, FieldLabel } from "@/examples/radix/ui-rtl/field";
import { Progress } from "@/examples/radix/ui-rtl/progress";

import {
  useTranslation,
  type Translations,
} from "@/components/language-selector";

const translations: Translations = {
  en: {
    dir: "ltr",
    values: {
      label: "Upload progress",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      label: "تقدم الرفع",
    },
  },
  he: {
    dir: "rtl",
    values: {
      label: "התקדמות העלאה",
    },
  },
};

function toArabicNumerals(num: number): string {
  const arabicNumerals = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return num
    .toString()
    .split("")
    .map((digit) => arabicNumerals[parseInt(digit, 10)])
    .join("");
}

export function ProgressRtl() {
  const { dir, t, language } = useTranslation(translations, "ar");

  const formatNumber = (num: number): string => {
    if (language === "ar") {
      return toArabicNumerals(num);
    }
    return num.toString();
  };

  return (
    <Field className="w-full max-w-sm" dir={dir}>
      <FieldLabel htmlFor="progress-upload">
        <span>{t.label}</span>
        <span className="ms-auto">{formatNumber(66)}%</span>
      </FieldLabel>
      <Progress value={66} id="progress-upload" className="rtl:rotate-180" />
    </Field>
  );
}
```

## Referência da API

Consulte a documentação do [Radix UI Progress](https://www.radix-ui.com/docs/primitives/components/progress#api-reference).
