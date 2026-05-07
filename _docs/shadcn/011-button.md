---
title: Button
description: Exibe um botao ou um component que se parece com um botao.
featured: true
base: radix
component: true
---

```tsx
import { Button } from "@/components/ui/button";
import { ArrowUpIcon } from "lucide-react";

export function ButtonDemo() {
  return (
    <div className="flex flex-wrap items-center gap-2 md:flex-row">
      <Button variant="outline">Button</Button>
      <Button variant="outline" size="icon" aria-label="Submit">
        <ArrowUpIcon />
      </Button>
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
npx shadcn@latest add button
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
  name="button"
  title="components/ui/button.tsx"
  styleName="radix-nova"
/>

<Step>Atualize os caminhos de importacao para corresponder a configuracao do seu projeto.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Uso

```tsx
import { Button } from "@/components/ui/button";
```

```tsx
<Button variant="outline">Button</Button>
```

## Cursor

O Tailwind v4 [alterou](https://tailwindcss.com/docs/upgrade-guide#buttons-use-the-default-cursor) de `cursor: pointer` para `cursor: default` no component de botao.

Se voce quiser manter o comportamento de `cursor: pointer`, adicione o seguinte codigo ao seu arquivo CSS:

```css showLineNumbers title="globals.css"
@layer base {
  button:not(:disabled),
  [role="button"]:not(:disabled) {
    cursor: pointer;
  }
}
```

## Exemplos

### Tamanho

Use a prop `size` para alterar o tamanho do botao.

```tsx
import { Button } from "@/components/ui/button";
import { ArrowUpRightIcon } from "lucide-react";

export function ButtonSize() {
  return (
    <div className="flex flex-col items-start gap-8 sm:flex-row">
      <div className="flex items-start gap-2">
        <Button size="xs" variant="outline">
          Extra Small
        </Button>
        <Button size="icon-xs" aria-label="Submit" variant="outline">
          <ArrowUpRightIcon />
        </Button>
      </div>
      <div className="flex items-start gap-2">
        <Button size="sm" variant="outline">
          Small
        </Button>
        <Button size="icon-sm" aria-label="Submit" variant="outline">
          <ArrowUpRightIcon />
        </Button>
      </div>
      <div className="flex items-start gap-2">
        <Button variant="outline">Default</Button>
        <Button size="icon" aria-label="Submit" variant="outline">
          <ArrowUpRightIcon />
        </Button>
      </div>
      <div className="flex items-start gap-2">
        <Button variant="outline" size="lg">
          Large
        </Button>
        <Button size="icon-lg" aria-label="Submit" variant="outline">
          <ArrowUpRightIcon />
        </Button>
      </div>
    </div>
  );
}
```

### Default

```tsx
import { Button } from "@/components/ui/button";

export function ButtonDefault() {
  return <Button>Button</Button>;
}
```

### Outline

```tsx
import { Button } from "@/components/ui/button";

export function ButtonOutline() {
  return <Button variant="outline">Outline</Button>;
}
```

### Secondary

```tsx
import { Button } from "@/components/ui/button";

export function ButtonSecondary() {
  return <Button variant="secondary">Secondary</Button>;
}
```

### Ghost

```tsx
import { Button } from "@/components/ui/button";

export function ButtonGhost() {
  return <Button variant="ghost">Ghost</Button>;
}
```

### Destrutivo

```tsx
import { Button } from "@/components/ui/button";

export function ButtonDestructive() {
  return <Button variant="destructive">Destructive</Button>;
}
```

### Link

```tsx
import { Button } from "@/components/ui/button";

export function ButtonLink() {
  return <Button variant="link">Link</Button>;
}
```

### Icone

```tsx
import { Button } from "@/components/ui/button";
import { CircleFadingArrowUpIcon } from "lucide-react";

export function ButtonIcon() {
  return (
    <Button variant="outline" size="icon">
      <CircleFadingArrowUpIcon />
    </Button>
  );
}
```

### Com Icone

Lembre-se de adicionar o atributo `data-icon="inline-start"` ou `data-icon="inline-end"` ao icone para o espacamento correto.

```tsx
import { Button } from "@/components/ui/button";
import { IconGitBranch } from "@tabler/icons-react";

export function ButtonWithIcon() {
  return (
    <Button variant="outline" size="sm">
      <IconGitBranch /> New Branch
    </Button>
  );
}
```

### Arredondado

Use a classe `rounded-full` para tornar o botao arredondado.

```tsx
import { Button } from "@/components/ui/button";
import { ArrowUpIcon } from "lucide-react";

export function ButtonRounded() {
  return (
    <div className="flex flex-col gap-8">
      <Button variant="outline" size="icon" className="rounded-full">
        <ArrowUpIcon />
      </Button>
    </div>
  );
}
```

### Spinner

Renderize um component `<Spinner />` dentro do botao para exibir um estado de carregamento. Lembre-se de adicionar o atributo `data-icon="inline-start"` ou `data-icon="inline-end"` ao spinner para o espacamento correto.

```tsx
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export function ButtonSpinner() {
  return (
    <div className="flex gap-2">
      <Button variant="outline" disabled>
        <Spinner data-icon="inline-start" />
        Generating
      </Button>
      <Button variant="secondary" disabled>
        Downloading
        <Spinner data-icon="inline-start" />
      </Button>
    </div>
  );
}
```

### Grupo de Botoes

Para criar um grupo de botoes, use o component `ButtonGroup`. Consulte a documentacao do [Button Group](/docs/components/radix/button-group) para mais detalhes.

```tsx
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArchiveIcon,
  ArrowLeftIcon,
  CalendarPlusIcon,
  ClockIcon,
  ListFilterIcon,
  MailCheckIcon,
  MoreHorizontalIcon,
  TagIcon,
  Trash2Icon,
} from "lucide-react";

export function ButtonGroupDemo() {
  const [label, setLabel] = React.useState("personal");

  return (
    <ButtonGroup>
      <ButtonGroup className="hidden sm:flex">
        <Button variant="outline" size="icon" aria-label="Go Back">
          <ArrowLeftIcon />
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline">Archive</Button>
        <Button variant="outline">Report</Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline">Snooze</Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" aria-label="More Options">
              <MoreHorizontalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <MailCheckIcon />
                Mark as Read
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ArchiveIcon />
                Archive
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <ClockIcon />
                Snooze
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CalendarPlusIcon />
                Add to Calendar
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ListFilterIcon />
                Add to List
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <TagIcon />
                  Label As...
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    value={label}
                    onValueChange={setLabel}
                  >
                    <DropdownMenuRadioItem value="personal">
                      Personal
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="work">
                      Work
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="other">
                      Other
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem variant="destructive">
                <Trash2Icon />
                Trash
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </ButtonGroup>
    </ButtonGroup>
  );
}
```

### Link

Voce pode usar a prop `asChild` no `<Button />` para fazer outro component parecer um botao. Aqui esta um exemplo de um link que se parece com um botao.

```tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function ButtonAsChild() {
  return (
    <Button asChild>
      <Link href="/login">Login</Link>
    </Button>
  );
}
```

## RTL

Para habilitar o suporte RTL no shadcn/ui, consulte o [guia de configuracao RTL](/docs/rtl).

```tsx
"use client";

import { Button } from "@/examples/radix/ui-rtl/button";
import { Spinner } from "@/examples/radix/ui-rtl/spinner";
import { ArrowRightIcon, PlusIcon } from "lucide-react";

import {
  useTranslation,
  type Translations,
} from "@/components/language-selector";

const translations: Translations = {
  en: {
    dir: "ltr",
    values: {
      button: "Button",
      submit: "Submit",
      delete: "Delete",
      loading: "Loading",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      button: "زر",
      submit: "إرسال",
      delete: "حذف",
      loading: "جاري التحميل",
    },
  },
  he: {
    dir: "rtl",
    values: {
      button: "כפתור",
      submit: "שלח",
      delete: "מחק",
      loading: "טוען",
    },
  },
};

export function ButtonRtl() {
  const { dir, t } = useTranslation(translations, "ar");

  return (
    <div className="flex flex-wrap items-center gap-2 md:flex-row" dir={dir}>
      <Button variant="outline">{t.button}</Button>
      <Button variant="destructive">{t.delete}</Button>
      <Button variant="outline">
        {t.submit}{" "}
        <ArrowRightIcon className="rtl:rotate-180" data-icon="inline-end" />
      </Button>
      <Button variant="outline" size="icon" aria-label="Add">
        <PlusIcon />
      </Button>
      <Button variant="secondary" disabled>
        <Spinner data-icon="inline-start" /> {t.loading}
      </Button>
    </div>
  );
}
```

## Referencia da API

### Button

O component `Button` e um wrapper em torno do elemento `button` que adiciona uma variedade de estilos e funcionalidades.

| Prop      | Type                                                                                 | Default     |
| --------- | ------------------------------------------------------------------------------------ | ----------- |
| `variant` | `"default" \| "outline" \| "ghost" \| "destructive" \| "secondary" \| "link"`        | `"default"` |
| `size`    | `"default" \| "xs" \| "sm" \| "lg" \| "icon" \| "icon-xs" \| "icon-sm" \| "icon-lg"` | `"default"` |
| `asChild` | `boolean`                                                                            | `false`     |
