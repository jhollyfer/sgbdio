---
title: Gráfico
description: Gráficos bonitos. Construídos usando Recharts. Copie e cole em seus aplicativos.
base: radix
component: true
---

<Callout>

**Nota:** Estamos trabalhando na atualização para o Recharts v3. Enquanto isso, se você quiser começar a testar a v3, veja o código no comentário [aqui](https://github.com/shadcn-ui/ui/issues/7669#issuecomment-2998299159). Em breve teremos um lançamento oficial.

</Callout>

```tsx
"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/new-york-v4/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart";

export const description = "An interactive bar chart";

const chartData = [
  { date: "2024-04-01", desktop: 222, mobile: 150 },
  { date: "2024-04-02", desktop: 97, mobile: 180 },
  { date: "2024-04-03", desktop: 167, mobile: 120 },
  { date: "2024-04-04", desktop: 242, mobile: 260 },
  { date: "2024-04-05", desktop: 373, mobile: 290 },
  { date: "2024-04-06", desktop: 301, mobile: 340 },
  { date: "2024-04-07", desktop: 245, mobile: 180 },
  { date: "2024-04-08", desktop: 409, mobile: 320 },
  { date: "2024-04-09", desktop: 59, mobile: 110 },
  { date: "2024-04-10", desktop: 261, mobile: 190 },
  { date: "2024-04-11", desktop: 327, mobile: 350 },
  { date: "2024-04-12", desktop: 292, mobile: 210 },
  { date: "2024-04-13", desktop: 342, mobile: 380 },
  { date: "2024-04-14", desktop: 137, mobile: 220 },
  { date: "2024-04-15", desktop: 120, mobile: 170 },
  { date: "2024-04-16", desktop: 138, mobile: 190 },
  { date: "2024-04-17", desktop: 446, mobile: 360 },
  { date: "2024-04-18", desktop: 364, mobile: 410 },
  { date: "2024-04-19", desktop: 243, mobile: 180 },
  { date: "2024-04-20", desktop: 89, mobile: 150 },
  { date: "2024-04-21", desktop: 137, mobile: 200 },
  { date: "2024-04-22", desktop: 224, mobile: 170 },
  { date: "2024-04-23", desktop: 138, mobile: 230 },
  { date: "2024-04-24", desktop: 387, mobile: 290 },
  { date: "2024-04-25", desktop: 215, mobile: 250 },
  { date: "2024-04-26", desktop: 75, mobile: 130 },
  { date: "2024-04-27", desktop: 383, mobile: 420 },
  { date: "2024-04-28", desktop: 122, mobile: 180 },
  { date: "2024-04-29", desktop: 315, mobile: 240 },
  { date: "2024-04-30", desktop: 454, mobile: 380 },
];

const chartConfig = {
  views: {
    label: "Page Views",
  },
  desktop: {
    label: "Desktop",
    color: "var(--chart-2)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function ChartDemo() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("desktop");

  const total = React.useMemo(
    () => ({
      desktop: chartData.reduce((acc, curr) => acc + curr.desktop, 0),
      mobile: chartData.reduce((acc, curr) => acc + curr.mobile, 0),
    }),
    [],
  );

  return (
    <Card className="py-0 pb-4">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0">
          <CardTitle>Bar Chart - Interactive</CardTitle>
          <CardDescription>
            Showing total visitors for the last 3 months
          </CardDescription>
        </div>
        <div className="flex">
          {["desktop", "mobile"].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-muted-foreground text-xs">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg leading-none font-bold sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
```

Apresentando os **Charts**. Uma coleção de components de gráficos que você pode copiar e colar em seus aplicativos.

Os gráficos são projetados para ficarem ótimos desde o início. Eles funcionam bem com os outros components e são totalmente personalizáveis para se adequarem ao seu projeto.

[Explorar a Biblioteca de Gráficos](/charts).

## Componente

Usamos o [Recharts](https://recharts.org/) internamente.

Projetamos o component `chart` com composição em mente. **Você constrói seus gráficos usando components do Recharts e só traz components personalizados, como `ChartTooltip`, quando e onde precisar**.

```tsx showLineNumbers /ChartContainer/ /ChartTooltipContent/
import { Bar, BarChart } from "recharts";

import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

export function MyChart() {
  return (
    <ChartContainer>
      <BarChart data={data}>
        <Bar dataKey="value" />
        <ChartTooltip content={<ChartTooltipContent />} />
      </BarChart>
    </ChartContainer>
  );
}
```

Nós não encapsulamos o Recharts. Isso significa que você não está preso a uma abstração. Quando uma nova versão do Recharts for lançada, você pode seguir o caminho oficial de atualização para atualizar seus gráficos.

**Os components são seus**.

## Instalação

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Comando</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add chart
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Instale as seguintes dependências:</Step>

```bash
npm install recharts
```

<Step>Copie e cole o seguinte código em `components/ui/chart.tsx`.</Step>

<ComponentSource
  name="chart"
  title="components/ui/chart.tsx"
  styleName="radix-nova"
/>

<Step>Adicione as seguintes cores ao seu arquivo CSS</Step>

```css title="app/globals.css" showLineNumbers
@layer base {
  :root {
    --chart-1: oklch(0.646 0.222 41.116);
    --chart-2: oklch(0.6 0.118 184.704);
    --chart-3: oklch(0.398 0.07 227.392);
    --chart-4: oklch(0.828 0.189 84.429);
    --chart-5: oklch(0.769 0.188 70.08);
  }

  .dark {
    --chart-1: oklch(0.488 0.243 264.376);
    --chart-2: oklch(0.696 0.17 162.48);
    --chart-3: oklch(0.769 0.188 70.08);
    --chart-4: oklch(0.627 0.265 303.9);
    --chart-5: oklch(0.645 0.246 16.439);
  }
}
```

</Steps>

</TabsContent>

</CodeTabs>

## Seu Primeiro Gráfico

Vamos construir seu primeiro gráfico. Vamos construir um gráfico de barras, adicionar uma grade, eixo, tooltip e legenda.

<Steps>

<Step>Comece definindo seus dados</Step>

Os dados a seguir representam o número de usuários desktop e mobile para cada mês.

<Callout className="mt-4">

**Nota:** Seus dados podem ter qualquer formato. Você não está limitado ao formato dos dados abaixo. Use a prop `dataKey` para mapear seus dados para o gráfico.

</Callout>

```tsx title="components/example-chart.tsx" showLineNumbers
const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];
```

<Step>Defina a configuração do seu gráfico</Step>

A configuração do gráfico contém a configuração para o gráfico. É aqui que você coloca strings legíveis por humanos, como labels, ícones e tokens de cores para tematização.

```tsx title="components/example-chart.tsx" showLineNumbers
import { type ChartConfig } from "@/components/ui/chart";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
} satisfies ChartConfig;
```

<Step>Construa seu gráfico</Step>

Agora você pode construir seu gráfico usando components do Recharts.

<Callout className="mt-4 bg-amber-50 border-amber-200 dark:bg-amber-950/50 dark:border-amber-950">

**Importante:** Lembre-se de definir um `min-h-[VALUE]` no component `ChartContainer`. Isso é necessário para que o gráfico seja responsivo.

</Callout>

```tsx
"use client";

import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { Bar, BarChart } from "recharts";

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
} satisfies ChartConfig;

export function ChartExample() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={chartData}>
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
```

</Steps>

### Adicionar uma Grade

Vamos adicionar uma grade ao gráfico.

<Steps className="mb-0 pt-2">

<Step>Importe o component `CartesianGrid`.</Step>

```tsx /CartesianGrid/
import { Bar, BarChart, CartesianGrid } from "recharts";
```

<Step>Adicione o component `CartesianGrid` ao seu gráfico.</Step>

```tsx showLineNumbers {3}
<ChartContainer config={chartConfig} className="min-h-[200px] w-full">
  <BarChart accessibilityLayer data={chartData}>
    <CartesianGrid vertical={false} />
    <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
    <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
  </BarChart>
</ChartContainer>
```

```tsx
"use client";

import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid } from "recharts";

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
} satisfies ChartConfig;

export function ChartBarDemoGrid() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
```

</Steps>

### Adicionar um Eixo

Para adicionar um eixo x ao gráfico, usaremos o component `XAxis`.

<Steps className="mb-0 pt-2">

<Step>Importe o component `XAxis`.</Step>

```tsx /XAxis/
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
```

<Step>Adicione o component `XAxis` ao seu gráfico.</Step>

```tsx showLineNumbers {4-10}
<ChartContainer config={chartConfig} className="h-[200px] w-full">
  <BarChart accessibilityLayer data={chartData}>
    <CartesianGrid vertical={false} />
    <XAxis
      dataKey="month"
      tickLine={false}
      tickMargin={10}
      axisLine={false}
      tickFormatter={(value) => value.slice(0, 3)}
    />
    <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
    <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
  </BarChart>
</ChartContainer>
```

```tsx
"use client";

import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
} satisfies ChartConfig;

export function ChartBarDemoAxis() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
```

</Steps>

### Adicionar Tooltip

Até agora, usamos apenas components do Recharts. Eles ficam ótimos desde o início graças a algumas personalizações no component `chart`.

Para adicionar um tooltip, usaremos os components personalizados `ChartTooltip` e `ChartTooltipContent` de `chart`.

<Steps className="mb-0 pt-2">

<Step>Importe os components `ChartTooltip` e `ChartTooltipContent`.</Step>

```tsx
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
```

<Step>Adicione os components ao seu gráfico.</Step>

```tsx showLineNumbers {11}
<ChartContainer config={chartConfig} className="h-[200px] w-full">
  <BarChart accessibilityLayer data={chartData}>
    <CartesianGrid vertical={false} />
    <XAxis
      dataKey="month"
      tickLine={false}
      tickMargin={10}
      axisLine={false}
      tickFormatter={(value) => value.slice(0, 3)}
    />
    <ChartTooltip content={<ChartTooltipContent />} />
    <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
    <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
  </BarChart>
</ChartContainer>
```

```tsx
"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
} satisfies ChartConfig;

export function ChartBarDemoTooltip() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
```

Passe o mouse para ver os tooltips. Fácil, certo? Dois components, e temos um tooltip bonito.

</Steps>

### Adicionar Legenda

Faremos o mesmo para a legenda. Usaremos os components `ChartLegend` e `ChartLegendContent` de `chart`.

<Steps className="mb-0 pt-2">

<Step>Importe os components `ChartLegend` e `ChartLegendContent`.</Step>

```tsx
import { ChartLegend, ChartLegendContent } from "@/components/ui/chart";
```

<Step>Adicione os components ao seu gráfico.</Step>

```tsx showLineNumbers {12}
<ChartContainer config={chartConfig} className="h-[200px] w-full">
  <BarChart accessibilityLayer data={chartData}>
    <CartesianGrid vertical={false} />
    <XAxis
      dataKey="month"
      tickLine={false}
      tickMargin={10}
      axisLine={false}
      tickFormatter={(value) => value.slice(0, 3)}
    />
    <ChartTooltip content={<ChartTooltipContent />} />
    <ChartLegend content={<ChartLegendContent />} />
    <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
    <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
  </BarChart>
</ChartContainer>
```

```tsx
"use client";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
} satisfies ChartConfig;

export function ChartBarDemoLegend() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
```

</Steps>

Pronto. Você construiu seu primeiro gráfico! E agora?

- [Temas e Cores](/docs/components/chart#theming)
- [Tooltip](/docs/components/chart#tooltip)
- [Legenda](/docs/components/chart#legend)

## Configuração do Gráfico

A configuração do gráfico é onde você define os labels, ícones e cores para um gráfico.

Ela é intencionalmente desacoplada dos dados do gráfico.

Isso permite que você compartilhe configuração e tokens de cores entre gráficos. Também pode funcionar independentemente para casos em que seus dados ou tokens de cores estejam remotos ou em um formato diferente.

```tsx showLineNumbers /ChartConfig/
import { Monitor } from "lucide-react";

import { type ChartConfig } from "@/components/ui/chart";

const chartConfig = {
  desktop: {
    label: "Desktop",
    icon: Monitor,
    // A color like 'hsl(220, 98%, 61%)' or 'var(--color-name)'
    color: "#2563eb",
    // OR a theme object with 'light' and 'dark' keys
    theme: {
      light: "#2563eb",
      dark: "#dc2626",
    },
  },
} satisfies ChartConfig;
```

## Tematização

Os gráficos possuem suporte integrado para tematização. Você pode usar variáveis CSS (recomendado) ou valores de cores em qualquer formato, como hex, hsl ou oklch.

### Variáveis CSS

<Steps className="mb-0 pt-2">

<Step>Defina suas cores no seu arquivo CSS</Step>

```css title="app/globals.css" showLineNumbers
@layer base {
  :root {
    --chart-1: oklch(0.646 0.222 41.116);
    --chart-2: oklch(0.6 0.118 184.704);
  }

  .dark: {
    --chart-1: oklch(0.488 0.243 264.376);
    --chart-2: oklch(0.696 0.17 162.48);
  }
}
```

<Step>Adicione a cor ao seu `chartConfig`</Step>

```tsx title="components/example-chart.tsx" showLineNumbers
const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;
```

</Steps>

### hex, hsl ou oklch

Você também pode definir suas cores diretamente na configuração do gráfico. Use o formato de cor que preferir.

```tsx title="components/example-chart.tsx" showLineNumbers
const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(220, 98%, 61%)",
  },
  tablet: {
    label: "Tablet",
    color: "oklch(0.5 0.2 240)",
  },
  laptop: {
    label: "Laptop",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;
```

### Usando Cores

Para usar as cores do tema no seu gráfico, referencie as cores usando o formato `var(--color-KEY)`.

#### Components

```tsx
<Bar dataKey="desktop" fill="var(--color-desktop)" />
```

#### Dados do Gráfico

```tsx title="components/example-chart.tsx" showLineNumbers
const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
];
```

#### Tailwind

```tsx title="components/example-chart.tsx"
<LabelList className="fill-[--color-desktop]" />
```

## Tooltip

Um tooltip de gráfico contém um label, nome, indicador e valor. Você pode usar uma combinação destes para personalizar seu tooltip.

```tsx
"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export function ChartTooltipDemo() {
  return (
    <div className="text-foreground grid aspect-video w-full max-w-md justify-center md:grid-cols-2 [&>div]:relative [&>div]:flex [&>div]:h-[137px] [&>div]:w-[224px] [&>div]:items-center [&>div]:justify-center [&>div]:p-4">
      <div>
        <div className="absolute top-[45px] left-[-35px] z-10 text-sm font-medium">
          Label
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 193 40"
          width="50"
          height="12"
          fill="none"
          className="absolute top-[50px] left-[5px] z-10"
        >
          <g clipPath="url(#a)">
            <path
              fill="currentColor"
              d="M173.928 21.13C115.811 44.938 58.751 45.773 0 26.141c4.227-4.386 7.82-2.715 10.567-1.88 21.133 5.64 42.9 6.266 64.457 7.101 31.066 1.253 60.441-5.848 89.183-17.335 1.268-.418 2.325-1.253 4.861-2.924-14.582-2.924-29.165 2.089-41.845-3.76.212-.835.212-1.879.423-2.714 9.51-.627 19.231-1.253 28.742-2.089 9.51-.835 18.808-1.88 28.318-2.506 6.974-.418 9.933 2.924 7.397 9.19-3.17 8.145-7.608 15.664-11.623 23.391-.423.836-1.057 1.88-1.902 2.298-2.325.835-4.65 1.044-7.186 1.67-.422-2.088-1.479-4.386-1.268-6.265.423-2.506 1.902-4.595 3.804-9.19Z"
            />
          </g>
          <defs>
            <clipPath id="a">
              <path fill="currentColor" d="M0 0h193v40H0z" />
            </clipPath>
          </defs>
        </svg>
        <TooltipDemo
          label="Page Views"
          payload={[
            { name: "Desktop", value: 186, fill: "var(--chart-1)" },
            { name: "Mobile", value: 80, fill: "var(--chart-2)" },
          ]}
          className="w-[8rem]"
        />
      </div>
      <div className="items-end">
        <div className="absolute top-[0px] left-[122px] z-10 text-sm font-medium">
          Name
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="35"
          height="42"
          fill="none"
          viewBox="0 0 122 148"
          className="absolute top-[10px] left-[85px] z-10 -scale-x-100"
        >
          <g clipPath="url(#ab)">
            <path
              fill="currentColor"
              d="M0 2.65c6.15-4.024 12.299-2.753 17.812-.847a115.56 115.56 0 0 1 21.84 10.59C70.4 32.727 88.849 61.744 96.483 97.54c1.908 9.108 2.544 18.639 3.817 29.017 8.481-4.871 12.934-14.402 21.416-19.909 1.061 4.236-1.06 6.989-2.756 9.319-6.998 9.531-14.207 19.062-21.63 28.382-3.604 4.448-6.36 4.871-10.177 1.059-8.058-7.837-12.935-17.368-14.42-28.382 0-.424.636-1.059 1.485-2.118 9.118 2.33 6.997 13.979 14.843 18.215 3.393-14.614.848-28.593-2.969-42.149-4.029-14.19-9.33-27.746-17.812-39.82-8.27-11.86-18.66-21.392-30.11-30.287C26.93 11.758 14.207 6.039 0 2.65Z"
            />
          </g>
          <defs>
            <clipPath id="ab">
              <path fill="currentColor" d="M0 0h122v148H0z" />
            </clipPath>
          </defs>
        </svg>
        <TooltipDemo
          label="Browser"
          hideLabel
          payload={[
            { name: "Chrome", value: 1286, fill: "var(--chart-3)" },
            { name: "Firefox", value: 1000, fill: "var(--chart-4)" },
          ]}
          indicator="dashed"
          className="w-[8rem]"
        />
      </div>
      <div className="!hidden md:!flex">
        <TooltipDemo
          label="Page Views"
          payload={[{ name: "Desktop", value: 12486, fill: "var(--chart-3)" }]}
          className="w-[9rem]"
          indicator="line"
        />
      </div>
      <div className="!items-start !justify-start">
        <div className="absolute top-[60px] left-[50px] z-10 text-sm font-medium">
          Indicator
        </div>
        <TooltipDemo
          label="Browser"
          hideLabel
          payload={[{ name: "Chrome", value: 1286, fill: "var(--chart-1)" }]}
          indicator="dot"
          className="w-[8rem]"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="34"
          fill="none"
          viewBox="0 0 75 175"
          className="absolute top-[38px] left-[30px] z-10 rotate-[-40deg]"
        >
          <g clipPath="url(#abc)">
            <path
              fill="currentColor"
              d="M20.187 175c-4.439-2.109-7.186-2.531-8.032-4.008-3.17-5.484-6.763-10.968-8.454-17.084-5.073-16.242-4.439-32.694-1.057-49.146 5.707-28.053 18.388-52.942 34.24-76.565 1.692-2.531 3.171-5.063 4.862-7.805 0-.21-.211-.632-.634-1.265-4.65 1.265-9.511 2.53-14.161 3.585-2.537.422-5.496.422-8.032-.421-1.48-.422-3.593-2.742-3.593-4.219 0-1.898 1.48-4.218 2.747-5.906 1.057-1.054 2.96-1.265 4.65-1.687C35.406 7.315 48.088 3.729 60.98.776c10.99-2.53 14.584 1.055 13.95 11.812-.634 11.18-.846 22.358-1.268 33.326-.212 3.375-.846 6.96-1.268 10.757-8.878-4.007-8.878-4.007-12.048-38.177C47.03 33.259 38.153 49.289 29.91 65.741 21.667 82.193 16.17 99.49 13.212 117.84c-2.959 18.984.634 36.912 6.975 57.161Z"
            />
          </g>
          <defs>
            <clipPath id="abc">
              <path fill="currentColor" d="M0 0h75v175H0z" />
            </clipPath>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function TooltipDemo({
  indicator = "dot",
  label,
  payload,
  hideLabel,
  hideIndicator,
  className,
}: {
  label: string;
  hideLabel?: boolean;
  hideIndicator?: boolean;
  indicator?: "line" | "dot" | "dashed";
  payload: {
    name: string;
    value: number;
    fill: string;
  }[];
  nameKey?: string;
  labelKey?: string;
} & React.ComponentProps<"div">) {
  const tooltipLabel = hideLabel ? null : (
    <div className="font-medium">{label}</div>
  );

  if (!payload?.length) {
    return null;
  }

  const nestLabel = payload.length === 1 && indicator !== "dot";

  return (
    <div
      className={cn(
        "border-border/50 bg-background grid min-w-[8rem] items-start gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl transition-all ease-in-out hover:-translate-y-0.5",
        className,
      )}
    >
      {!nestLabel ? tooltipLabel : null}
      <div className="grid gap-1.5">
        {payload.map((item, index) => {
          const indicatorColor = item.fill;

          return (
            <div
              key={index}
              className={cn(
                "[&>svg]:text-muted-foreground flex w-full items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5",
                indicator === "dot" && "items-center",
              )}
            >
              <>
                {!hideIndicator && (
                  <div
                    className={cn(
                      "shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]",
                      {
                        "h-2.5 w-2.5": indicator === "dot",
                        "w-1": indicator === "line",
                        "w-0 border-[1.5px] border-dashed bg-transparent":
                          indicator === "dashed",
                        "my-0.5": nestLabel && indicator === "dashed",
                      },
                    )}
                    style={
                      {
                        "--color-bg": indicatorColor,
                        "--color-border": indicatorColor,
                      } as React.CSSProperties
                    }
                  />
                )}
                <div
                  className={cn(
                    "flex flex-1 justify-between leading-none",
                    nestLabel ? "items-end" : "items-center",
                  )}
                >
                  <div className="grid gap-1.5">
                    {nestLabel ? tooltipLabel : null}
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="text-foreground font-mono font-medium tabular-nums">
                    {item.value.toLocaleString()}
                  </span>
                </div>
              </>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

Você pode ativar/desativar qualquer um destes usando as props `hideLabel`, `hideIndicator` e personalizar o estilo do indicador usando a prop `indicator`.

Use `labelKey` e `nameKey` para usar uma chave personalizada para o label e o nome do tooltip.

Chart vem com os components `<ChartTooltip>` e `<ChartTooltipContent>`. Você pode usar esses dois components para adicionar tooltips personalizados ao seu gráfico.

```tsx title="components/example-chart.tsx"
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
```

```tsx title="components/example-chart.tsx"
<ChartTooltip content={<ChartTooltipContent />} />
```

### Props

Use as seguintes props para personalizar o tooltip.

| Prop            | Tipo                     | Descrição                                          |
| :-------------- | :----------------------- | :------------------------------------------------- |
| `labelKey`      | string                   | A chave de configuração ou dados a usar para o label. |
| `nameKey`       | string                   | A chave de configuração ou dados a usar para o nome.  |
| `indicator`     | `dot` `line` ou `dashed` | O estilo do indicador para o tooltip.              |
| `hideLabel`     | boolean                  | Se deve ocultar o label.                           |
| `hideIndicator` | boolean                  | Se deve ocultar o indicador.                       |

### Cores

As cores são automaticamente referenciadas da configuração do gráfico.

### Personalizado

Para usar uma chave personalizada para o label e nomes do tooltip, use as props `labelKey` e `nameKey`.

```tsx showLineNumbers /browser/
const chartData = [
  { browser: "chrome", visitors: 187, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
];

const chartConfig = {
  visitors: {
    label: "Total Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;
```

```tsx title="components/example-chart.tsx"
<ChartTooltip
  content={<ChartTooltipContent labelKey="visitors" nameKey="browser" />}
/>
```

Isso usará `Total Visitors` para o label e `Chrome` e `Safari` para os nomes do tooltip.

## Legenda

Você pode usar os components personalizados `<ChartLegend>` e `<ChartLegendContent>` para adicionar uma legenda ao seu gráfico.

```tsx title="components/example-chart.tsx"
import { ChartLegend, ChartLegendContent } from "@/components/ui/chart";
```

```tsx title="components/example-chart.tsx"
<ChartLegend content={<ChartLegendContent />} />
```

### Cores

As cores são automaticamente referenciadas da configuração do gráfico.

### Personalizado

Para usar uma chave personalizada para nomes da legenda, use a prop `nameKey`.

```tsx showLineNumbers /browser/
const chartData = [
  { browser: "chrome", visitors: 187, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
];

const chartConfig = {
  chrome: {
    label: "Chrome",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;
```

```tsx title="components/example-chart.tsx"
<ChartLegend content={<ChartLegendContent nameKey="browser" />} />
```

Isso usará `Chrome` e `Safari` para os nomes da legenda.

## Acessibilidade

Você pode ativar a prop `accessibilityLayer` para adicionar uma camada acessível ao seu gráfico.

Esta prop adiciona acesso por teclado e suporte a leitor de tela aos seus gráficos.

```tsx title="components/example-chart.tsx"
<LineChart accessibilityLayer />
```

## RTL

Para habilitar o suporte RTL no shadcn/ui, consulte o [guia de configuração RTL](/docs/rtl).

```tsx
"use client";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/examples/base/ui-rtl/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  useTranslation,
  type Translations,
} from "@/components/language-selector";

const translations: Translations = {
  en: {
    dir: "ltr",
    values: {
      january: "January",
      february: "February",
      march: "March",
      april: "April",
      may: "May",
      june: "June",
      desktop: "Desktop",
      mobile: "Mobile",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      january: "يناير",
      february: "فبراير",
      march: "مارس",
      april: "أبريل",
      may: "مايو",
      june: "يونيو",
      desktop: "سطح المكتب",
      mobile: "الجوال",
    },
  },
  he: {
    dir: "rtl",
    values: {
      january: "ינואר",
      february: "פברואר",
      march: "מרץ",
      april: "אפריל",
      may: "מאי",
      june: "יוני",
      desktop: "מחשב",
      mobile: "נייד",
    },
  },
};

const chartData = [
  { month: "january", desktop: 186, mobile: 80 },
  { month: "february", desktop: 305, mobile: 200 },
  { month: "march", desktop: 237, mobile: 120 },
  { month: "april", desktop: 73, mobile: 190 },
  { month: "may", desktop: 209, mobile: 130 },
  { month: "june", desktop: 214, mobile: 140 },
];

export function ChartRtl() {
  const { t, dir } = useTranslation(translations, "ar");

  const chartConfig = {
    desktop: {
      label: t.desktop,
      color: "var(--chart-2)",
    },
    mobile: {
      label: t.mobile,
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid
          vertical={false}
          orientation={dir === "rtl" ? "right" : "left"}
        />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) =>
            (t[value as keyof typeof t] as string).slice(0, 3)
          }
          reversed={dir === "rtl"}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              labelFormatter={(value) => t[value as keyof typeof t] as string}
            />
          }
          labelClassName="w-32"
        />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
```
