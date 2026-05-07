---
id: client-entry-point
title: Client Entry Point
---

# Client Entry Point

> [!NOTE]
> O client entry point e **opcional** por padrao. Se nao for fornecido, o TanStack Start ira automaticamente lidar com o client entry point para voce usando o exemplo abaixo como padrao.

Enviar nosso HTML para o cliente e apenas metade da batalha. Uma vez la, precisamos hidratar nosso JavaScript do lado do cliente quando a route for resolvida no cliente. Fazemos isso hidratando a raiz da nossa aplicacao com o component `StartClient`:

```tsx
// src/client.tsx
import { StartClient } from "@tanstack/react-start/client";
import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";

hydrateRoot(
  document,
  <StrictMode>
    <StartClient />
  </StrictMode>,
);
```

Isso nos permite iniciar o roteamento do lado do cliente assim que a requisicao inicial do servidor do usuario for atendida.

## Tratamento de Erros

Voce pode envolver seu client entry point com error boundaries para lidar graciosamente com erros do lado do cliente:

```tsx
// src/client.tsx
import { StartClient } from "@tanstack/react-start/client";
import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { ErrorBoundary } from "./components/ErrorBoundary";

hydrateRoot(
  document,
  <StrictMode>
    <ErrorBoundary>
      <StartClient />
    </ErrorBoundary>
  </StrictMode>,
);
```

## Desenvolvimento vs Producao

Voce pode querer comportamentos diferentes em desenvolvimento vs producao:

```tsx
// src/client.tsx
import { StartClient } from "@tanstack/react-start/client";
import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";

const App = (
  <>
    {import.meta.env.DEV && <div>Development Mode</div>}
    <StartClient />
  </>
);

hydrateRoot(
  document,
  import.meta.env.DEV ? <StrictMode>{App}</StrictMode> : App,
);
```

O client entry point te da controle total sobre como sua aplicacao inicializa no lado do cliente enquanto funciona perfeitamente com o server-side rendering do TanStack Start.
