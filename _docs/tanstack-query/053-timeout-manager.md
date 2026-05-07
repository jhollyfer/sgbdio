---
id: TimeoutManager
title: TimeoutManager
---

O `TimeoutManager` lida com timers de `setTimeout` e `setInterval` no TanStack Query.

O TanStack Query usa timers para implementar funcionalidades como `staleTime` e `gcTime` de queries, assim como retries, throttling e debouncing.

Por padrão, o TimeoutManager usa os globais `setTimeout` e `setInterval`, mas pode ser configurado para usar implementações personalizadas.

Os métodos disponíveis são:

- [`timeoutManager.setTimeoutProvider`](#timeoutmanagersettimeoutprovider)
  - [`TimeoutProvider`](#timeoutprovider)
- [`timeoutManager.setTimeout`](#timeoutmanagersettimeout)
- [`timeoutManager.clearTimeout`](#timeoutmanagercleartimeout)
- [`timeoutManager.setInterval`](#timeoutmanagersetinterval)
- [`timeoutManager.clearInterval`](#timeoutmanagerclearinterval)

## `timeoutManager.setTimeoutProvider`

`setTimeoutProvider` pode ser usado para definir uma implementação personalizada das funções `setTimeout`, `clearTimeout`, `setInterval`, `clearInterval`, chamada de `TimeoutProvider`.

Isso pode ser útil se você notar problemas de performance no event loop com milhares de queries. Um TimeoutProvider personalizado também poderia suportar delays de timer maiores que o valor máximo de delay do `setTimeout` global, que é de aproximadamente [24 dias](https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout#maximum_delay_value).

É importante chamar `setTimeoutProvider` antes de criar um QueryClient ou queries, para que o mesmo provider seja usado de forma consistente para todos os timers na aplicação, já que diferentes TimeoutProviders não podem cancelar os timers uns dos outros.

```tsx
import { timeoutManager, QueryClient } from "@tanstack/react-query";
import { CustomTimeoutProvider } from "./CustomTimeoutProvider";

timeoutManager.setTimeoutProvider(new CustomTimeoutProvider());

export const queryClient = new QueryClient();
```

### `TimeoutProvider`

Timers são muito sensíveis a performance. Timers de curto prazo (como aqueles com delays menores que 5 segundos) tendem a ser sensíveis à latência, enquanto timers de longo prazo podem se beneficiar mais de [timer coalescing](https://en.wikipedia.org/wiki/Timer_coalescing) - agrupando timers com prazos similares - usando uma estrutura de dados como uma [hierarchical time wheel](https://www.npmjs.com/package/timer-wheel).

O tipo `TimeoutProvider` exige que as implementações lidem com objetos de ID de timer que podem ser convertidos para `number` via [Symbol.toPrimitive][toPrimitive] porque runtimes como NodeJS retornam [objetos][nodejs-timeout] de suas funções globais `setTimeout` e `setInterval`. Implementações de TimeoutProvider são livres para converter IDs de timer para number internamente, ou para retornar seu próprio tipo de objeto personalizado que implemente `{ [Symbol.toPrimitive]: () => number }`.

[nodejs-timeout]: https://nodejs.org/api/timers.html#class-timeout
[toPrimitive]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toPrimitive

```tsx
type ManagedTimerId = number | { [Symbol.toPrimitive]: () => number };

type TimeoutProvider<TTimerId extends ManagedTimerId = ManagedTimerId> = {
  readonly setTimeout: (callback: TimeoutCallback, delay: number) => TTimerId;
  readonly clearTimeout: (timeoutId: TTimerId | undefined) => void;

  readonly setInterval: (callback: TimeoutCallback, delay: number) => TTimerId;
  readonly clearInterval: (intervalId: TTimerId | undefined) => void;
};
```

## `timeoutManager.setTimeout`

`setTimeout(callback, delayMs)` agenda um callback para ser executado após aproximadamente `delay` milissegundos, como a função global [setTimeout](https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout). O callback pode ser cancelado com `timeoutManager.clearTimeout`.

Retorna um ID de timer, que pode ser um number ou um objeto que pode ser convertido para number via [Symbol.toPrimitive][toPrimitive].

```tsx
import { timeoutManager } from "@tanstack/react-query";

const timeoutId = timeoutManager.setTimeout(
  () => console.log("ran at:", new Date()),
  1000,
);

const timeoutIdNumber: number = Number(timeoutId);
```

## `timeoutManager.clearTimeout`

`clearTimeout(timerId)` cancela um callback de timeout agendado com `setTimeout`, como a função global [clearTimeout](https://developer.mozilla.org/en-US/docs/Web/API/Window/clearTimeout). Deve ser chamado com um ID de timer retornado por `timeoutManager.setTimeout`.

```tsx
import { timeoutManager } from "@tanstack/react-query";

const timeoutId = timeoutManager.setTimeout(
  () => console.log("ran at:", new Date()),
  1000,
);

timeoutManager.clearTimeout(timeoutId);
```

## `timeoutManager.setInterval`

`setInterval(callback, intervalMs)` agenda um callback para ser chamado aproximadamente a cada `intervalMs`, como a função global [setInterval](https://developer.mozilla.org/en-US/docs/Web/API/Window/setInterval).

Assim como `setTimeout`, retorna um ID de timer, que pode ser um number ou um objeto que pode ser convertido para number via [Symbol.toPrimitive](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toPrimitive).

```tsx
import { timeoutManager } from "@tanstack/react-query";

const intervalId = timeoutManager.setInterval(
  () => console.log("ran at:", new Date()),
  1000,
);
```

## `timeoutManager.clearInterval`

`clearInterval(intervalId)` pode ser usado para cancelar um intervalo, como a função global [clearInterval](https://developer.mozilla.org/en-US/docs/Web/API/Window/clearInterval). Deve ser chamado com um ID de intervalo retornado por `timeoutManager.setInterval`.

```tsx
import { timeoutManager } from "@tanstack/react-query";

const intervalId = timeoutManager.setInterval(
  () => console.log("ran at:", new Date()),
  1000,
);

timeoutManager.clearInterval(intervalId);
```
