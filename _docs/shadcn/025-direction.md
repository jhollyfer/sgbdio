---
title: Direction
description: Um component provider que define a direção do texto para sua aplicação.
base: radix
component: true
links:
  doc: https://www.radix-ui.com/primitives/docs/utilities/direction-provider
  api: https://www.radix-ui.com/primitives/docs/utilities/direction-provider#api-reference
---

O component `DirectionProvider` é usado para definir a direção do texto (`ltr` ou `rtl`) para sua aplicação. Isso é essencial para suportar idiomas da direita para a esquerda, como árabe, hebraico e persa.

Aqui está uma prévia do component no modo RTL. Use o seletor de idioma para alternar o idioma. Para ver mais exemplos, procure a seção RTL nas páginas dos components.

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

## Instalacao

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Comando</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>

<TabsContent value="cli">

```bash
npx shadcn@latest add direction
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
  name="direction"
  title="components/ui/direction.tsx"
  styleName="radix-nova"
/>

<Step>Atualize os caminhos de importacao para corresponder a configuracao do seu projeto.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Uso

```tsx showLineNumbers
import { DirectionProvider } from "@/components/ui/direction";
```

```tsx showLineNumbers
<html dir="rtl">
  <body>
    <DirectionProvider direction="rtl">
      {/* Your app content */}
    </DirectionProvider>
  </body>
</html>
```

## useDirection

O hook `useDirection` e usado para obter a direcao atual da aplicacao.

```tsx showLineNumbers
import { useDirection } from "@/components/ui/direction";

function MyComponent() {
  const direction = useDirection();
  return <div>Current direction: {direction}</div>;
}
```
