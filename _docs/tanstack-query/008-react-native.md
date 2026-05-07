---
id: react-native
title: React Native
---

O React Query foi projetado para funcionar imediatamente com React Native, sem configuração adicional.

## Suporte a DevTools

Existem várias opções disponíveis para integração com DevTools no React Native:

1. **App nativo para macOS**: Um app de terceiros para depuração do React Query em qualquer aplicação baseada em JavaScript:
   https://github.com/LovesWorking/rn-better-dev-tools

2. **Plugin para Flipper**: Um plugin de terceiros para usuários do Flipper:
   https://github.com/bgaleotti/react-query-native-devtools

3. **Plugin para Reactotron**: Um plugin de terceiros para usuários do Reactotron:
   https://github.com/hsndmr/reactotron-react-query

## Gerenciamento de status online

O React Query já suporta refetch automático ao reconectar no navegador web.
Para adicionar esse comportamento no React Native, você precisa usar o `onlineManager` do React Query como no exemplo abaixo:

```tsx
import NetInfo from "@react-native-community/netinfo";
import { onlineManager } from "@tanstack/react-query";

onlineManager.setEventListener((setOnline) => {
  return NetInfo.addEventListener((state) => {
    setOnline(!!state.isConnected);
  });
});
```

ou

```tsx
import { onlineManager } from "@tanstack/react-query";
import * as Network from "expo-network";

onlineManager.setEventListener((setOnline) => {
  const eventSubscription = Network.addNetworkStateListener((state) => {
    setOnline(!!state.isConnected);
  });
  return eventSubscription.remove;
});
```

## Refetch ao focar no App

Em vez de event listeners no `window`, o React Native fornece informações de foco através do [módulo `AppState`](https://reactnative.dev/docs/appstate#app-states). Você pode usar o evento "change" do `AppState` para disparar uma atualização quando o state do app mudar para "active":

```tsx
import { useEffect } from "react";
import { AppState, Platform } from "react-native";
import type { AppStateStatus } from "react-native";
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

## Atualização ao focar na tela

Em algumas situações, você pode querer refazer o fetch da query quando uma tela do React Native receber foco novamente.
Esse hook customizado vai refazer o fetch de **todas as queries stale ativas** quando a tela receber foco novamente.

```tsx
import React from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";

export function useRefreshOnFocus() {
  const queryClient = useQueryClient();
  const firstTimeRef = React.useRef(true);

  useFocusEffect(
    React.useCallback(() => {
      if (firstTimeRef.current) {
        firstTimeRef.current = false;
        return;
      }

      // refetch all stale active queries
      queryClient.refetchQueries({
        queryKey: ["posts"],
        stale: true,
        type: "active",
      });
    }, [queryClient]),
  );
}
```

No código acima, o primeiro foco (quando a tela é montada inicialmente) é ignorado porque o `useFocusEffect` chama nosso callback na montagem, além de quando a tela recebe foco.

## Desabilitar queries em telas fora de foco

Se você não quer que certas queries continuem "ativas" enquanto uma tela está fora de foco, você pode usar a prop subscribed no useQuery. Essa prop permite controlar se uma query permanece inscrita para atualizações. Combinada com o useIsFocused do React Navigation, ela permite que você cancele a inscrição de queries de forma transparente quando uma tela não está em foco:

Exemplo de uso:

```tsx
import React from 'react'
import { useIsFocused } from '@react-navigation/native'
import { useQuery } from '@tanstack/react-query'
import { Text } from 'react-native'

function MyComponent() {
  const isFocused = useIsFocused()

  const { dataUpdatedAt } = useQuery({
    queryKey: ['key'],
    queryFn: () => fetch(...),
    subscribed: isFocused,
  })

  return <Text>DataUpdatedAt: {dataUpdatedAt}</Text>
}
```

Quando subscribed é false, a query cancela a inscrição das atualizações e não vai disparar re-renders nem buscar novos dados para aquela tela. Uma vez que se torne true novamente (por exemplo, quando a tela recuperar o foco), a query se reinscreve e permanece atualizada.
