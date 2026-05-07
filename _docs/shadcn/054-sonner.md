---
title: Sonner
description: Um component de toast opinativo para React.
base: radix
component: true
links:
  doc: https://sonner.emilkowal.ski
---

```tsx
"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function SonnerDemo() {
  return (
    <Button
      variant="outline"
      onClick={() =>
        toast("Event has been created", {
          description: "Sunday, December 03, 2023 at 9:00 AM",
          action: {
            label: "Undo",
            onClick: () => console.log("Undo"),
          },
        })
      }
    >
      Show Toast
    </Button>
  );
}
```

## Sobre

Sonner é construído e mantido por [emilkowalski](https://twitter.com/emilkowalski).

## Instalação

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Comando</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

<Steps className="mb-0 pt-2">

<Step>Execute o seguinte comando:</Step>

```bash
npx shadcn@latest add sonner
```

<Step>Adicione o component Toaster</Step>

```tsx title="app/layout.tsx" {1,9} showLineNumbers
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body>
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
```

</Steps>

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Instale as seguintes dependências:</Step>

```bash
npm install sonner next-themes
```

<Step>Copie e cole o código a seguir no seu projeto.</Step>

<ComponentSource
  name="sonner"
  title="components/ui/sonner.tsx"
  styleName="radix-nova"
/>

<Step>Adicione o component Toaster</Step>

```tsx showLineNumbers title="app/layout.tsx" {1,8}
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body>
        <Toaster />
        <main>{children}</main>
      </body>
    </html>
  );
}
```

</Steps>

</TabsContent>

</CodeTabs>

## Uso

```tsx
import { toast } from "sonner";
```

```tsx
toast("Event has been created.");
```

## Exemplos

### Tipos

```tsx
"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function SonnerTypes() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" onClick={() => toast("Event has been created")}>
        Default
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.success("Event has been created")}
      >
        Success
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.info("Be at the area 10 minutes before the event time")
        }
      >
        Info
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.warning("Event start time cannot be earlier than 8am")
        }
      >
        Warning
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.error("Event has not been created")}
      >
        Error
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          toast.promise<{ name: string }>(
            () =>
              new Promise((resolve) =>
                setTimeout(() => resolve({ name: "Event" }), 2000),
              ),
            {
              loading: "Loading...",
              success: (data) => `${data.name} has been created`,
              error: "Error",
            },
          );
        }}
      >
        Promise
      </Button>
    </div>
  );
}
```

### Descrição

```tsx
"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function SonnerDescription() {
  return (
    <Button
      onClick={() =>
        toast("Event has been created", {
          description: "Monday, January 3rd at 6:00pm",
        })
      }
      variant="outline"
      className="w-fit"
    >
      Show Toast
    </Button>
  );
}
```

### Posição

Use a prop `position` para alterar a posição do toast.

```tsx
"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function SonnerPosition() {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      <Button
        variant="outline"
        onClick={() =>
          toast("Event has been created", { position: "top-left" })
        }
      >
        Top Left
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast("Event has been created", { position: "top-center" })
        }
      >
        Top Center
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast("Event has been created", { position: "top-right" })
        }
      >
        Top Right
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast("Event has been created", { position: "bottom-left" })
        }
      >
        Bottom Left
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast("Event has been created", { position: "bottom-center" })
        }
      >
        Bottom Center
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast("Event has been created", { position: "bottom-right" })
        }
      >
        Bottom Right
      </Button>
    </div>
  );
}
```

## Referência da API

Consulte a [Referência da API do Sonner](https://sonner.emilkowal.ski/getting-started) para mais informações.
