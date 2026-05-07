---
id: NotifyManager
title: NotifyManager
---

O `notifyManager` lida com o agendamento e agrupamento em lote de callbacks no TanStack Query.

Ele expõe os seguintes métodos:

- [batch](#notifymanagerbatch)
- [batchCalls](#notifymanagerbatchcalls)
- [schedule](#notifymanagerschedule)
- [setNotifyFunction](#notifymanagersetnotifyfunction)
- [setBatchNotifyFunction](#notifymanagersetbatchnotifyfunction)
- [setScheduler](#notifymanagersetscheduler)

## `notifyManager.batch`

`batch` pode ser usado para agrupar em lote todas as atualizações agendadas dentro do callback passado.
Isso é usado principalmente internamente para otimizar a atualização do queryClient.

```ts
function batch<T>(callback: () => T): T;
```

## `notifyManager.batchCalls`

`batchCalls` é uma função de ordem superior que recebe um callback e o encapsula.
Todas as chamadas à função encapsulada agendam o callback para ser executado no próximo lote.

```ts
type BatchCallsCallback<T extends Array<unknown>> = (...args: T) => void;

function batchCalls<T extends Array<unknown>>(
  callback: BatchCallsCallback<T>,
): BatchCallsCallback<T>;
```

## `notifyManager.schedule`

`schedule` agenda uma função para ser executada no próximo lote. Por padrão, o lote é executado
com um setTimeout, mas isso pode ser configurado.

```ts
function schedule(callback: () => void): void;
```

## `notifyManager.setNotifyFunction`

`setNotifyFunction` sobrescreve a função de notificação. Essa função recebe o
callback quando ele deve ser executado. A notifyFunction padrão apenas o chama.

Isso pode ser usado, por exemplo, para encapsular notificações com `React.act` durante a execução de testes:

```ts
import { notifyManager } from "@tanstack/react-query";
import { act } from "react-dom/test-utils";

notifyManager.setNotifyFunction(act);
```

## `notifyManager.setBatchNotifyFunction`

`setBatchNotifyFunction` define a função a ser usada para atualizações em lote

Se o seu framework suporta uma função de agrupamento em lote personalizada, você pode informar o TanStack Query sobre ela chamando notifyManager.setBatchNotifyFunction.

Por exemplo, é assim que a função batch é definida no solid-query:

```ts
import { notifyManager } from "@tanstack/query-core";
import { batch } from "solid-js";

notifyManager.setBatchNotifyFunction(batch);
```

## `notifyManager.setScheduler`

`setScheduler` configura um callback personalizado que deve agendar quando o próximo
lote será executado. O comportamento padrão é `setTimeout(callback, 0)`.

```ts
import { notifyManager } from "@tanstack/react-query";

// Schedule batches in the next microtask
notifyManager.setScheduler(queueMicrotask);

// Schedule batches before the next frame is rendered
notifyManager.setScheduler(requestAnimationFrame);

// Schedule batches some time in the future
notifyManager.setScheduler((cb) => setTimeout(cb, 10));
```
