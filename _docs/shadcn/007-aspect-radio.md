---
title: Aspect Ratio
description: Exibe conteudo dentro de uma proporcao desejada.
base: radix
component: true
links:
  doc: https://www.radix-ui.com/primitives/docs/components/aspect-ratio
  api: https://www.radix-ui.com/primitives/docs/components/aspect-ratio#api-reference
---

```tsx
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export function AspectRatioDemo() {
  return (
    <div className="w-full max-w-sm">
      <AspectRatio ratio={16 / 9} className="bg-muted rounded-lg">
        <Image
          src="https://avatar.vercel.sh/shadcn1"
          alt="Photo"
          fill
          className="w-full rounded-lg object-cover grayscale dark:brightness-20"
        />
      </AspectRatio>
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
npx shadcn@latest add aspect-ratio
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
  name="aspect-ratio"
  title="components/ui/aspect-ratio.tsx"
  styleName="radix-nova"
/>

<Step>Atualize os caminhos de importacao para corresponder a configuracao do seu projeto.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Uso

```tsx showLineNumbers
import { AspectRatio } from "@/components/ui/aspect-ratio";
```

```tsx showLineNumbers
<AspectRatio ratio={16 / 9}>
  <Image src="..." alt="Image" className="rounded-md object-cover" />
</AspectRatio>
```

## Exemplos

### Quadrado

Um component de proporcao quadrada usando a prop `ratio={1 / 1}`. Isso e util para exibir imagens em formato quadrado.

```tsx
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export function AspectRatioSquare() {
  return (
    <div className="w-full max-w-[12rem]">
      <AspectRatio ratio={1 / 1} className="bg-muted rounded-lg">
        <Image
          src="https://avatar.vercel.sh/shadcn1"
          alt="Photo"
          fill
          className="rounded-lg object-cover grayscale dark:brightness-20"
        />
      </AspectRatio>
    </div>
  );
}
```

### Retrato

Um component de proporcao retrato usando a prop `ratio={9 / 16}`. Isso e util para exibir imagens em formato retrato.

```tsx
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export function AspectRatioPortrait() {
  return (
    <div className="w-full max-w-[10rem]">
      <AspectRatio ratio={9 / 16} className="bg-muted rounded-lg">
        <Image
          src="https://avatar.vercel.sh/shadcn1"
          alt="Photo"
          fill
          className="rounded-lg object-cover grayscale dark:brightness-20"
        />
      </AspectRatio>
    </div>
  );
}
```

## RTL

Para habilitar o suporte RTL no shadcn/ui, consulte o [guia de configuracao RTL](/docs/rtl).

```tsx
"use client";

import * as React from "react";
import Image from "next/image";
import { AspectRatio } from "@/examples/radix/ui-rtl/aspect-ratio";

import {
  useTranslation,
  type Translations,
} from "@/components/language-selector";

const translations: Translations = {
  en: {
    dir: "ltr",
    values: {
      caption: "Beautiful landscape",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      caption: "منظر طبيعي جميل",
    },
  },
  he: {
    dir: "rtl",
    values: {
      caption: "נוף יפה",
    },
  },
};

export function AspectRatioRtl() {
  const { dir, t } = useTranslation(translations, "ar");

  return (
    <figure className="w-full max-w-sm" dir={dir}>
      <AspectRatio ratio={16 / 9} className="bg-muted rounded-lg">
        <Image
          src="https://avatar.vercel.sh/shadcn1"
          alt="Photo"
          fill
          className="w-full rounded-lg object-cover grayscale dark:brightness-20"
        />
      </AspectRatio>
      <figcaption className="text-muted-foreground mt-2 text-center text-sm">
        {t.caption}
      </figcaption>
    </figure>
  );
}
```

## Referencia da API

### AspectRatio

O component `AspectRatio` exibe conteudo dentro de uma proporcao desejada.

| Prop        | Type     | Default | Obrigatorio |
| ----------- | -------- | ------- | ----------- |
| `ratio`     | `number` | -       | Sim         |
| `className` | `string` | -       | Nao         |

Para mais informacoes, consulte a [documentacao do Radix UI](https://www.radix-ui.com/primitives/docs/components/aspect-ratio#api-reference).
