---
id: scroll-restoration
title: Scroll Restoration
---

Tradicionalmente, quando voce navega para uma pagina visitada anteriormente em um navegador web, voce encontraria a pagina rolada ate a posicao exata onde voce estava antes de navegar para fora daquela pagina. Isso e chamado de **scroll restoration** e tem estado em uma especie de regressao desde que as aplicacoes web comecaram a migrar para fetching de dados no lado do cliente. Com o TanStack Query, no entanto, esse nao e mais o caso.

O TanStack Query nao implementa scroll restoration por si so, mas ele remove uma das maiores causas de restauracao quebrada em SPAs: resets de UI causados por refetch. Ao manter dados previamente buscados no cache (e opcionalmente usando `placeholderData`), a navegacao de volta para uma pagina pode renderizar instantaneamente com layout estavel, tornando a scroll restoration confiavel quando tratada pelo router (por exemplo, ScrollRestoration do React Router, scroll restoration do TanStack Router, ou uma pequena solucao customizada baseada em historico).

Direto da caixa, a "scroll restoration" para todas as queries (incluindo queries paginadas e infinitas) Simplesmente Funciona no TanStack Query. A razao para isso e que os resultados das queries sao armazenados em cache e podem ser recuperados de forma sincrona quando uma query e renderizada. Desde que suas queries estejam sendo mantidas em cache por tempo suficiente (o tempo padrao e 5 minutos) e nao tenham sofrido garbage collection, a scroll restoration vai funcionar direto da caixa o tempo todo.
