---
id: hydration-errors
title: Hydration Errors
---

### Por que isso acontece

- **Incompatibilidade**: O HTML do servidor difere do render do cliente durante a hydration
- **Causas comuns**: `Intl` (locale/fuso horario), `Date.now()`, IDs aleatorios, logica apenas responsiva, feature flags, preferencias do usuario

### Estrategia 1 — Fazer servidor e cliente coincidirem

- **Escolha um locale/fuso horario deterministico no servidor** e use o mesmo no cliente
- **Fonte de verdade**: cookie (preferido) ou header `Accept-Language`
- **Calcule uma vez no servidor** e hidrate como state inicial

```tsx
// src/start.ts
import { createStart, createMiddleware } from "@tanstack/react-start";
import {
  getRequestHeader,
  getCookie,
  setCookie,
} from "@tanstack/react-start/server";

const localeTzMiddleware = createMiddleware().server(async ({ next }) => {
  const header = getRequestHeader("accept-language");
  const headerLocale = header?.split(",")[0] || "en-US";
  const cookieLocale = getCookie("locale");
  const cookieTz = getCookie("tz"); // set by client later (see Strategy 2)

  const locale = cookieLocale || headerLocale;
  const timeZone = cookieTz || "UTC"; // deterministic until client sends tz

  // Persist locale for subsequent requests (optional)
  setCookie("locale", locale, { path: "/", maxAge: 60 * 60 * 24 * 365 });

  return next({ context: { locale, timeZone } });
});

export const startInstance = createStart(() => ({
  requestMiddleware: [localeTzMiddleware],
}));
```

```tsx
// src/routes/index.tsx (example)
import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";

export const getServerNow = createServerFn().handler(async () => {
  const locale = getCookie("locale") || "en-US";
  const timeZone = getCookie("tz") || "UTC";
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone,
  }).format(new Date());
});

export const Route = createFileRoute("/")({
  loader: () => getServerNow(),
  component: () => {
    const serverNow = Route.useLoaderData() as string;
    return <time dateTime={serverNow}>{serverNow}</time>;
  },
});
```

### Estrategia 2 — Deixar o cliente informar seu ambiente

- Na primeira visita, defina um cookie com o fuso horario do cliente; o SSR usa `UTC` ate entao
- Faca isso sem arriscar incompatibilidades

```tsx
import * as React from "react";
import { ClientOnly } from "@tanstack/react-router";

function SetTimeZoneCookie() {
  React.useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    document.cookie = `tz=${tz}; path=/; max-age=31536000`;
  }, []);
  return null;
}

export function AppBoot() {
  return (
    <ClientOnly fallback={null}>
      <SetTimeZoneCookie />
    </ClientOnly>
  );
}
```

### Estrategia 3 — Tornar apenas do cliente

- Envolva UI instavel em `<ClientOnly>` para evitar SSR e incompatibilidades

```tsx
import { ClientOnly } from "@tanstack/react-router";
<ClientOnly fallback={<span>—</span>}>
  <RelativeTime ts={someTs} />
</ClientOnly>;
```

### Estrategia 4 — Desabilitar ou limitar SSR para a route

- Use SSR Seletivo para evitar renderizar o component no servidor

```tsx
export const Route = createFileRoute("/unstable")({
  ssr: "data-only", // or false
  component: () => <ExpensiveViz />,
});
```

### Estrategia 5 — Supressao como ultimo recurso

- Para nos pequenos e conhecidamente diferentes, voce pode usar o `suppressHydrationWarning` do React

```tsx
<time suppressHydrationWarning>{new Date().toLocaleString()}</time>
```

### Checklist

- **Entradas deterministicas**: locale, fuso horario, feature flags
- **Prefira cookies** para context do cliente; fallback para `Accept-Language`
- **Use `<ClientOnly>`** para UI inerentemente dinamica
- **Use SSR Seletivo** quando o HTML do servidor nao pode ser estavel
- **Evite supressao cega**; use `suppressHydrationWarning` com moderacao

Veja tambem: [Modelo de Execucao](./execution-model.md), [Padroes de Execucao de Codigo](./code-execution-patterns.md), [SSR Seletivo](./selective-ssr.md), [Server Functions](./server-functions.md)
