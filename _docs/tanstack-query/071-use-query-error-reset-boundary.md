---
id: useQueryErrorResetBoundary
title: useQueryErrorResetBoundary
---

Esse hook vai redefinir quaisquer erros de query dentro do `QueryErrorResetBoundary` mais próximo. Se nenhum boundary for definido, ele os redefinirá globalmente:

```tsx
import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";

const App = () => {
  const { reset } = useQueryErrorResetBoundary();
  return (
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
  );
};
```
