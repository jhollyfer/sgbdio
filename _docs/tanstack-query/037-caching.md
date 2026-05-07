---
id: caching
title: Caching Examples
---

> Por favor, leia completamente os [Padrões Importantes](./important-defaults.md) antes de ler este guia

## Exemplo Básico

Este exemplo de caching ilustra a história e o ciclo de vida de:

- Instâncias de Query com e sem dados em cache
- Refetching em segundo plano
- Queries inativas
- Garbage Collection

Vamos supor que estamos usando o `gcTime` padrão de **5 minutos** e o `staleTime` padrão de `0`.

- Uma nova instância de `useQuery({ queryKey: ['todos'], queryFn: fetchTodos })` é montada.
  - Como nenhuma outra query foi feita com a query key `['todos']`, essa query mostrará um estado de carregamento pesado e fará uma requisição de rede para buscar os dados.
  - Quando a requisição de rede for concluída, os dados retornados serão armazenados em cache sob a chave `['todos']`.
  - O hook marcará os dados como stale após o `staleTime` configurado (o padrão é `0`, ou seja, imediatamente).
- Uma segunda instância de `useQuery({ queryKey: ['todos'], queryFn: fetchTodos })` é montada em outro lugar.
  - Como o cache já tem dados para a chave `['todos']` da primeira query, esses dados são retornados imediatamente do cache.
  - A nova instância dispara uma nova requisição de rede usando sua função de query.
    - Note que independentemente de ambas as funções de query `fetchTodos` serem idênticas ou não, o [`status`](../reference/useQuery.md) de ambas as queries é atualizado (incluindo `isFetching`, `isPending` e outros valores relacionados) porque elas têm a mesma query key.
  - Quando a requisição é concluída com sucesso, os dados do cache sob a chave `['todos']` são atualizados com os novos dados, e ambas as instâncias são atualizadas com os novos dados.
- Ambas as instâncias da query `useQuery({ queryKey: ['todos'], queryFn: fetchTodos })` são desmontadas e não estão mais em uso.
  - Como não há mais instâncias ativas desta query, um timeout de garbage collection é configurado usando `gcTime` para deletar e fazer garbage collection da query (o padrão é **5 minutos**).
- Antes que o timeout do cache (gcTime) tenha sido concluído, outra instância de `useQuery({ queryKey: ['todos'], queryFn: fetchTodos })` é montada. A query retorna imediatamente os dados em cache disponíveis enquanto a função `fetchTodos` está sendo executada em segundo plano. Quando concluída com sucesso, ela preencherá o cache com dados fresh.
- A última instância de `useQuery({ queryKey: ['todos'], queryFn: fetchTodos })` é desmontada.
- Nenhuma outra instância de `useQuery({ queryKey: ['todos'], queryFn: fetchTodos })` aparece dentro de **5 minutos**.
  - Os dados em cache sob a chave `['todos']` são deletados e passam por garbage collection.
