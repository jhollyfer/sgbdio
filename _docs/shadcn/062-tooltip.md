---
title: Tooltip
description: Um popup que exibe informacoes relacionadas a um elemento quando o elemento recebe foco do teclado ou o mouse passa sobre ele.
base: radix
component: true
links:
  doc: https://www.radix-ui.com/docs/primitives/components/tooltip
  api: https://www.radix-ui.com/docs/primitives/components/tooltip#api-reference
---

```tsx
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function TooltipDemo() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Add to library</p>
      </TooltipContent>
    </Tooltip>
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

<Steps className="mb-0 pt-2">

<Step>Execute o seguinte comando:</Step>

```bash
npx shadcn@latest add tooltip
```

<Step>Adicione o `TooltipProvider` na raiz da sua aplicacao.</Step>

```tsx title="app/layout.tsx" showLineNumbers {1,7}
import { TooltipProvider } from "@/components/ui/tooltip";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
```

</Steps>

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Instale as seguintes dependencias:</Step>

```bash
npm install radix-ui
```

<Step>Copie e cole o seguinte codigo no seu projeto.</Step>

<ComponentSource
  name="tooltip"
  title="components/ui/tooltip.tsx"
  styleName="radix-nova"
/>

<Step>Atualize os caminhos de importacao para corresponder a configuracao do seu projeto.</Step>

<Step>Adicione o `TooltipProvider` na raiz da sua aplicacao.</Step>

```tsx title="app/layout.tsx" showLineNumbers {1,7}
import { TooltipProvider } from "@/components/ui/tooltip";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
```

</Steps>

</TabsContent>

</CodeTabs>

## Uso

```tsx showLineNumbers
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
```

```tsx showLineNumbers
<Tooltip>
  <TooltipTrigger>Hover</TooltipTrigger>
  <TooltipContent>
    <p>Add to library</p>
  </TooltipContent>
</Tooltip>
```

## Exemplos

### Lado

Use a prop `side` para alterar a posicao do tooltip.

```tsx
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function TooltipSides() {
  return (
    <div className="flex flex-wrap gap-2">
      {(["left", "top", "bottom", "right"] as const).map((side) => (
        <Tooltip key={side}>
          <TooltipTrigger asChild>
            <Button variant="outline" className="w-fit capitalize">
              {side}
            </Button>
          </TooltipTrigger>
          <TooltipContent side={side}>
            <p>Add to library</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}
```

### Com Atalho de Teclado

```tsx
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SaveIcon } from "lucide-react";

export function TooltipKeyboard() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline" size="icon-sm">
          <SaveIcon />
        </Button>
      </TooltipTrigger>
      <TooltipContent className="pr-1.5">
        <div className="flex items-center gap-2">
          Save Changes <Kbd>S</Kbd>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
```

### Botao Desabilitado

Exiba um tooltip em um botao desabilitado envolvendo-o com um span.

```tsx
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function TooltipDisabled() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-block w-fit">
          <Button variant="outline" disabled>
            Disabled
          </Button>
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <p>This feature is currently unavailable</p>
      </TooltipContent>
    </Tooltip>
  );
}
```

## RTL

Para habilitar o suporte RTL no shadcn/ui, consulte o [guia de configuracao RTL](/docs/rtl).

```tsx
"use client";

import { Button } from "@/examples/radix/ui-rtl/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/examples/radix/ui-rtl/tooltip";

import {
  useTranslation,
  type Translations,
} from "@/components/language-selector";

const translations: Translations = {
  en: {
    dir: "ltr",
    values: {
      content: "Add to library",
      left: "Left",
      top: "Top",
      bottom: "Bottom",
      right: "Right",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      content: "إضافة إلى المكتبة",
      left: "يسار",
      top: "أعلى",
      bottom: "أسفل",
      right: "يمين",
    },
  },
  he: {
    dir: "rtl",
    values: {
      content: "הוסף לספרייה",
      left: "שמאל",
      top: "למעלה",
      bottom: "למטה",
      right: "ימין",
    },
  },
};

const sides = ["left", "top", "bottom", "right"] as const;

export function TooltipRtl() {
  const { t } = useTranslation(translations, "ar");

  return (
    <div className="flex flex-wrap gap-2">
      {sides.map((side) => (
        <Tooltip key={side}>
          <TooltipTrigger asChild>
            <Button variant="outline" className="w-fit capitalize">
              {t[side]}
            </Button>
          </TooltipTrigger>
          <TooltipContent side={side}>{t.content}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}
```

## Referencia da API

Consulte a documentacao do [Radix Tooltip](https://www.radix-ui.com/docs/primitives/components/tooltip#api-reference).
