---
title: Popover
description: Exibe conteudo rico em um portal, acionado por um botao.
base: radix
component: true
links:
  doc: https://www.radix-ui.com/docs/primitives/components/popover
  api: https://www.radix-ui.com/docs/primitives/components/popover#api-reference
---

```tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function PopoverDemo() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="leading-none font-medium">Dimensions</h4>
            <p className="text-muted-foreground text-sm">
              Set the dimensions for the layer.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="width">Width</Label>
              <Input
                id="width"
                defaultValue="100%"
                className="col-span-2 h-8"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="maxWidth">Max. width</Label>
              <Input
                id="maxWidth"
                defaultValue="300px"
                className="col-span-2 h-8"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="height">Height</Label>
              <Input
                id="height"
                defaultValue="25px"
                className="col-span-2 h-8"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="maxHeight">Max. height</Label>
              <Input
                id="maxHeight"
                defaultValue="none"
                className="col-span-2 h-8"
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
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
npx shadcn@latest add popover
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Instale as seguintes dependencias:</Step>

```bash
npm install radix-ui
```

<Step>Copie e cole o codigo a seguir no seu projeto.</Step>

<ComponentSource
  name="popover"
  title="components/ui/popover.tsx"
  styleName="radix-nova"
/>

<Step>Atualize os caminhos de importacao para corresponder a configuracao do seu projeto.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Uso

```tsx showLineNumbers
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
```

```tsx showLineNumbers
<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">Open Popover</Button>
  </PopoverTrigger>
  <PopoverContent>
    <PopoverHeader>
      <PopoverTitle>Title</PopoverTitle>
      <PopoverDescription>Description text here.</PopoverDescription>
    </PopoverHeader>
  </PopoverContent>
</Popover>
```

## Exemplos

### Basico

Um popover simples com cabecalho, titulo e descricao.

```tsx
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";

export function PopoverBasic() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open Popover</Button>
      </PopoverTrigger>
      <PopoverContent align="start">
        <PopoverHeader>
          <PopoverTitle>Dimensions</PopoverTitle>
          <PopoverDescription>
            Set the dimensions for the layer.
          </PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  );
}
```

### Alinhamento

Use a prop `align` no `PopoverContent` para controlar o alinhamento horizontal.

```tsx
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function PopoverAlignments() {
  return (
    <div className="flex gap-6">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">
            Start
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-40">
          Aligned to start
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">
            Center
          </Button>
        </PopoverTrigger>
        <PopoverContent align="center" className="w-40">
          Aligned to center
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">
            End
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-40">
          Aligned to end
        </PopoverContent>
      </Popover>
    </div>
  );
}
```

### Com Formulario

Um popover com campos de formulario dentro.

```tsx
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";

export function PopoverForm() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open Popover</Button>
      </PopoverTrigger>
      <PopoverContent className="w-64" align="start">
        <PopoverHeader>
          <PopoverTitle>Dimensions</PopoverTitle>
          <PopoverDescription>
            Set the dimensions for the layer.
          </PopoverDescription>
        </PopoverHeader>
        <FieldGroup className="gap-4">
          <Field orientation="horizontal">
            <FieldLabel htmlFor="width" className="w-1/2">
              Width
            </FieldLabel>
            <Input id="width" defaultValue="100%" />
          </Field>
          <Field orientation="horizontal">
            <FieldLabel htmlFor="height" className="w-1/2">
              Height
            </FieldLabel>
            <Input id="height" defaultValue="25px" />
          </Field>
        </FieldGroup>
      </PopoverContent>
    </Popover>
  );
}
```

## RTL

Para habilitar o suporte a RTL no shadcn/ui, consulte o [guia de configuracao RTL](/docs/rtl).

```tsx
"use client";

import { Button } from "@/examples/radix/ui-rtl/button";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/examples/radix/ui-rtl/popover";

import {
  useTranslation,
  type Translations,
} from "@/components/language-selector";

const translations: Translations = {
  en: {
    dir: "ltr",
    values: {
      title: "Dimensions",
      description: "Set the dimensions for the layer.",
      left: "Left",
      top: "Top",
      bottom: "Bottom",
      right: "Right",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      title: "الأبعاد",
      description: "تعيين الأبعاد للطبقة.",
      left: "يسار",
      top: "أعلى",
      bottom: "أسفل",
      right: "يمين",
    },
  },
  he: {
    dir: "rtl",
    values: {
      title: "מימדים",
      description: "הגדר את המימדים לשכבה.",
      left: "שמאל",
      top: "למעלה",
      bottom: "למטה",
      right: "ימין",
    },
  },
};

const physicalSides = ["left", "top", "bottom", "right"] as const;

export function PopoverRtl() {
  const { dir, t } = useTranslation(translations, "ar");

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {physicalSides.map((side) => (
        <Popover key={side}>
          <PopoverTrigger asChild>
            <Button variant="outline">{t[side]}</Button>
          </PopoverTrigger>
          <PopoverContent side={side} dir={dir}>
            <PopoverHeader>
              <PopoverTitle>{t.title}</PopoverTitle>
              <PopoverDescription>{t.description}</PopoverDescription>
            </PopoverHeader>
          </PopoverContent>
        </Popover>
      ))}
    </div>
  );
}
```

## Referencia da API

Consulte a documentacao do [Radix UI Popover](https://www.radix-ui.com/docs/primitives/components/popover#api-reference).
