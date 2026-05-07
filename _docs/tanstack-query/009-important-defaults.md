---
id: important-defaults
title: Important Defaults
---

Direto da caixa, o TanStack Query e configurado com padroes **agressivos mas sensatos**. **As vezes esses padroes podem pegar novos usuarios de surpresa ou dificultar o aprendizado/depuracao se forem desconhecidos pelo usuario.** Mantenha-os em mente conforme voce continua a aprender e usar o TanStack Query:

- Instancias de query via `useQuery` ou `useInfiniteQuery` por padrao **consideram dados em cache como stale**.

> Para mudar esse comportamento, voce pode configurar suas queries tanto globalmente quanto por query usando a opcao `staleTime`. Especificar um `staleTime` mais longo significa que as queries nao vao fazer refetch dos seus dados com tanta frequencia

- Uma query que tem um `staleTime` definido e considerada **fresh** ate que esse `staleTime` tenha expirado.
  - defina `staleTime` para, por exemplo, `2 * 60 * 1000` para garantir que os dados sejam lidos do cache, sem disparar nenhum tipo de refetch, por 2 minutos, ou ate que a query seja [invalidada manualmente](./query-invalidation.md).
  - defina `staleTime` para `Infinity` para nunca disparar um refetch ate que a query seja [invalidada manualmente](./query-invalidation.md).
  - defina `staleTime` para `'static'` para **nunca** disparar um refetch, mesmo que a query seja [invalidada manualmente](./query-invalidation.md).

- Queries stale sao refeitas automaticamente em segundo plano quando:
  - Novas instancias da query sao montadas
  - A janela e refocada
  - A rede e reconectada

> Definir `staleTime` e a forma recomendada de evitar refetches excessivos, mas voce tambem pode customizar os momentos de refetch definindo opcoes como `refetchOnMount`, `refetchOnWindowFocus` e `refetchOnReconnect`.

- Queries podem opcionalmente ser configuradas com um `refetchInterval` para disparar refetches periodicamente, o que e independente da configuracao de `staleTime`.

- Resultados de queries que nao tem mais instancias ativas de `useQuery`, `useInfiniteQuery` ou query observers sao rotulados como "inativos" e permanecem no cache caso sejam usados novamente mais tarde.
- Por padrao, queries "inativas" sofrem garbage collection apos **5 minutos**.

  > Para mudar isso, voce pode alterar o `gcTime` padrao das queries para algo diferente de `1000 * 60 * 5` milissegundos.

- Queries que falham sao **silenciosamente tentadas novamente 3 vezes, com atraso exponencial** antes de capturar e exibir um erro na UI.

  > Para mudar isso, voce pode alterar as opcoes padrao `retry` e `retryDelay` das queries para algo diferente de `3` e a funcao padrao de backoff exponencial.

- Resultados de queries por padrao sao **compartilhados estruturalmente para detectar se os dados realmente mudaram** e se nao, **a referencia dos dados permanece inalterada** para ajudar melhor com a estabilizacao de valores em relacao ao useMemo e useCallback. Se esse conceito parece estranho, entao nao se preocupe com isso! 99.9% das vezes voce nao vai precisar desabilitar isso e isso torna sua aplicacao mais performatica sem custo nenhum para voce.

  > O compartilhamento estrutural so funciona com valores compativeis com JSON, qualquer outro tipo de valor sempre sera considerado como alterado. Se voce esta tendo problemas de performance por causa de respostas grandes, por exemplo, voce pode desabilitar essa funcionalidade com a flag `config.structuralSharing`. Se voce esta lidando com valores nao compativeis com JSON nas respostas das suas queries e ainda quer detectar se os dados mudaram ou nao, voce pode fornecer sua propria funcao customizada como `config.structuralSharing` para computar um valor a partir das respostas antiga e nova, mantendo referencias conforme necessario.

[//]: # "Materials"

## Leitura Adicional

De uma olhada nos seguintes artigos dos nossos [Recursos da Comunidade](../../../community-resources) para explicacoes adicionais sobre os padroes:

- [Practical React Query](https://tkdodo.eu/blog/practical-react-query)
- [React Query as a State Manager](https://tkdodo.eu/blog/react-query-as-a-state-manager)
- [Thinking in React Query](https://tkdodo.eu/blog/thinking-in-react-query)

[//]: # "Materials"
