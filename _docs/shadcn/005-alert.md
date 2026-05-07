---
title: Alert
description: Exibe um aviso para chamar a atencao do usuario.
base: radix
component: true
---

```tsx
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2Icon, InfoIcon } from "lucide-react";

export function AlertDemo() {
  return (
    <div className="grid w-full max-w-md items-start gap-4">
      <Alert>
        <CheckCircle2Icon />
        <AlertTitle>Payment successful</AlertTitle>
        <AlertDescription>
          Your payment of $29.99 has been processed. A receipt has been sent to
          your email address.
        </AlertDescription>
      </Alert>
      <Alert>
        <InfoIcon />
        <AlertTitle>New feature available</AlertTitle>
        <AlertDescription>
          We&apos;ve added dark mode support. You can enable it in your account
          settings.
        </AlertDescription>
      </Alert>
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
npx shadcn@latest add alert
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Copie e cole o codigo a seguir no seu projeto.</Step>

<ComponentSource
  name="alert"
  title="components/ui/alert.tsx"
  styleName="radix-nova"
/>

<Step>Atualize os caminhos de importacao para corresponder a configuracao do seu projeto.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Uso

```tsx showLineNumbers
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
```

```tsx showLineNumbers
<Alert>
  <InfoIcon />
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>
    You can add components and dependencies to your app using the cli.
  </AlertDescription>
  <AlertAction>
    <Button variant="outline">Enable</Button>
  </AlertAction>
</Alert>
```

## Exemplos

### Basico

Um alert basico com icone, titulo e descricao.

```tsx
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2Icon } from "lucide-react";

export function AlertBasic() {
  return (
    <Alert className="max-w-md">
      <CheckCircle2Icon />
      <AlertTitle>Account updated successfully</AlertTitle>
      <AlertDescription>
        Your profile information has been saved. Changes will be reflected
        immediately.
      </AlertDescription>
    </Alert>
  );
}
```

### Destrutivo

Use `variant="destructive"` para criar um alert destrutivo.

```tsx
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";

export function AlertDestructive() {
  return (
    <Alert variant="destructive" className="max-w-md">
      <AlertCircleIcon />
      <AlertTitle>Payment failed</AlertTitle>
      <AlertDescription>
        Your payment could not be processed. Please check your payment method
        and try again.
      </AlertDescription>
    </Alert>
  );
}
```

### Acao

Use `AlertAction` para adicionar um botao ou outro elemento de acao ao alert.

```tsx
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export function AlertActionExample() {
  return (
    <Alert className="max-w-md">
      <AlertTitle>Dark mode is now available</AlertTitle>
      <AlertDescription>
        Enable it under your profile settings to get started.
      </AlertDescription>
      <AlertAction>
        <Button size="xs" variant="default">
          Enable
        </Button>
      </AlertAction>
    </Alert>
  );
}
```

### Cores Personalizadas

Voce pode personalizar as cores do alert adicionando classes customizadas como `bg-amber-50 dark:bg-amber-950` ao component `Alert`.

```tsx
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangleIcon } from "lucide-react";

export function AlertColors() {
  return (
    <Alert className="max-w-md border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50">
      <AlertTriangleIcon />
      <AlertTitle>Your subscription will expire in 3 days.</AlertTitle>
      <AlertDescription>
        Renew now to avoid service interruption or upgrade to a paid plan to
        continue using the service.
      </AlertDescription>
    </Alert>
  );
}
```

## RTL

Para habilitar o suporte RTL no shadcn/ui, consulte o [guia de configuracao RTL](/docs/rtl).

```tsx
"use client";

import * as React from "react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/examples/radix/ui-rtl/alert";
import { CheckCircle2Icon, InfoIcon } from "lucide-react";

import {
  useTranslation,
  type Translations,
} from "@/components/language-selector";

const translations: Translations = {
  en: {
    dir: "ltr",
    values: {
      paymentTitle: "Payment successful",
      paymentDescription:
        "Your payment of $29.99 has been processed. A receipt has been sent to your email address.",
      featureTitle: "New feature available",
      featureDescription:
        "We've added dark mode support. You can enable it in your account settings.",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      paymentTitle: "تم الدفع بنجاح",
      paymentDescription:
        "تمت معالجة دفعتك البالغة 29.99 دولارًا. تم إرسال إيصال إلى عنوان بريدك الإلكتروني.",
      featureTitle: "ميزة جديدة متاحة",
      featureDescription:
        "لقد أضفنا دعم الوضع الداكن. يمكنك تفعيله في إعدادات حسابك.",
    },
  },
  he: {
    dir: "rtl",
    values: {
      paymentTitle: "התשלום בוצע בהצלחה",
      paymentDescription:
        "התשלום שלך בסך 29.99 דולר עובד. קבלה נשלחה לכתובת האימייל שלך.",
      featureTitle: "תכונה חדשה זמינה",
      featureDescription:
        "הוספנו תמיכה במצב כהה. אתה יכול להפעיל אותו בהגדרות החשבון שלך.",
    },
  },
};

const alerts = [
  {
    icon: CheckCircle2Icon,
    titleKey: "paymentTitle" as const,
    descriptionKey: "paymentDescription" as const,
  },
  {
    icon: InfoIcon,
    titleKey: "featureTitle" as const,
    descriptionKey: "featureDescription" as const,
  },
] as const;

export function AlertRtl() {
  const { dir, t } = useTranslation(translations, "ar");

  return (
    <div className="grid w-full max-w-md items-start gap-4" dir={dir}>
      {alerts.map((alert, index) => {
        const Icon = alert.icon;
        return (
          <Alert key={index}>
            <Icon />
            <AlertTitle>{t[alert.titleKey]}</AlertTitle>
            <AlertDescription>{t[alert.descriptionKey]}</AlertDescription>
          </Alert>
        );
      })}
    </div>
  );
}
```

## Referencia da API

### Alert

O component `Alert` exibe um aviso para chamar a atencao do usuario.

| Prop      | Type                         | Default     |
| --------- | ---------------------------- | ----------- |
| `variant` | `"default" \| "destructive"` | `"default"` |

### AlertTitle

O component `AlertTitle` exibe o titulo do alert.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| `className` | `string` | -       |

### AlertDescription

O component `AlertDescription` exibe a descricao ou conteudo do alert.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| `className` | `string` | -       |

### AlertAction

O component `AlertAction` exibe um elemento de acao (como um botao) posicionado de forma absoluta no canto superior direito do alert.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| `className` | `string` | -       |
