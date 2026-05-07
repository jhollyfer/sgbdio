---
title: Alert Dialog
description: Um dialog modal que interrompe o usuario com conteudo importante e espera uma resposta.
featured: true
base: radix
component: true
links:
  doc: https://www.radix-ui.com/primitives/docs/components/alert-dialog
  api: https://www.radix-ui.com/primitives/docs/components/alert-dialog#api-reference
---

```tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export function AlertDialogDemo() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Show Dialog</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
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
npx shadcn@latest add alert-dialog
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
  name="alert-dialog"
  title="components/ui/alert-dialog.tsx"
  styleName="radix-nova"
/>

<Step>Atualize os caminhos de importacao para corresponder a configuracao do seu projeto.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Uso

```tsx showLineNumbers
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
```

```tsx showLineNumbers
<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="outline">Show Dialog</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete your account
        from our servers.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

## Exemplos

### Basico

Um alert dialog basico com titulo, descricao e botoes de cancelar e continuar.

```tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export function AlertDialogBasic() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Show Dialog</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

### Pequeno

Use a prop `size="sm"` para tornar o alert dialog menor.

```tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export function AlertDialogSmall() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Show Dialog</Button>
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Allow accessory to connect?</AlertDialogTitle>
          <AlertDialogDescription>
            Do you want to allow the USB accessory to connect to this device?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Don&apos;t allow</AlertDialogCancel>
          <AlertDialogAction>Allow</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

### Midia

Use o component `AlertDialogMedia` para adicionar um elemento de midia como um icone ou imagem ao alert dialog.

```tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { CircleFadingPlusIcon } from "lucide-react";

export function AlertDialogWithMedia() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Share Project</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia>
            <CircleFadingPlusIcon />
          </AlertDialogMedia>
          <AlertDialogTitle>Share this project?</AlertDialogTitle>
          <AlertDialogDescription>
            Anyone with the link will be able to view and edit this project.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Share</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

### Pequeno com Midia

Use a prop `size="sm"` para tornar o alert dialog menor e o component `AlertDialogMedia` para adicionar um elemento de midia como um icone ou imagem ao alert dialog.

```tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { BluetoothIcon } from "lucide-react";

export function AlertDialogSmallWithMedia() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Show Dialog</Button>
      </AlertDialogTrigger>

      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia>
            <BluetoothIcon />
          </AlertDialogMedia>
          <AlertDialogTitle>Allow accessory to connect?</AlertDialogTitle>
          <AlertDialogDescription>
            Do you want to allow the USB accessory to connect to this device?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Don&apos;t allow</AlertDialogCancel>
          <AlertDialogAction>Allow</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

### Destrutivo

Use o component `AlertDialogAction` para adicionar um botao de acao destrutiva ao alert dialog.

```tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";

export function AlertDialogDestructive() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete Chat</Button>
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete chat?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this chat conversation. View{" "}
            <a href="#">Settings</a> delete any memories saved during this chat.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive">Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

## RTL

Para habilitar o suporte RTL no shadcn/ui, consulte o [guia de configuracao RTL](/docs/rtl).

```tsx
"use client";

import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/examples/radix/ui-rtl/alert-dialog";
import { Button } from "@/examples/radix/ui-rtl/button";
import { BluetoothIcon } from "lucide-react";

import {
  useTranslation,
  type Translations,
} from "@/components/language-selector";

const translations: Translations = {
  en: {
    dir: "ltr",
    values: {
      showDialog: "Show Dialog",
      showDialogSm: "Show Dialog (sm)",
      title: "Are you absolutely sure?",
      description:
        "This action cannot be undone. This will permanently delete your account from our servers.",
      cancel: "Cancel",
      continue: "Continue",
      smallTitle: "Allow accessory to connect?",
      smallDescription:
        "Do you want to allow the USB accessory to connect to this device?",
      dontAllow: "Don't allow",
      allow: "Allow",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      showDialog: "إظهار الحوار",
      showDialogSm: "إظهار الحوار (صغير)",
      title: "هل أنت متأكد تمامًا؟",
      description:
        "لا يمكن التراجع عن هذا الإجراء. سيؤدي هذا إلى حذف حسابك نهائيًا من خوادمنا.",
      cancel: "إلغاء",
      continue: "متابعة",
      smallTitle: "السماح للملحق بالاتصال؟",
      smallDescription: "هل تريد السماح لملحق USB بالاتصال بهذا الجهاز؟",
      dontAllow: "عدم السماح",
      allow: "السماح",
    },
  },
  he: {
    dir: "rtl",
    values: {
      showDialog: "הצג דיאלוג",
      showDialogSm: "הצג דיאלוג (קטן)",
      title: "האם אתה בטוח לחלוטין?",
      description:
        "פעולה זו לא ניתנת לביטול. זה ימחק לצמיתות את החשבון שלך מהשרתים שלנו.",
      cancel: "ביטול",
      continue: "המשך",
      smallTitle: "לאפשר להתקן להתחבר?",
      smallDescription: "האם אתה רוצה לאפשר להתקן USB להתחבר למכשיר זה?",
      dontAllow: "אל תאפשר",
      allow: "אפשר",
    },
  },
};

export function AlertDialogRtl() {
  const { dir, t, language } = useTranslation(translations, "ar");

  return (
    <div className="flex gap-4" dir={dir}>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline">{t.showDialog}</Button>
        </AlertDialogTrigger>
        <AlertDialogContent
          dir={dir}
          data-lang={dir === "rtl" ? language : undefined}
        >
          <AlertDialogHeader>
            <AlertDialogTitle>{t.title}</AlertDialogTitle>
            <AlertDialogDescription>{t.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
            <AlertDialogAction>{t.continue}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline">{t.showDialogSm}</Button>
        </AlertDialogTrigger>
        <AlertDialogContent
          size="sm"
          dir={dir}
          data-lang={dir === "rtl" ? language : undefined}
        >
          <AlertDialogHeader>
            <AlertDialogMedia>
              <BluetoothIcon />
            </AlertDialogMedia>
            <AlertDialogTitle>{t.smallTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {t.smallDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.dontAllow}</AlertDialogCancel>
            <AlertDialogAction>{t.allow}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
```

## Referencia da API

### size

Use a prop `size` no component `AlertDialogContent` para controlar o tamanho do alert dialog. Ela aceita os seguintes valores:

| Prop   | Type                | Default     |
| ------ | ------------------- | ----------- |
| `size` | `"default" \| "sm"` | `"default"` |

Para mais informacoes sobre os outros components e suas props, consulte a [documentacao do Radix UI](https://www.radix-ui.com/primitives/docs/components/alert-dialog#api-reference).
