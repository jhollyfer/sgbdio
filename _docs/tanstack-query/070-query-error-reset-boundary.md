---
id: QueryErrorResetBoundary
title: QueryErrorResetBoundary
---

Ao usar **suspense** ou **throwOnError** nas suas queries, você precisa de uma forma de informar às queries que deseja tentar novamente ao renderizar após algum erro ter ocorrido. Com o component `QueryErrorResetBoundary` você pode redefinir quaisquer erros de query dentro dos limites do component.

```tsx
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";

const App = () => (
  <QueryErrorResetBoundary>
    {({ reset }) => (
      <ErrorBoundary
        onReset={reset}
        fallbackRender={({ resetErrorBoundary }) => (
          <div>
            There was an error!
            <Button onClick={() => resetErrorBoundary()}>Try again</Button>
          </div>
        )}
      >
        <Page />
      </ErrorBoundary>
    )}
  </QueryErrorResetBoundary>
);
```
