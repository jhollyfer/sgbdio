---
title: Carousel
description: Um carousel com movimento e deslize construido usando Embla.
base: radix
component: true
links:
  doc: https://www.embla-carousel.com/get-started/react
  api: https://www.embla-carousel.com/api
---

```tsx
import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function CarouselDemo() {
  return (
    <Carousel className="w-full max-w-[12rem] sm:max-w-xs">
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-4xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
```

## Sobre

O component carousel e construido usando a biblioteca [Embla Carousel](https://www.embla-carousel.com/).

## Instalacao

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Comando</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>

<TabsContent value="cli">

```bash
npx shadcn@latest add carousel
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Instale as seguintes dependencias:</Step>

```bash
npm install embla-carousel-react
```

<Step>Copie e cole o codigo a seguir no seu projeto.</Step>

<ComponentSource
  name="carousel"
  title="components/ui/carousel.tsx"
  styleName="radix-nova"
/>

<Step>Atualize os caminhos de importacao para corresponder a configuracao do seu projeto.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Uso

```tsx showLineNumbers
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
```

```tsx showLineNumbers
<Carousel>
  <CarouselContent>
    <CarouselItem>...</CarouselItem>
    <CarouselItem>...</CarouselItem>
    <CarouselItem>...</CarouselItem>
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>
```

## Exemplos

### Tamanhos

Para definir o tamanho dos itens, voce pode usar a classe utilitaria `basis` no `<CarouselItem />`.

```tsx
import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function CarouselSize() {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full max-w-[12rem] sm:max-w-xs md:max-w-sm"
    >
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index} className="basis-1/2 lg:basis-1/3">
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-3xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
```

```tsx showLineNumbers {4-6}
// 33% of the carousel width.
<Carousel>
  <CarouselContent>
    <CarouselItem className="basis-1/3">...</CarouselItem>
    <CarouselItem className="basis-1/3">...</CarouselItem>
    <CarouselItem className="basis-1/3">...</CarouselItem>
  </CarouselContent>
</Carousel>
```

```tsx showLineNumbers {4-6}
// 50% on small screens and 33% on larger screens.
<Carousel>
  <CarouselContent>
    <CarouselItem className="md:basis-1/2 lg:basis-1/3">...</CarouselItem>
    <CarouselItem className="md:basis-1/2 lg:basis-1/3">...</CarouselItem>
    <CarouselItem className="md:basis-1/2 lg:basis-1/3">...</CarouselItem>
  </CarouselContent>
</Carousel>
```

### Espacamento

Para definir o espacamento entre os itens, usamos uma classe utilitaria `pl-[VALUE]` no `<CarouselItem />` e um negativo `-ml-[VALUE]` no `<CarouselContent />`.

```tsx
import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function CarouselSpacing() {
  return (
    <Carousel className="w-full max-w-[12rem] sm:max-w-xs md:max-w-sm">
      <CarouselContent className="-ml-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index} className="basis-1/2 pl-1 lg:basis-1/3">
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-2xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
```

```tsx showLineNumbers /-ml-4/ /pl-4/
<Carousel>
  <CarouselContent className="-ml-4">
    <CarouselItem className="pl-4">...</CarouselItem>
    <CarouselItem className="pl-4">...</CarouselItem>
    <CarouselItem className="pl-4">...</CarouselItem>
  </CarouselContent>
</Carousel>
```

```tsx showLineNumbers /-ml-2/ /pl-2/ /md:-ml-4/ /md:pl-4/
<Carousel>
  <CarouselContent className="-ml-2 md:-ml-4">
    <CarouselItem className="pl-2 md:pl-4">...</CarouselItem>
    <CarouselItem className="pl-2 md:pl-4">...</CarouselItem>
    <CarouselItem className="pl-2 md:pl-4">...</CarouselItem>
  </CarouselContent>
</Carousel>
```

### Orientacao

Use a prop `orientation` para definir a orientacao do carousel.

```tsx
import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function CarouselOrientation() {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      orientation="vertical"
      className="w-full max-w-xs"
    >
      <CarouselContent className="-mt-1 h-[270px]">
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index} className="basis-1/2 pt-1">
            <div className="p-1">
              <Card>
                <CardContent className="flex items-center justify-center p-6">
                  <span className="text-3xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
```

```tsx showLineNumbers /vertical | horizontal/
<Carousel orientation="vertical | horizontal">
  <CarouselContent>
    <CarouselItem>...</CarouselItem>
    <CarouselItem>...</CarouselItem>
    <CarouselItem>...</CarouselItem>
  </CarouselContent>
</Carousel>
```

## Opcoes

Voce pode passar opcoes para o carousel usando a prop `opts`. Consulte a [documentacao do Embla Carousel](https://www.embla-carousel.com/api/options/) para mais informacoes.

```tsx showLineNumbers {2-5}
<Carousel
  opts={{
    align: "start",
    loop: true,
  }}
>
  <CarouselContent>
    <CarouselItem>...</CarouselItem>
    <CarouselItem>...</CarouselItem>
    <CarouselItem>...</CarouselItem>
  </CarouselContent>
</Carousel>
```

## API

Use um state e a prop `setApi` para obter uma instancia da API do carousel.

```tsx
"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

export function CarouselDApiDemo() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="mx-auto max-w-[10rem] sm:max-w-xs">
      <Carousel setApi={setApi} className="w-full max-w-xs">
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index}>
              <Card className="m-px">
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-4xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <div className="text-muted-foreground py-2 text-center text-sm">
        Slide {current} of {count}
      </div>
    </div>
  );
}
```

```tsx showLineNumbers {1,4,22}
import { type CarouselApi } from "@/components/ui/carousel";

export function Example() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <Carousel setApi={setApi}>
      <CarouselContent>
        <CarouselItem>...</CarouselItem>
        <CarouselItem>...</CarouselItem>
        <CarouselItem>...</CarouselItem>
      </CarouselContent>
    </Carousel>
  );
}
```

## Eventos

Voce pode ouvir eventos usando a instancia da API obtida via `setApi`.

```tsx showLineNumbers {1,4-14,16}
import { type CarouselApi } from "@/components/ui/carousel";

export function Example() {
  const [api, setApi] = React.useState<CarouselApi>();

  React.useEffect(() => {
    if (!api) {
      return;
    }

    api.on("select", () => {
      // Do something on select.
    });
  }, [api]);

  return (
    <Carousel setApi={setApi}>
      <CarouselContent>
        <CarouselItem>...</CarouselItem>
        <CarouselItem>...</CarouselItem>
        <CarouselItem>...</CarouselItem>
      </CarouselContent>
    </Carousel>
  );
}
```

Consulte a [documentacao do Embla Carousel](https://www.embla-carousel.com/api/events/) para mais informacoes sobre o uso de eventos.

## Plugins

Voce pode usar a prop `plugins` para adicionar plugins ao carousel.

```ts showLineNumbers {1,6-10}
import Autoplay from "embla-carousel-autoplay"

export function Example() {
  return (
    <Carousel
      plugins={[
        Autoplay({
          delay: 2000,
        }),
      ]}
    >
      // ...
    </Carousel>
  )
}
```

```tsx
"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export function CarouselPlugin() {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true }),
  );

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full max-w-[10rem] sm:max-w-xs"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-4xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
```

## RTL

Para habilitar o suporte RTL no shadcn/ui, consulte o [guia de configuracao RTL](/docs/rtl).

```tsx
"use client";

import { Card, CardContent } from "@/examples/radix/ui-rtl/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/examples/radix/ui-rtl/carousel";

import {
  useTranslation,
  type Translations,
} from "@/components/language-selector";

const translations: Translations = {
  en: {
    dir: "ltr",
    values: {},
  },
  ar: {
    dir: "rtl",
    values: {},
  },
  he: {
    dir: "rtl",
    values: {},
  },
};

function toArabicNumerals(num: number): string {
  const arabicNumerals = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return num
    .toString()
    .split("")
    .map((digit) => arabicNumerals[parseInt(digit, 10)])
    .join("");
}

export function CarouselRtl() {
  const { dir, language } = useTranslation(translations, "ar");

  const formatNumber = (num: number): string => {
    if (language === "ar") {
      return toArabicNumerals(num);
    }
    return num.toString();
  };

  return (
    <Carousel
      dir={dir}
      className="w-full max-w-[12rem] sm:max-w-xs"
      opts={{
        direction: dir,
      }}
    >
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card dir={dir}>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-4xl font-semibold">
                    {formatNumber(index + 1)}
                  </span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
```

Ao localizar o carousel para idiomas RTL, voce precisa definir a opcao `direction` na prop `opts` para corresponder a direcao do texto. Isso garante que o carousel role na direcao correta.

```tsx showLineNumbers {2-5}
<Carousel
  dir={dir}
  opts={{
    direction: dir,
  }}
>
  <CarouselContent>
    <CarouselItem>...</CarouselItem>
    <CarouselItem>...</CarouselItem>
    <CarouselItem>...</CarouselItem>
  </CarouselContent>
  <CarouselPrevious className="rtl:rotate-180" />
  <CarouselNext className="rtl:rotate-180" />
</Carousel>
```

A opcao `direction` aceita `"ltr"` ou `"rtl"` e deve corresponder ao valor da prop `dir`. Voce tambem pode querer rotacionar os botoes de navegacao usando a classe `rtl:rotate-180` para garantir que eles apontem na direcao correta.

## Referencia da API

Consulte a [documentacao do Embla Carousel](https://www.embla-carousel.com/api/plugins/) para mais informacoes sobre props e plugins.
