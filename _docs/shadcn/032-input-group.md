---
title: Input Group
description: Adicione addons, botoes e conteudo auxiliar aos inputs.
base: radix
component: true
---

import { IconInfoCircle } from "@tabler/icons-react"

```tsx
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Search } from "lucide-react";

export function InputGroupDemo() {
  return (
    <InputGroup className="max-w-xs">
      <InputGroupInput placeholder="Search..." />
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">12 results</InputGroupAddon>
    </InputGroup>
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
npx shadcn@latest add input-group
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Copie e cole o codigo a seguir no seu projeto.</Step>

<ComponentSource
  name="input-group"
  title="components/ui/input-group.tsx"
  styleName="radix-nova"
/>

<Step>Atualize os caminhos de importacao para corresponder a configuracao do seu projeto.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Uso

```tsx showLineNumbers
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
```

```tsx showLineNumbers
<InputGroup>
  <InputGroupInput placeholder="Search..." />
  <InputGroupAddon>
    <SearchIcon />
  </InputGroupAddon>
</InputGroup>
```

## Alinhamento

Use a prop `align` no `InputGroupAddon` para posicionar o addon em relacao ao input.

<Callout>
  Para gerenciamento adequado de foco, `InputGroupAddon` deve sempre ser colocado apos
  `InputGroupInput` ou `InputGroupTextarea` no DOM. Use a prop `align` para
  posicionar visualmente o addon.
</Callout>

### inline-start

Use `align="inline-start"` para posicionar o addon no inicio do input. Este e o padrao.

```tsx
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { SearchIcon } from "lucide-react";

export function InputGroupInlineStart() {
  return (
    <Field className="max-w-sm">
      <FieldLabel htmlFor="inline-start-input">Input</FieldLabel>
      <InputGroup>
        <InputGroupInput id="inline-start-input" placeholder="Search..." />
        <InputGroupAddon align="inline-start">
          <SearchIcon className="text-muted-foreground" />
        </InputGroupAddon>
      </InputGroup>
      <FieldDescription>Icon positioned at the start.</FieldDescription>
    </Field>
  );
}
```

### inline-end

Use `align="inline-end"` para posicionar o addon no final do input.

```tsx
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { EyeOffIcon } from "lucide-react";

export function InputGroupInlineEnd() {
  return (
    <Field className="max-w-sm">
      <FieldLabel htmlFor="inline-end-input">Input</FieldLabel>
      <InputGroup>
        <InputGroupInput
          id="inline-end-input"
          type="password"
          placeholder="Enter password"
        />
        <InputGroupAddon align="inline-end">
          <EyeOffIcon />
        </InputGroupAddon>
      </InputGroup>
      <FieldDescription>Icon positioned at the end.</FieldDescription>
    </Field>
  );
}
```

### block-start

Use `align="block-start"` para posicionar o addon acima do input.

```tsx
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { CopyIcon, FileCodeIcon } from "lucide-react";

export function InputGroupBlockStart() {
  return (
    <FieldGroup className="max-w-sm">
      <Field>
        <FieldLabel htmlFor="block-start-input">Input</FieldLabel>
        <InputGroup className="h-auto">
          <InputGroupInput
            id="block-start-input"
            placeholder="Enter your name"
          />
          <InputGroupAddon align="block-start">
            <InputGroupText>Full Name</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
        <FieldDescription>Header positioned above the input.</FieldDescription>
      </Field>
      <Field>
        <FieldLabel htmlFor="block-start-textarea">Textarea</FieldLabel>
        <InputGroup>
          <InputGroupTextarea
            id="block-start-textarea"
            placeholder="console.log('Hello, world!');"
            className="font-mono text-sm"
          />
          <InputGroupAddon align="block-start">
            <FileCodeIcon className="text-muted-foreground" />
            <InputGroupText className="font-mono">script.js</InputGroupText>
            <InputGroupButton size="icon-xs" className="ml-auto">
              <CopyIcon />
              <span className="sr-only">Copy</span>
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <FieldDescription>
          Header positioned above the textarea.
        </FieldDescription>
      </Field>
    </FieldGroup>
  );
}
```

### block-end

Use `align="block-end"` para posicionar o addon abaixo do input.

```tsx
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";

export function InputGroupBlockEnd() {
  return (
    <FieldGroup className="max-w-sm">
      <Field>
        <FieldLabel htmlFor="block-end-input">Input</FieldLabel>
        <InputGroup className="h-auto">
          <InputGroupInput id="block-end-input" placeholder="Enter amount" />
          <InputGroupAddon align="block-end">
            <InputGroupText>USD</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
        <FieldDescription>Footer positioned below the input.</FieldDescription>
      </Field>
      <Field>
        <FieldLabel htmlFor="block-end-textarea">Textarea</FieldLabel>
        <InputGroup>
          <InputGroupTextarea
            id="block-end-textarea"
            placeholder="Write a comment..."
          />
          <InputGroupAddon align="block-end">
            <InputGroupText>0/280</InputGroupText>
            <InputGroupButton variant="default" size="sm" className="ml-auto">
              Post
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <FieldDescription>
          Footer positioned below the textarea.
        </FieldDescription>
      </Field>
    </FieldGroup>
  );
}
```

## Exemplos

### Icone

```tsx
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  CheckIcon,
  CreditCardIcon,
  InfoIcon,
  MailIcon,
  SearchIcon,
  StarIcon,
} from "lucide-react";

export function InputGroupIcon() {
  return (
    <div className="grid w-full max-w-sm gap-6">
      <InputGroup>
        <InputGroupInput placeholder="Search..." />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput type="email" placeholder="Enter your email" />
        <InputGroupAddon>
          <MailIcon />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder="Card number" />
        <InputGroupAddon>
          <CreditCardIcon />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <CheckIcon />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder="Card number" />
        <InputGroupAddon align="inline-end">
          <StarIcon />
          <InfoIcon />
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
```

### Texto

```tsx
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";

export function InputGroupTextExample() {
  return (
    <div className="grid w-full max-w-sm gap-6">
      <InputGroup>
        <InputGroupAddon>
          <InputGroupText>$</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder="0.00" />
        <InputGroupAddon align="inline-end">
          <InputGroupText>USD</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupAddon>
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder="example.com" className="!pl-0.5" />
        <InputGroupAddon align="inline-end">
          <InputGroupText>.com</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder="Enter your username" />
        <InputGroupAddon align="inline-end">
          <InputGroupText>@company.com</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupTextarea placeholder="Enter your message" />
        <InputGroupAddon align="block-end">
          <InputGroupText className="text-muted-foreground text-xs">
            120 characters left
          </InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
```

### Botao

```tsx
"use client";

import * as React from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  IconCheck,
  IconCopy,
  IconInfoCircle,
  IconStar,
} from "@tabler/icons-react";

import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

export function InputGroupButtonExample() {
  const { copyToClipboard, isCopied } = useCopyToClipboard();
  const [isFavorite, setIsFavorite] = React.useState(false);

  return (
    <div className="grid w-full max-w-sm gap-6">
      <InputGroup>
        <InputGroupInput placeholder="https://x.com/shadcn" readOnly />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            aria-label="Copy"
            title="Copy"
            size="icon-xs"
            onClick={() => {
              copyToClipboard("https://x.com/shadcn");
            }}
          >
            {isCopied ? <IconCheck /> : <IconCopy />}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup className="[--radius:9999px]">
        <Popover>
          <PopoverTrigger asChild>
            <InputGroupAddon>
              <InputGroupButton variant="secondary" size="icon-xs">
                <IconInfoCircle />
              </InputGroupButton>
            </InputGroupAddon>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className="flex flex-col gap-1 rounded-xl text-sm"
          >
            <p className="font-medium">Your connection is not secure.</p>
            <p>You should not enter any sensitive information on this site.</p>
          </PopoverContent>
        </Popover>
        <InputGroupAddon className="text-muted-foreground pl-1.5">
          https://
        </InputGroupAddon>
        <InputGroupInput id="input-secure-19" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            onClick={() => setIsFavorite(!isFavorite)}
            size="icon-xs"
          >
            <IconStar
              data-favorite={isFavorite}
              className="data-[favorite=true]:fill-blue-600 data-[favorite=true]:stroke-blue-600"
            />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder="Type to search..." />
        <InputGroupAddon align="inline-end">
          <InputGroupButton variant="secondary">Search</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
```

### Kbd

```tsx
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Kbd } from "@/components/ui/kbd";
import { SearchIcon } from "lucide-react";

export function InputGroupKbd() {
  return (
    <InputGroup className="max-w-sm">
      <InputGroupInput placeholder="Search..." />
      <InputGroupAddon>
        <SearchIcon className="text-muted-foreground" />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">
        <Kbd>⌘K</Kbd>
      </InputGroupAddon>
    </InputGroup>
  );
}
```

### Dropdown

```tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { ChevronDownIcon, MoreHorizontal } from "lucide-react";

export function InputGroupDropdown() {
  return (
    <div className="grid w-full max-w-sm gap-4">
      <InputGroup>
        <InputGroupInput placeholder="Enter file name" />
        <InputGroupAddon align="inline-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <InputGroupButton
                variant="ghost"
                aria-label="More"
                size="icon-xs"
              >
                <MoreHorizontal />
              </InputGroupButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Copy path</DropdownMenuItem>
                <DropdownMenuItem>Open location</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup className="[--radius:1rem]">
        <InputGroupInput placeholder="Enter search query" />
        <InputGroupAddon align="inline-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <InputGroupButton variant="ghost" className="!pr-1.5 text-xs">
                Search In... <ChevronDownIcon className="size-3" />
              </InputGroupButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="[--radius:0.95rem]">
              <DropdownMenuGroup>
                <DropdownMenuItem>Documentation</DropdownMenuItem>
                <DropdownMenuItem>Blog Posts</DropdownMenuItem>
                <DropdownMenuItem>Changelog</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
```

### Spinner

```tsx
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { LoaderIcon } from "lucide-react";

export function InputGroupSpinner() {
  return (
    <div className="grid w-full max-w-sm gap-4">
      <InputGroup>
        <InputGroupInput placeholder="Searching..." />
        <InputGroupAddon align="inline-end">
          <Spinner />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder="Processing..." />
        <InputGroupAddon>
          <Spinner />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder="Saving changes..." />
        <InputGroupAddon align="inline-end">
          <InputGroupText>Saving...</InputGroupText>
          <Spinner />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder="Refreshing data..." />
        <InputGroupAddon>
          <LoaderIcon className="animate-spin" />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <InputGroupText className="text-muted-foreground">
            Please wait...
          </InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
```

### Textarea

```tsx
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import {
  IconBrandJavascript,
  IconCopy,
  IconCornerDownLeft,
  IconRefresh,
} from "@tabler/icons-react";

export function InputGroupTextareaExample() {
  return (
    <div className="grid w-full max-w-md gap-4">
      <InputGroup>
        <InputGroupTextarea
          id="textarea-code-32"
          placeholder="console.log('Hello, world!');"
          className="min-h-[200px]"
        />
        <InputGroupAddon align="block-end" className="border-t">
          <InputGroupText>Line 1, Column 1</InputGroupText>
          <InputGroupButton size="sm" className="ml-auto" variant="default">
            Run <IconCornerDownLeft />
          </InputGroupButton>
        </InputGroupAddon>
        <InputGroupAddon align="block-start" className="border-b">
          <InputGroupText className="font-mono font-medium">
            <IconBrandJavascript />
            script.js
          </InputGroupText>
          <InputGroupButton className="ml-auto" size="icon-xs">
            <IconRefresh />
          </InputGroupButton>
          <InputGroupButton variant="ghost" size="icon-xs">
            <IconCopy />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
```

### Input Personalizado

Adicione o atributo `data-slot="input-group-control"` ao seu input personalizado para tratamento automatico do estado de foco.

Aqui esta um exemplo de um textarea redimensionavel personalizado de uma biblioteca de terceiros.

```tsx
"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
} from "@/components/ui/input-group";
import TextareaAutosize from "react-textarea-autosize";

export function InputGroupCustom() {
  return (
    <div className="grid w-full max-w-sm gap-6">
      <InputGroup>
        <TextareaAutosize
          data-slot="input-group-control"
          className="flex field-sizing-content min-h-16 w-full resize-none rounded-md bg-transparent px-3 py-2.5 text-base transition-[color,box-shadow] outline-none md:text-sm"
          placeholder="Autoresize textarea..."
        />
        <InputGroupAddon align="block-end">
          <InputGroupButton className="ml-auto" size="sm" variant="default">
            Submit
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
```

## RTL

Para habilitar o suporte a RTL no shadcn/ui, consulte o [guia de configuracao RTL](/docs/rtl).

```tsx
"use client";

import * as React from "react";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/examples/radix/ui-rtl/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/examples/radix/ui-rtl/input-group";
import { Spinner } from "@/examples/radix/ui-rtl/spinner";
import { Search } from "lucide-react";

import {
  useTranslation,
  type Translations,
} from "@/components/language-selector";

const translations: Translations = {
  en: {
    dir: "ltr",
    values: {
      placeholder: "Search...",
      results: "12 results",
      searching: "Searching...",
      saving: "Saving...",
      savingChanges: "Saving changes...",
      textareaLabel: "Textarea",
      textareaPlaceholder: "Write a comment...",
      characterCount: "0/280",
      post: "Post",
      textareaDescription: "Footer positioned below the textarea.",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      placeholder: "بحث...",
      results: "١٢ نتيجة",
      searching: "جاري البحث...",
      saving: "جاري الحفظ...",
      savingChanges: "جاري حفظ التغييرات...",
      textareaLabel: "منطقة النص",
      textareaPlaceholder: "اكتب تعليقًا...",
      characterCount: "٠/٢٨٠",
      post: "نشر",
      textareaDescription: "تذييل موضع أسفل منطقة النص.",
    },
  },
  he: {
    dir: "rtl",
    values: {
      placeholder: "חפש...",
      results: "12 תוצאות",
      searching: "מחפש...",
      saving: "שומר...",
      savingChanges: "שומר שינויים...",
      textareaLabel: "אזור טקסט",
      textareaPlaceholder: "כתוב תגובה...",
      characterCount: "0/280",
      post: "פרסם",
      textareaDescription: "כותרת תחתונה ממוקמת מתחת לאזור הטקסט.",
    },
  },
};

export function InputGroupRtl() {
  const { dir, t } = useTranslation(translations, "ar");

  return (
    <div className="grid w-full max-w-sm gap-6">
      <InputGroup className="max-w-xs" dir={dir}>
        <InputGroupInput placeholder={t.placeholder} />
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">{t.results}</InputGroupAddon>
      </InputGroup>
      <InputGroup dir={dir}>
        <InputGroupInput placeholder={t.searching} />
        <InputGroupAddon align="inline-end">
          <Spinner />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup dir={dir}>
        <InputGroupInput placeholder={t.savingChanges} />
        <InputGroupAddon align="inline-end">
          <InputGroupText>{t.saving}</InputGroupText>
          <Spinner />
        </InputGroupAddon>
      </InputGroup>
      <FieldGroup className="max-w-sm" dir={dir}>
        <Field>
          <FieldLabel htmlFor="rtl-textarea">{t.textareaLabel}</FieldLabel>
          <InputGroup dir={dir}>
            <InputGroupTextarea
              id="rtl-textarea"
              placeholder={t.textareaPlaceholder}
            />
            <InputGroupAddon align="block-end">
              <InputGroupText>{t.characterCount}</InputGroupText>
              <InputGroupButton variant="default" size="sm" className="ml-auto">
                {t.post}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          <FieldDescription>{t.textareaDescription}</FieldDescription>
        </Field>
      </FieldGroup>
    </div>
  );
}
```

## Referencia da API

### InputGroup

O component principal que envolve inputs e addons.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| `className` | `string` |         |

```tsx
<InputGroup>
  <InputGroupInput />
  <InputGroupAddon />
</InputGroup>
```

### InputGroupAddon

Exibe icones, texto, botoes ou outro conteudo junto aos inputs.

<Callout icon={<IconInfoCircle />} title="Navegacao de Foco">
Para uma navegacao de foco adequada, o component `InputGroupAddon` deve ser colocado
apos o input. Defina a prop `align` para posicionar o addon.
</Callout>

| Prop        | Type                                                             | Default          |
| ----------- | ---------------------------------------------------------------- | ---------------- |
| `align`     | `"inline-start" \| "inline-end" \| "block-start" \| "block-end"` | `"inline-start"` |
| `className` | `string`                                                         |                  |

```tsx
<InputGroupAddon align="inline-end">
  <SearchIcon />
</InputGroupAddon>
```

**Para `<InputGroupInput />`, use o alinhamento `inline-start` ou `inline-end`. Para `<InputGroupTextarea />`, use o alinhamento `block-start` ou `block-end`.**

O component `InputGroupAddon` pode ter multiplos components `InputGroupButton` e icones.

```tsx
<InputGroupAddon>
  <InputGroupButton>Button</InputGroupButton>
  <InputGroupButton>Button</InputGroupButton>
</InputGroupAddon>
```

### InputGroupButton

Exibe botoes dentro de grupos de input.

| Prop        | Type                                                                          | Default   |
| ----------- | ----------------------------------------------------------------------------- | --------- |
| `size`      | `"xs" \| "icon-xs" \| "sm" \| "icon-sm"`                                      | `"xs"`    |
| `variant`   | `"default" \| "destructive" \| "outline" \| "secondary" \| "ghost" \| "link"` | `"ghost"` |
| `className` | `string`                                                                      |           |

```tsx
<InputGroupButton>Button</InputGroupButton>
<InputGroupButton size="icon-xs" aria-label="Copy">
  <CopyIcon />
</InputGroupButton>
```

### InputGroupInput

Substituto para `<Input />` ao construir grupos de input. Este component possui os estilos do grupo de input pre-aplicados e usa o `data-slot="input-group-control"` unificado para tratamento do estado de foco.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| `className` | `string` |         |

Todas as outras props sao passadas para o component `<Input />` subjacente.

```tsx
<InputGroup>
  <InputGroupInput placeholder="Enter text..." />
  <InputGroupAddon>
    <SearchIcon />
  </InputGroupAddon>
</InputGroup>
```

### InputGroupTextarea

Substituto para `<Textarea />` ao construir grupos de input. Este component possui os estilos do grupo de textarea pre-aplicados e usa o `data-slot="input-group-control"` unificado para tratamento do estado de foco.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| `className` | `string` |         |

Todas as outras props sao passadas para o component `<Textarea />` subjacente.

```tsx
<InputGroup>
  <InputGroupTextarea placeholder="Enter message..." />
  <InputGroupAddon align="block-end">
    <InputGroupButton>Send</InputGroupButton>
  </InputGroupAddon>
</InputGroup>
```

## Changelog

### 2025-10-06 `InputGroup`

Adicione a classe `min-w-0` ao component `InputGroup`. Veja o [diff](https://github.com/shadcn-ui/ui/pull/8341/files#diff-0e2ee95d0050ca4c5d82339df86c54e14a6739dc4638fdda0eec8f73aebc2da9).
