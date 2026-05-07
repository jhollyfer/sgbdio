---
id: window-focus-refetching
title: Window Focus Refetching
---

Se um usuário sai da sua aplicação e retorna e os dados da query estão stale, **o TanStack Query automaticamente solicita dados fresh para você em segundo plano**. Você pode desabilitar isso globalmente ou por query usando a opção `refetchOnWindowFocus`:

#### Desabilitando Globalmente

[//]: # "Example"

```tsx
//
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // default: true
    },
  },
});

function App() {
  return <QueryClientProvider client={queryClient}>...</QueryClientProvider>;
}
```

[//]: # "Example"

#### Desabilitando Por Query

[//]: # "Example2"

```tsx
useQuery({
  queryKey: ["todos"],
  queryFn: fetchTodos,
  refetchOnWindowFocus: false,
});
```

[//]: # "Example2"

## Evento Personalizado de Foco na Janela

Em circunstâncias raras, você pode querer gerenciar seus próprios eventos de foco na janela que acionam o TanStack Query para revalidar. Para isso, o TanStack Query fornece uma função `focusManager.setEventListener` que fornece o callback que deve ser disparado quando a janela recebe foco e permite que você configure seus próprios eventos. Ao chamar `focusManager.setEventListener`, o handler definido anteriormente é removido (que na maioria dos casos será o handler padrão) e seu novo handler é usado no lugar. Por exemplo, este é o handler padrão:

[//]: # "Example3"

```tsx
focusManager.setEventListener((handleFocus) => {
  // Listen to visibilitychange
  if (typeof window !== "undefined" && window.addEventListener) {
    const visibilitychangeHandler = () => {
      handleFocus(document.visibilityState === "visible");
    };
    window.addEventListener("visibilitychange", visibilitychangeHandler, false);
    return () => {
      // Be sure to unsubscribe if a new handler is set
      window.removeEventListener("visibilitychange", visibilitychangeHandler);
    };
  }
});
```

[//]: # "Example3"
[//]: # "ReactNative"

## Gerenciando Foco no React Native

Em vez de event listeners no `window`, o React Native fornece informações de foco através do [módulo `AppState`](https://reactnative.dev/docs/appstate#app-states). Você pode usar o evento "change" do `AppState` para disparar uma atualização quando o state do app mudar para "active":

```tsx
import { AppState } from "react-native";
import { focusManager } from "@tanstack/react-query";

function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== "web") {
    focusManager.setFocused(status === "active");
  }
}

useEffect(() => {
  const subscription = AppState.addEventListener("change", onAppStateChange);

  return () => subscription.remove();
}, []);
```

[//]: # "ReactNative"

## Gerenciando o state de foco

[//]: # "Example4"

```tsx
import { focusManager } from "@tanstack/react-query";

// Override the default focus state
focusManager.setFocused(true);

// Fallback to the default focus check
focusManager.setFocused(undefined);
```

[//]: # "Example4"
