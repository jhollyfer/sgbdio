---
title: Tabs
description: Um conjunto de secoes de conteudo em camadas — conhecidas como paineis de abas — que sao exibidas uma de cada vez.
base: radix
component: true
links:
  doc: https://www.radix-ui.com/docs/primitives/components/tabs
  api: https://www.radix-ui.com/docs/primitives/components/tabs#api-reference
---

```tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function TabsDemo() {
  return (
    <Tabs defaultValue="overview" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>
              View your key metrics and recent project activity. Track progress
              across all your active projects.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            You have 12 active projects and 3 pending tasks.
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="analytics">
        <Card>
          <CardHeader>
            <CardTitle>Analytics</CardTitle>
            <CardDescription>
              Track performance and user engagement metrics. Monitor trends and
              identify growth opportunities.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            Page views are up 25% compared to last month.
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="reports">
        <Card>
          <CardHeader>
            <CardTitle>Reports</CardTitle>
            <CardDescription>
              Generate and download your detailed reports. Export data in
              multiple formats for analysis.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            You have 5 reports ready and available to export.
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="settings">
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>
              Manage your account preferences and options. Customize your
              experience to fit your needs.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            Configure notifications, security, and themes.
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
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
npx shadcn@latest add tabs
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
  name="tabs"
  title="components/ui/tabs.tsx"
  styleName="radix-nova"
/>

<Step>Atualize os caminhos de importacao para corresponder a configuracao do seu projeto.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Uso

```tsx showLineNumbers
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
```

```tsx showLineNumbers
<Tabs defaultValue="account" className="w-[400px]">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">Make changes to your account here.</TabsContent>
  <TabsContent value="password">Change your password here.</TabsContent>
</Tabs>
```

## Exemplos

### Linha

Use a prop `variant="line"` no `TabsList` para um estilo de linha.

```tsx
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function TabsLine() {
  return (
    <Tabs defaultValue="overview">
      <TabsList variant="line">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
```

### Vertical

Use `orientation="vertical"` para abas verticais.

```tsx
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function TabsVertical() {
  return (
    <Tabs defaultValue="account" orientation="vertical">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
```

### Desabilitado

```tsx
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function TabsDisabled() {
  return (
    <Tabs defaultValue="home">
      <TabsList>
        <TabsTrigger value="home">Home</TabsTrigger>
        <TabsTrigger value="settings" disabled>
          Disabled
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
```

### Icones

```tsx
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppWindowIcon, CodeIcon } from "lucide-react";

export function TabsIcons() {
  return (
    <Tabs defaultValue="preview">
      <TabsList>
        <TabsTrigger value="preview">
          <AppWindowIcon />
          Preview
        </TabsTrigger>
        <TabsTrigger value="code">
          <CodeIcon />
          Code
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
```

## RTL

Para habilitar o suporte RTL no shadcn/ui, consulte o [guia de configuracao RTL](/docs/rtl).

```tsx
"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/examples/radix/ui-rtl/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/examples/radix/ui-rtl/tabs";

import {
  useTranslation,
  type Translations,
} from "@/components/language-selector";

const translations: Translations = {
  en: {
    dir: "ltr",
    values: {
      overview: "Overview",
      analytics: "Analytics",
      reports: "Reports",
      settings: "Settings",
      overviewTitle: "Overview",
      overviewDesc:
        "View your key metrics and recent project activity. Track progress across all your active projects.",
      overviewContent: "You have 12 active projects and 3 pending tasks.",
      analyticsTitle: "Analytics",
      analyticsDesc:
        "Track performance and user engagement metrics. Monitor trends and identify growth opportunities.",
      analyticsContent: "Page views are up 25% compared to last month.",
      reportsTitle: "Reports",
      reportsDesc:
        "Generate and download your detailed reports. Export data in multiple formats for analysis.",
      reportsContent: "You have 5 reports ready and available to export.",
      settingsTitle: "Settings",
      settingsDesc:
        "Manage your account preferences and options. Customize your experience to fit your needs.",
      settingsContent: "Configure notifications, security, and themes.",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      overview: "نظرة عامة",
      analytics: "التحليلات",
      reports: "التقارير",
      settings: "الإعدادات",
      overviewTitle: "نظرة عامة",
      overviewDesc:
        "عرض مقاييسك الرئيسية وأنشطة المشروع الأخيرة. تتبع التقدم عبر جميع مشاريعك النشطة.",
      overviewContent: "لديك ١٢ مشروعًا نشطًا و٣ مهام معلقة.",
      analyticsTitle: "التحليلات",
      analyticsDesc:
        "تتبع مقاييس الأداء ومشاركة المستخدمين. راقب الاتجاهات وحدد فرص النمو.",
      analyticsContent: "زادت مشاهدات الصفحة بنسبة ٢٥٪ مقارنة بالشهر الماضي.",
      reportsTitle: "التقارير",
      reportsDesc:
        "إنشاء وتنزيل تقاريرك التفصيلية. تصدير البيانات بتنسيقات متعددة للتحليل.",
      reportsContent: "لديك ٥ تقارير جاهزة ومتاحة للتصدير.",
      settingsTitle: "الإعدادات",
      settingsDesc:
        "إدارة تفضيلات حسابك وخياراته. تخصيص تجربتك لتناسب احتياجاتك.",
      settingsContent: "تكوين الإشعارات والأمان والسمات.",
    },
  },
  he: {
    dir: "rtl",
    values: {
      overview: "סקירה כללית",
      analytics: "אנליטיקה",
      reports: "דוחות",
      settings: "הגדרות",
      overviewTitle: "סקירה כללית",
      overviewDesc:
        "הצג את המדדים העיקריים שלך ופעילות הפרויקט האחרונה. עקוב אחר התקדמות בכל הפרויקטים הפעילים שלך.",
      overviewContent: "יש לך 12 פרויקטים פעילים ו-3 משימות ממתינות.",
      analyticsTitle: "אנליטיקה",
      analyticsDesc:
        "עקוב אחר ביצועים ומדדי מעורבות משתמשים. עקוב אחר מגמות וזהה הזדמנויות צמיחה.",
      analyticsContent: "צפיות בדף עלו ב-25% בהשוואה לחודש שעבר.",
      reportsTitle: "דוחות",
      reportsDesc:
        "צור והורד את הדוחות המפורטים שלך. ייצא נתונים בפורמטים מרובים לניתוח.",
      reportsContent: "יש לך 5 דוחות מוכנים וזמינים לייצוא.",
      settingsTitle: "הגדרות",
      settingsDesc:
        "נהל את העדפות החשבון והאפשרויות שלך. התאם אישית את החוויה שלך כך שתתאים לצרכים שלך.",
      settingsContent: "הגדר התראות, אבטחה וערכות נושא.",
    },
  },
};

export function TabsRtl() {
  const { dir, t } = useTranslation(translations, "ar");

  return (
    <Tabs defaultValue="overview" className="w-full max-w-sm" dir={dir}>
      <TabsList dir={dir}>
        <TabsTrigger value="overview">{t.overview}</TabsTrigger>
        <TabsTrigger value="analytics">{t.analytics}</TabsTrigger>
        <TabsTrigger value="reports">{t.reports}</TabsTrigger>
        <TabsTrigger value="settings">{t.settings}</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <Card dir={dir}>
          <CardHeader>
            <CardTitle>{t.overviewTitle}</CardTitle>
            <CardDescription>{t.overviewDesc}</CardDescription>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            {t.overviewContent}
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="analytics">
        <Card dir={dir}>
          <CardHeader>
            <CardTitle>{t.analyticsTitle}</CardTitle>
            <CardDescription>{t.analyticsDesc}</CardDescription>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            {t.analyticsContent}
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="reports">
        <Card dir={dir}>
          <CardHeader>
            <CardTitle>{t.reportsTitle}</CardTitle>
            <CardDescription>{t.reportsDesc}</CardDescription>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            {t.reportsContent}
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="settings">
        <Card dir={dir}>
          <CardHeader>
            <CardTitle>{t.settingsTitle}</CardTitle>
            <CardDescription>{t.settingsDesc}</CardDescription>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            {t.settingsContent}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
```

## Referencia da API

Consulte a documentacao do [Radix Tabs](https://www.radix-ui.com/docs/primitives/components/tabs#api-reference).
