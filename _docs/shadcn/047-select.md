---
title: Select
description: Exibe uma lista de opções para o usuário escolher — acionada por um botão.
base: radix
component: true
featured: true
links:
  doc: https://www.radix-ui.com/docs/primitives/components/select
  api: https://www.radix-ui.com/docs/primitives/components/select#api-reference
---

```tsx
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SelectDemo() {
  return (
    <Select>
      <SelectTrigger className="w-full max-w-48">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="blueberry">Blueberry</SelectItem>
          <SelectItem value="grapes">Grapes</SelectItem>
          <SelectItem value="pineapple">Pineapple</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
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
npx shadcn@latest add select
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
  name="select"
  title="components/ui/select.tsx"
  styleName="radix-nova"
/>

<Step>Atualize os caminhos de importação para corresponder à configuração do seu projeto.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Uso

```tsx showLineNumbers
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
```

```tsx showLineNumbers
<Select>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Theme" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectItem value="light">Light</SelectItem>
      <SelectItem value="dark">Dark</SelectItem>
      <SelectItem value="system">System</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>
```

## Exemplos

### Alinhar Item com o Trigger

Use a prop `position` no `SelectContent` para controlar o alinhamento. Quando `position="item-aligned"` (padrão), o popup se posiciona para que o item selecionado apareça sobre o trigger. Quando `position="popper"`, o popup se alinha à borda do trigger.

```tsx
"use client";

import * as React from "react";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export function SelectAlignItem() {
  const [alignItemWithTrigger, setAlignItemWithTrigger] = React.useState(true);

  return (
    <FieldGroup className="w-full max-w-xs">
      <Field orientation="horizontal">
        <FieldContent>
          <FieldLabel htmlFor="align-item">Align Item</FieldLabel>
          <FieldDescription>
            Toggle to align the item with the trigger.
          </FieldDescription>
        </FieldContent>
        <Switch
          id="align-item"
          checked={alignItemWithTrigger}
          onCheckedChange={setAlignItemWithTrigger}
        />
      </Field>
      <Field>
        <Select defaultValue="banana">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent
            position={alignItemWithTrigger ? "item-aligned" : "popper"}
          >
            <SelectGroup>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="blueberry">Blueberry</SelectItem>
              <SelectItem value="grapes">Grapes</SelectItem>
              <SelectItem value="pineapple">Pineapple</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
    </FieldGroup>
  );
}
```

### Grupos

Use `SelectGroup`, `SelectLabel` e `SelectSeparator` para organizar os itens.

```tsx
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SelectGroups() {
  return (
    <Select>
      <SelectTrigger className="w-full max-w-48">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="blueberry">Blueberry</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Vegetables</SelectLabel>
          <SelectItem value="carrot">Carrot</SelectItem>
          <SelectItem value="broccoli">Broccoli</SelectItem>
          <SelectItem value="spinach">Spinach</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
```

### Com Scroll

Um select com muitos itens que permite scroll.

```tsx
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SelectScrollable() {
  return (
    <Select>
      <SelectTrigger className="w-full max-w-64">
        <SelectValue placeholder="Select a timezone" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>North America</SelectLabel>
          <SelectItem value="est">Eastern Standard Time</SelectItem>
          <SelectItem value="cst">Central Standard Time</SelectItem>
          <SelectItem value="mst">Mountain Standard Time</SelectItem>
          <SelectItem value="pst">Pacific Standard Time</SelectItem>
          <SelectItem value="akst">Alaska Standard Time</SelectItem>
          <SelectItem value="hst">Hawaii Standard Time</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Europe & Africa</SelectLabel>
          <SelectItem value="gmt">Greenwich Mean Time</SelectItem>
          <SelectItem value="cet">Central European Time</SelectItem>
          <SelectItem value="eet">Eastern European Time</SelectItem>
          <SelectItem value="west">Western European Summer Time</SelectItem>
          <SelectItem value="cat">Central Africa Time</SelectItem>
          <SelectItem value="eat">East Africa Time</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Asia</SelectLabel>
          <SelectItem value="msk">Moscow Time</SelectItem>
          <SelectItem value="ist">India Standard Time</SelectItem>
          <SelectItem value="cst_china">China Standard Time</SelectItem>
          <SelectItem value="jst">Japan Standard Time</SelectItem>
          <SelectItem value="kst">Korea Standard Time</SelectItem>
          <SelectItem value="ist_indonesia">
            Indonesia Central Standard Time
          </SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Australia & Pacific</SelectLabel>
          <SelectItem value="awst">Australian Western Standard Time</SelectItem>
          <SelectItem value="acst">Australian Central Standard Time</SelectItem>
          <SelectItem value="aest">Australian Eastern Standard Time</SelectItem>
          <SelectItem value="nzst">New Zealand Standard Time</SelectItem>
          <SelectItem value="fjt">Fiji Time</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>South America</SelectLabel>
          <SelectItem value="art">Argentina Time</SelectItem>
          <SelectItem value="bot">Bolivia Time</SelectItem>
          <SelectItem value="brt">Brasilia Time</SelectItem>
          <SelectItem value="clt">Chile Standard Time</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
```

### Desabilitado

```tsx
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SelectDisabled() {
  return (
    <Select disabled>
      <SelectTrigger className="w-full max-w-48">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="blueberry">Blueberry</SelectItem>
          <SelectItem value="grapes" disabled>
            Grapes
          </SelectItem>
          <SelectItem value="pineapple">Pineapple</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
```

### Inválido

Adicione o atributo `data-invalid` ao component `Field` e o atributo `aria-invalid` ao component `SelectTrigger` para mostrar um estado de erro.

```tsx showLineNumbers /data-invalid/ /aria-invalid/
<Field data-invalid>
  <FieldLabel>Fruit</FieldLabel>
  <SelectTrigger aria-invalid>
    <SelectValue />
  </SelectTrigger>
</Field>
```

```tsx
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SelectInvalid() {
  return (
    <Field data-invalid className="w-full max-w-48">
      <FieldLabel>Fruit</FieldLabel>
      <Select>
        <SelectTrigger aria-invalid>
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectItem value="blueberry">Blueberry</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <FieldError>Please select a fruit.</FieldError>
    </Field>
  );
}
```

## RTL

Para habilitar o suporte a RTL no shadcn/ui, consulte o [guia de configuração RTL](/docs/rtl).

```tsx
"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/examples/radix/ui-rtl/select";

import {
  useTranslation,
  type Translations,
} from "@/components/language-selector";

const translations: Translations = {
  en: {
    dir: "ltr",
    values: {
      selectFruit: "Select a fruit",
      fruits: "Fruits",
      apple: "Apple",
      banana: "Banana",
      blueberry: "Blueberry",
      grapes: "Grapes",
      pineapple: "Pineapple",
      vegetables: "Vegetables",
      carrot: "Carrot",
      broccoli: "Broccoli",
      spinach: "Spinach",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      selectFruit: "اختر فاكهة",
      fruits: "الفواكه",
      apple: "تفاح",
      banana: "موز",
      blueberry: "توت أزرق",
      grapes: "عنب",
      pineapple: "أناناس",
      vegetables: "الخضروات",
      carrot: "جزر",
      broccoli: "بروكلي",
      spinach: "سبانخ",
    },
  },
  he: {
    dir: "rtl",
    values: {
      selectFruit: "בחר פרי",
      fruits: "פירות",
      apple: "תפוח",
      banana: "בננה",
      blueberry: "אוכמניה",
      grapes: "ענבים",
      pineapple: "אננס",
      vegetables: "ירקות",
      carrot: "גזר",
      broccoli: "ברוקולי",
      spinach: "תרד",
    },
  },
};

export function SelectRtl() {
  const { dir, t, language } = useTranslation(translations, "ar");
  const [selectedFruit, setSelectedFruit] = React.useState<string>("");

  const fruits = [
    { label: t.apple, value: "apple" },
    { label: t.banana, value: "banana" },
    { label: t.blueberry, value: "blueberry" },
    { label: t.grapes, value: "grapes" },
    { label: t.pineapple, value: "pineapple" },
  ];

  const vegetables = [
    { label: t.carrot, value: "carrot" },
    { label: t.broccoli, value: "broccoli" },
    { label: t.spinach, value: "spinach" },
  ];

  return (
    <Select value={selectedFruit} onValueChange={setSelectedFruit}>
      <SelectTrigger className="w-32" dir={dir}>
        <SelectValue placeholder={t.selectFruit} />
      </SelectTrigger>
      <SelectContent dir={dir} data-lang={dir === "rtl" ? language : undefined}>
        <SelectGroup>
          <SelectLabel>{t.fruits}</SelectLabel>
          {fruits.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>{t.vegetables}</SelectLabel>
          {vegetables.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
```

## Referência da API

Consulte a documentação do [Radix UI Select](https://www.radix-ui.com/docs/primitives/components/select#api-reference).
