---
title: Sheet
description: Estende o component Dialog para exibir conteúdo que complementa o conteúdo principal da tela.
base: radix
component: true
links:
  doc: https://www.radix-ui.com/docs/primitives/components/dialog
  api: https://www.radix-ui.com/docs/primitives/components/dialog#api-reference
---

```tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function SheetDemo() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4">
          <div className="grid gap-3">
            <Label htmlFor="sheet-demo-name">Name</Label>
            <Input id="sheet-demo-name" defaultValue="Pedro Duarte" />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="sheet-demo-username">Username</Label>
            <Input id="sheet-demo-username" defaultValue="@peduarte" />
          </div>
        </div>
        <SheetFooter>
          <Button type="submit">Save changes</Button>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
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
npx shadcn@latest add sheet
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
  name="sheet"
  title="components/ui/sheet.tsx"
  styleName="radix-nova"
/>

<Step>Atualize os caminhos de importação para corresponder à configuração do seu projeto.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Uso

```tsx showLineNumbers
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
```

```tsx showLineNumbers
<Sheet>
  <SheetTrigger>Open</SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Are you absolutely sure?</SheetTitle>
      <SheetDescription>This action cannot be undone.</SheetDescription>
    </SheetHeader>
  </SheetContent>
</Sheet>
```

## Exemplos

### Lado

Use a prop `side` no `SheetContent` para definir a borda da tela onde o sheet aparece. Os valores são `top`, `right`, `bottom` ou `left`.

```tsx
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const SHEET_SIDES = ["top", "right", "bottom", "left"] as const;

export function SheetSide() {
  return (
    <div className="flex flex-wrap gap-2">
      {SHEET_SIDES.map((side) => (
        <Sheet key={side}>
          <SheetTrigger asChild>
            <Button variant="outline" className="capitalize">
              {side}
            </Button>
          </SheetTrigger>
          <SheetContent
            side={side}
            className="data-[side=bottom]:max-h-[50vh] data-[side=top]:max-h-[50vh]"
          >
            <SheetHeader>
              <SheetTitle>Edit profile</SheetTitle>
              <SheetDescription>
                Make changes to your profile here. Click save when you&apos;re
                done.
              </SheetDescription>
            </SheetHeader>
            <div className="no-scrollbar overflow-y-auto px-4">
              {Array.from({ length: 10 }).map((_, index) => (
                <p key={index} className="mb-2 leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia deserunt
                  mollit anim id est laborum.
                </p>
              ))}
            </div>
            <SheetFooter>
              <Button type="submit">Save changes</Button>
              <SheetClose asChild>
                <Button variant="outline">Cancel</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  );
}
```

### Sem Botão de Fechar

Use `showCloseButton={false}` no `SheetContent` para ocultar o botão de fechar.

```tsx
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function SheetNoCloseButton() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Sheet</Button>
      </SheetTrigger>
      <SheetContent showCloseButton={false}>
        <SheetHeader>
          <SheetTitle>No Close Button</SheetTitle>
          <SheetDescription>
            This sheet doesn&apos;t have a close button in the top-right corner.
            Click outside to close.
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
```

## RTL

Para habilitar o suporte a RTL no shadcn/ui, consulte o [guia de configuração RTL](/docs/rtl).

```tsx
"use client";

import { Button } from "@/examples/radix/ui-rtl/button";
import { Field, FieldGroup, FieldLabel } from "@/examples/radix/ui-rtl/field";
import { Input } from "@/examples/radix/ui-rtl/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/examples/radix/ui-rtl/sheet";

import {
  useTranslation,
  type Translations,
} from "@/components/language-selector";

const translations: Translations = {
  en: {
    dir: "ltr",
    values: {
      open: "Open",
      editProfile: "Edit profile",
      description:
        "Make changes to your profile here. Click save when you're done.",
      name: "Name",
      username: "Username",
      save: "Save changes",
      close: "Close",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      open: "فتح",
      editProfile: "تعديل الملف الشخصي",
      description:
        "قم بإجراء تغييرات على ملفك الشخصي هنا. انقر حفظ عند الانتهاء.",
      name: "الاسم",
      username: "اسم المستخدم",
      save: "حفظ التغييرات",
      close: "إغلاق",
    },
  },
  he: {
    dir: "rtl",
    values: {
      open: "פתח",
      editProfile: "עריכת פרופיל",
      description: "בצע שינויים בפרופיל שלך כאן. לחץ שמור כשתסיים.",
      name: "שם",
      username: "שם משתמש",
      save: "שמור שינויים",
      close: "סגור",
    },
  },
};

export function SheetRtl() {
  const { dir, t, language } = useTranslation(translations, "ar");

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">{t.open}</Button>
      </SheetTrigger>
      <SheetContent
        dir={dir}
        side={dir === "rtl" ? "left" : "right"}
        data-lang={dir === "rtl" ? language : undefined}
      >
        <SheetHeader>
          <SheetTitle>{t.editProfile}</SheetTitle>
          <SheetDescription>{t.description}</SheetDescription>
        </SheetHeader>
        <FieldGroup className="px-4">
          <Field>
            <FieldLabel htmlFor="sheet-rtl-name">{t.name}</FieldLabel>
            <Input id="sheet-rtl-name" defaultValue="Pedro Duarte" />
          </Field>
          <Field>
            <FieldLabel htmlFor="sheet-rtl-username">{t.username}</FieldLabel>
            <Input id="sheet-rtl-username" defaultValue="peduarte" />
          </Field>
        </FieldGroup>
        <SheetFooter>
          <Button type="submit">{t.save}</Button>
          <SheetClose asChild>
            <Button variant="outline">{t.close}</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
```

## Referência da API

Consulte a documentação do [Radix UI Dialog](https://www.radix-ui.com/docs/primitives/components/dialog#api-reference).
