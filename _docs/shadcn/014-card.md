---
title: Card
description: Exibe um card com cabecalho, conteudo e rodape.
base: radix
component: true
---

```tsx
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CardDemo() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
        <CardAction>
          <Button variant="link">Sign Up</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input id="password" type="password" required />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full">
          Login
        </Button>
        <Button variant="outline" className="w-full">
          Login with Google
        </Button>
      </CardFooter>
    </Card>
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
npx shadcn@latest add card
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Copie e cole o codigo a seguir no seu projeto.</Step>

<ComponentSource
  name="card"
  title="components/ui/card.tsx"
  styleName="radix-nova"
/>

<Step>Atualize os caminhos de importacao para corresponder a configuracao do seu projeto.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Uso

```tsx showLineNumbers
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
```

```tsx showLineNumbers
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card Description</CardDescription>
    <CardAction>Card Action</CardAction>
  </CardHeader>
  <CardContent>
    <p>Card Content</p>
  </CardContent>
  <CardFooter>
    <p>Card Footer</p>
  </CardFooter>
</Card>
```

## Exemplos

### Tamanho

Use a prop `size="sm"` para definir o tamanho do card como pequeno. A variante de tamanho pequeno usa espacamento menor.

```tsx
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function CardSmall() {
  return (
    <Card size="sm" className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle>Small Card</CardTitle>
        <CardDescription>
          This card uses the small size variant.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          The card component supports a size prop that can be set to
          &quot;sm&quot; for a more compact appearance.
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full">
          Action
        </Button>
      </CardFooter>
    </Card>
  );
}
```

### Imagem

Adicione uma imagem antes do cabecalho do card para criar um card com imagem.

```tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function CardImage() {
  return (
    <Card className="relative mx-auto w-full max-w-sm pt-0">
      <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
      <img
        src="https://avatar.vercel.sh/shadcn1"
        alt="Event cover"
        className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
      />
      <CardHeader>
        <CardAction>
          <Badge variant="secondary">Featured</Badge>
        </CardAction>
        <CardTitle>Design systems meetup</CardTitle>
        <CardDescription>
          A practical talk on component APIs, accessibility, and shipping
          faster.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button className="w-full">View Event</Button>
      </CardFooter>
    </Card>
  );
}
```

## RTL

Para habilitar o suporte RTL no shadcn/ui, consulte o [guia de configuracao RTL](/docs/rtl).

```tsx
"use client";

import * as React from "react";
import { Button } from "@/examples/radix/ui-rtl/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/examples/radix/ui-rtl/card";
import { Input } from "@/examples/radix/ui-rtl/input";
import { Label } from "@/examples/radix/ui-rtl/label";

import {
  useTranslation,
  type Translations,
} from "@/components/language-selector";

const translations: Translations = {
  en: {
    dir: "ltr",
    values: {
      title: "Login to your account",
      description: "Enter your email below to login to your account",
      signUp: "Sign Up",
      email: "Email",
      emailPlaceholder: "m@example.com",
      password: "Password",
      forgotPassword: "Forgot your password?",
      login: "Login",
      loginWithGoogle: "Login with Google",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      title: "تسجيل الدخول إلى حسابك",
      description: "أدخل بريدك الإلكتروني أدناه لتسجيل الدخول إلى حسابك",
      signUp: "إنشاء حساب",
      email: "البريد الإلكتروني",
      emailPlaceholder: "m@example.com",
      password: "كلمة المرور",
      forgotPassword: "نسيت كلمة المرور؟",
      login: "تسجيل الدخول",
      loginWithGoogle: "تسجيل الدخول باستخدام Google",
    },
  },
  he: {
    dir: "rtl",
    values: {
      title: "התחבר לחשבון שלך",
      description: "הזן את האימייל שלך למטה כדי להתחבר לחשבון שלך",
      signUp: "הירשם",
      email: "אימייל",
      emailPlaceholder: "m@example.com",
      password: "סיסמה",
      forgotPassword: "שכחת את הסיסמה?",
      login: "התחבר",
      loginWithGoogle: "התחבר עם Google",
    },
  },
};

export function CardRtl() {
  const { dir, t } = useTranslation(translations, "ar");

  return (
    <Card className="w-full max-w-sm" dir={dir}>
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
        <CardDescription>{t.description}</CardDescription>
        <CardAction>
          <Button variant="link">{t.signUp}</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email-rtl">{t.email}</Label>
              <Input
                id="email-rtl"
                type="email"
                placeholder={t.emailPlaceholder}
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password-rtl">{t.password}</Label>
                <a
                  href="#"
                  className="ms-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  {t.forgotPassword}
                </a>
              </div>
              <Input id="password-rtl" type="password" required />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full">
          {t.login}
        </Button>
        <Button variant="outline" className="w-full">
          {t.loginWithGoogle}
        </Button>
      </CardFooter>
    </Card>
  );
}
```

## Referencia da API

### Card

O component `Card` e o container raiz para o conteudo do card.

| Prop        | Type                | Default     |
| ----------- | ------------------- | ----------- |
| `size`      | `"default" \| "sm"` | `"default"` |
| `className` | `string`            | -           |

### CardHeader

O component `CardHeader` e usado para titulo, descricao e acao opcional.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| `className` | `string` | -       |

### CardTitle

O component `CardTitle` e usado para o titulo do card.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| `className` | `string` | -       |

### CardDescription

O component `CardDescription` e usado para texto auxiliar abaixo do titulo.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| `className` | `string` | -       |

### CardAction

O component `CardAction` posiciona conteudo no canto superior direito do cabecalho (por exemplo, um botao ou um badge).

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| `className` | `string` | -       |

### CardContent

O component `CardContent` e usado para o corpo principal do card.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| `className` | `string` | -       |

### CardFooter

O component `CardFooter` e usado para acoes e conteudo secundario na parte inferior do card.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| `className` | `string` | -       |
