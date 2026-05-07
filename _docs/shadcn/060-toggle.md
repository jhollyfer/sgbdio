---
title: Toggle
description: Um botao de dois estados que pode estar ligado ou desligado.
base: radix
component: true
links:
  doc: https://www.radix-ui.com/docs/primitives/components/toggle
  api: https://www.radix-ui.com/docs/primitives/components/toggle#api-reference
---

```tsx
import { Toggle } from "@/components/ui/toggle";
import { BookmarkIcon } from "lucide-react";

export function ToggleDemo() {
  return (
    <Toggle aria-label="Toggle bookmark" size="sm" variant="outline">
      <BookmarkIcon className="group-data-[state=on]/toggle:fill-foreground" />
      Bookmark
    </Toggle>
  );
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
npx shadcn@latest add toggle
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Instale as seguintes dependencias:</Step>

```bash
npm install radix-ui
```

<Step>Copie e cole o seguinte codigo no seu projeto.</Step>

<ComponentSource
  name="toggle"
  title="components/ui/toggle.tsx"
  styleName="radix-nova"
/>

<Step>Atualize os caminhos de importacao para corresponder a configuracao do seu projeto.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Uso

```tsx
import { Toggle } from "@/components/ui/toggle";
```

```tsx
<Toggle>Toggle</Toggle>
```

## Exemplos

### Outline

Use `variant="outline"` para um estilo outline.

```tsx
import { Toggle } from "@/components/ui/toggle";
import { BoldIcon, ItalicIcon } from "lucide-react";

export function ToggleOutline() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Toggle variant="outline" aria-label="Toggle italic">
        <ItalicIcon />
        Italic
      </Toggle>
      <Toggle variant="outline" aria-label="Toggle bold">
        <BoldIcon />
        Bold
      </Toggle>
    </div>
  );
}
```

### Com Texto

```tsx
import { Toggle } from "@/components/ui/toggle";
import { ItalicIcon } from "lucide-react";

export function ToggleText() {
  return (
    <Toggle aria-label="Toggle italic">
      <ItalicIcon />
      Italic
    </Toggle>
  );
}
```

### Tamanho

Use a prop `size` para alterar o tamanho do toggle.

```tsx
import { Toggle } from "@/components/ui/toggle";

export function ToggleSizes() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Toggle variant="outline" aria-label="Toggle small" size="sm">
        Small
      </Toggle>
      <Toggle variant="outline" aria-label="Toggle default" size="default">
        Default
      </Toggle>
      <Toggle variant="outline" aria-label="Toggle large" size="lg">
        Large
      </Toggle>
    </div>
  );
}
```

### Desabilitado

```tsx
import { Toggle } from "@/components/ui/toggle";

export function ToggleDisabled() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Toggle aria-label="Toggle disabled" disabled>
        Disabled
      </Toggle>
      <Toggle variant="outline" aria-label="Toggle disabled outline" disabled>
        Disabled
      </Toggle>
    </div>
  );
}
```

## RTL

Para habilitar o suporte RTL no shadcn/ui, consulte o [guia de configuracao RTL](/docs/rtl).

```tsx
"use client";

import * as React from "react";
import { Toggle } from "@/examples/radix/ui-rtl/toggle";
import { BookmarkIcon } from "lucide-react";

import {
  useTranslation,
  type Translations,
} from "@/components/language-selector";

const translations: Translations = {
  en: {
    dir: "ltr",
    values: {
      label: "Bookmark",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      label: "إشارة مرجعية",
    },
  },
  he: {
    dir: "rtl",
    values: {
      label: "סימנייה",
    },
  },
};

export function ToggleRtl() {
  const { dir, t } = useTranslation(translations, "ar");

  return (
    <Toggle aria-label="Toggle bookmark" size="sm" variant="outline" dir={dir}>
      <BookmarkIcon className="group-aria-pressed/toggle:fill-foreground" />
      {t.label}
    </Toggle>
  );
}
```

## Referencia da API

Consulte a documentacao do [Radix Toggle](https://www.radix-ui.com/docs/primitives/components/toggle#api-reference).
