---
title: Badge
description: Exibe um badge ou um component que se parece com um badge.
base: radix
component: true
---

```tsx
import { Badge } from "@/components/ui/badge";

export function BadgeDemo() {
  return (
    <div className="flex w-full flex-wrap justify-center gap-2">
      <Badge>Badge</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
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
npx shadcn@latest add badge
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Copie e cole o codigo a seguir no seu projeto.</Step>

<ComponentSource name="badge" title="components/ui/badge.tsx" />

<Step>Atualize os caminhos de importacao para corresponder a configuracao do seu projeto.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Uso

```tsx
import { Badge } from "@/components/ui/badge";
```

```tsx
<Badge variant="default | outline | secondary | destructive">Badge</Badge>
```

## Exemplos

### Variantes

Use a prop `variant` para alterar a variante do badge.

```tsx
import { Badge } from "@/components/ui/badge";

export function BadgeVariants() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="ghost">Ghost</Badge>
    </div>
  );
}
```

### Com Icone

Voce pode renderizar um icone dentro do badge. Use `data-icon="inline-start"` para renderizar o icone a esquerda e `data-icon="inline-end"` para renderizar o icone a direita.

```tsx
import { Badge } from "@/components/ui/badge";
import { BadgeCheck, BookmarkIcon } from "lucide-react";

export function BadgeWithIconLeft() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge variant="secondary">
        <BadgeCheck data-icon="inline-start" />
        Verified
      </Badge>
      <Badge variant="outline">
        Bookmark
        <BookmarkIcon data-icon="inline-end" />
      </Badge>
    </div>
  );
}
```

### Com Spinner

Voce pode renderizar um spinner dentro do badge. Lembre-se de adicionar a prop `data-icon="inline-start"` ou `data-icon="inline-end"` ao spinner.

```tsx
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";

export function BadgeWithSpinner() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge variant="destructive">
        <Spinner data-icon="inline-start" />
        Deleting
      </Badge>
      <Badge variant="secondary">
        Generating
        <Spinner data-icon="inline-end" />
      </Badge>
    </div>
  );
}
```

### Link

Use a prop `asChild` para renderizar um link como badge.

```tsx
import { Badge } from "@/components/ui/badge";
import { ArrowUpRightIcon } from "lucide-react";

export function BadgeAsLink() {
  return (
    <Badge asChild>
      <a href="#link">
        Open Link <ArrowUpRightIcon data-icon="inline-end" />
      </a>
    </Badge>
  );
}
```

### Cores Personalizadas

Voce pode personalizar as cores de um badge adicionando classes customizadas como `bg-green-50 dark:bg-green-800` ao component `Badge`.

```tsx
import { Badge } from "@/components/ui/badge";

export function BadgeCustomColors() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
        Blue
      </Badge>
      <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
        Green
      </Badge>
      <Badge className="bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
        Sky
      </Badge>
      <Badge className="bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
        Purple
      </Badge>
      <Badge className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300">
        Red
      </Badge>
    </div>
  );
}
```

## RTL

Para habilitar o suporte RTL no shadcn/ui, consulte o [guia de configuracao RTL](/docs/rtl).

```tsx
"use client";

import * as React from "react";
import { Badge } from "@/examples/radix/ui-rtl/badge";
import { BadgeCheck, BookmarkIcon } from "lucide-react";

import {
  useTranslation,
  type Translations,
} from "@/components/language-selector";

const translations: Translations = {
  en: {
    dir: "ltr",
    values: {
      badge: "Badge",
      secondary: "Secondary",
      destructive: "Destructive",
      outline: "Outline",
      verified: "Verified",
      bookmark: "Bookmark",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      badge: "شارة",
      secondary: "ثانوي",
      destructive: "مدمر",
      outline: "مخطط",
      verified: "متحقق",
      bookmark: "إشارة مرجعية",
    },
  },
  he: {
    dir: "rtl",
    values: {
      badge: "תג",
      secondary: "משני",
      destructive: "הרסני",
      outline: "קווי מתאר",
      verified: "מאומת",
      bookmark: "סימנייה",
    },
  },
};

export function BadgeRtl() {
  const { dir, t } = useTranslation(translations, "ar");

  return (
    <div className="flex w-full flex-wrap justify-center gap-2" dir={dir}>
      <Badge>{t.badge}</Badge>
      <Badge variant="secondary">{t.secondary}</Badge>
      <Badge variant="destructive">{t.destructive}</Badge>
      <Badge variant="outline">{t.outline}</Badge>
      <Badge variant="secondary">
        <BadgeCheck data-icon="inline-start" />
        {t.verified}
      </Badge>
      <Badge variant="outline">
        {t.bookmark}
        <BookmarkIcon data-icon="inline-end" />
      </Badge>
    </div>
  );
}
```

## Referencia da API

### Badge

O component `Badge` exibe um badge ou um component que se parece com um badge.

| Prop        | Type                                                                          | Default     |
| ----------- | ----------------------------------------------------------------------------- | ----------- |
| `variant`   | `"default" \| "secondary" \| "destructive" \| "outline" \| "ghost" \| "link"` | `"default"` |
| `className` | `string`                                                                      | -           |
