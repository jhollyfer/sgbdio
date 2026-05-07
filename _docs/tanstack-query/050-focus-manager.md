---
id: FocusManager
title: FocusManager
---

O `FocusManager` gerencia o state de foco dentro do TanStack Query.

Ele pode ser usado para alterar os event listeners padrão ou para mudar manualmente o state de foco.

Os métodos disponíveis são:

- [`setEventListener`](#focusmanagerseteventlistener)
- [`subscribe`](#focusmanagersubscribe)
- [`setFocused`](#focusmanagersetfocused)
- [`isFocused`](#focusmanagerisfocused)

## `focusManager.setEventListener`

`setEventListener` pode ser usado para definir um event listener personalizado:

```tsx
import { focusManager } from "@tanstack/react-query";

focusManager.setEventListener((handleFocus) => {
  // Listen to visibilitychange
  if (typeof window !== "undefined" && window.addEventListener) {
    window.addEventListener("visibilitychange", handleFocus, false);
  }

  return () => {
    // Be sure to unsubscribe if a new handler is set
    window.removeEventListener("visibilitychange", handleFocus);
  };
});
```

## `focusManager.subscribe`

`subscribe` pode ser usado para se inscrever em mudanças no state de visibilidade. Retorna uma função para cancelar a inscrição:

```tsx
import { focusManager } from "@tanstack/react-query";

const unsubscribe = focusManager.subscribe((isVisible) => {
  console.log("isVisible", isVisible);
});
```

## `focusManager.setFocused`

`setFocused` pode ser usado para definir manualmente o state de foco. Defina como `undefined` para voltar à verificação de foco padrão.

```tsx
import { focusManager } from "@tanstack/react-query";

// Set focused
focusManager.setFocused(true);

// Set unfocused
focusManager.setFocused(false);

// Fallback to the default focus check
focusManager.setFocused(undefined);
```

**Opções**

- `focused: boolean | undefined`

## `focusManager.isFocused`

`isFocused` pode ser usado para obter o state de foco atual.

```tsx
const isFocused = focusManager.isFocused();
```
