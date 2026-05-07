---
id: OnlineManager
title: OnlineManager
---

O `OnlineManager` gerencia o state online dentro do TanStack Query. Ele pode ser usado para alterar os event listeners padrão ou para mudar manualmente o state online.

> Por padrão, o `onlineManager` assume uma conexão de rede ativa e escuta os eventos `online` e `offline` no objeto `window` para detectar mudanças.

> Em versões anteriores, `navigator.onLine` era usado para determinar o status da rede. No entanto, ele não funciona bem em navegadores baseados em Chromium. Existem [muitos problemas](https://bugs.chromium.org/p/chromium/issues/list?q=navigator.online) relacionados a falsos negativos, que levavam queries a serem incorretamente marcadas como `offline`.

> Para contornar isso, agora sempre começamos com `online: true` e apenas escutamos os eventos `online` e `offline` para atualizar o status.

> Isso deve reduzir a probabilidade de falsos negativos, no entanto, pode significar falsos positivos para aplicações offline que carregam via serviceWorkers, que podem funcionar mesmo sem conexão com a internet.

Os métodos disponíveis são:

- [`setEventListener`](#onlinemanagerseteventlistener)
- [`subscribe`](#onlinemanagersubscribe)
- [`setOnline`](#onlinemanagersetonline)
- [`isOnline`](#onlinemanagerisonline)

## `onlineManager.setEventListener`

`setEventListener` pode ser usado para definir um event listener personalizado:

```tsx
import NetInfo from "@react-native-community/netinfo";
import { onlineManager } from "@tanstack/react-query";

onlineManager.setEventListener((setOnline) => {
  return NetInfo.addEventListener((state) => {
    setOnline(!!state.isConnected);
  });
});
```

## `onlineManager.subscribe`

`subscribe` pode ser usado para se inscrever em mudanças no state online. Retorna uma função para cancelar a inscrição:

```tsx
import { onlineManager } from "@tanstack/react-query";

const unsubscribe = onlineManager.subscribe((isOnline) => {
  console.log("isOnline", isOnline);
});
```

## `onlineManager.setOnline`

`setOnline` pode ser usado para definir manualmente o state online.

```tsx
import { onlineManager } from "@tanstack/react-query";

// Set to online
onlineManager.setOnline(true);

// Set to offline
onlineManager.setOnline(false);
```

**Opções**

- `online: boolean`

## `onlineManager.isOnline`

`isOnline` pode ser usado para obter o state online atual.

```tsx
const isOnline = onlineManager.isOnline();
```
