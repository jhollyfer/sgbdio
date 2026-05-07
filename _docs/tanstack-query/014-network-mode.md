---
id: network-mode
title: Network Mode
---

O TanStack Query fornece três modos de rede diferentes para distinguir como [Queries](./queries.md) e [Mutations](./mutations.md) devem se comportar quando você não tem conexão de rede. Esse modo pode ser definido para cada Query / Mutation individualmente, ou globalmente através dos padrões de query / mutation.

Como o TanStack Query é mais frequentemente usado para fetching de dados em combinação com bibliotecas de fetching de dados, o modo de rede padrão é [online](#network-mode-online).

## Modo de Rede: online

Neste modo, Queries e Mutations não serão disparadas a menos que você tenha conexão de rede. Este é o modo padrão. Se um fetch for iniciado para uma query, ela sempre permanecerá no `state` (`pending`, `error`, `success`) em que está, caso o fetch não possa ser feito porque não há conexão de rede. No entanto, um [fetchStatus](./queries.md#fetchstatus) é exposto adicionalmente. Ele pode ser:

- `fetching`: A `queryFn` está realmente sendo executada - uma requisição está em andamento.
- `paused`: A query não está sendo executada - está `paused` até que você tenha conexão novamente
- `idle`: A query não está fazendo fetching e não está pausada

As flags `isFetching` e `isPaused` são derivadas desse state e expostas por conveniência.

> Tenha em mente que pode não ser suficiente verificar o state `pending` para exibir um spinner de carregamento. Queries podem estar em `state: 'pending'`, mas `fetchStatus: 'paused'` se estiverem sendo montadas pela primeira vez e você não tiver conexão de rede.

Se uma query é executada porque você está online, mas você fica offline enquanto o fetch ainda está acontecendo, o TanStack Query também pausará o mecanismo de retry. Queries pausadas continuarão a ser executadas assim que você recuperar a conexão de rede. Isso é independente de `refetchOnReconnect` (que também tem como padrão `true` neste modo), porque não é um `refetch`, mas sim um `continue`. Se a query foi [cancelada](./query-cancellation.md) nesse meio tempo, ela não continuará.

## Modo de Rede: always

Neste modo, o TanStack Query sempre fará o fetch e ignorará o state online / offline. Este é provavelmente o modo que você vai querer escolher se usar o TanStack Query em um ambiente onde você não precisa de uma conexão de rede ativa para suas Queries funcionarem - por exemplo, se você apenas lê do `AsyncStorage`, ou se apenas quer retornar `Promise.resolve(5)` da sua `queryFn`.

- Queries nunca serão `paused` porque você não tem conexão de rede.
- Retries também não serão pausados - sua Query irá para o state `error` se falhar.
- `refetchOnReconnect` tem como padrão `false` neste modo, porque reconectar à rede não é mais um bom indicador de que queries stale devem ser refetched. Você ainda pode ativá-lo se quiser.

## Modo de Rede: offlineFirst

Este modo é o meio-termo entre as duas primeiras opções, onde o TanStack Query executará a `queryFn` uma vez, mas depois pausará os retries. Isso é muito útil se você tem um serviceWorker que intercepta uma requisição para caching como em uma [PWA offline-first](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Offline_Service_workers), ou se você usa HTTP caching via o [header Cache-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching#the_cache-control_header).

Nessas situações, o primeiro fetch pode ter sucesso porque vem de um armazenamento offline / cache. No entanto, se houver um cache miss, a requisição de rede será feita e falhará, e nesse caso este modo se comporta como uma query `online` - pausando os retries.

## Devtools

O [TanStack Query Devtools](../devtools.md) mostrará Queries em um state `paused` se elas estariam fazendo fetching, mas não há conexão de rede. Há também um botão de alternância para _Simular comportamento offline_. Note que este botão _não_ vai realmente interferir na sua conexão de rede (você pode fazer isso nas devtools do navegador), mas vai colocar o [OnlineManager](../../../reference/onlineManager.md) em um state offline.

## Assinatura

- `networkMode: 'online' | 'always' | 'offlineFirst'`
  - opcional
  - padrão é `'online'`
