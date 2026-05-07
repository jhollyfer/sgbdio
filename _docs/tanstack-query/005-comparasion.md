---
id: comparison
title: Comparison | React Query vs SWR vs Apollo vs RTK Query vs React Router
---

> Esta tabela de comparacao busca ser o mais precisa e imparcial possivel. Se voce usa alguma dessas bibliotecas e sente que a informacao poderia ser melhorada, sinta-se a vontade para sugerir mudancas (com notas ou evidencias das afirmacoes) usando o link "Edit this page on Github" no final desta pagina.

Legenda de Funcionalidades/Capacidades:

- ✅ Primeira classe, integrado e pronto para usar sem configuracao ou codigo adicional
- 🟡 Suportado, mas como biblioteca/contribuicao nao oficial de terceiros ou da comunidade
- 🔶 Suportado e documentado, mas requer codigo adicional do usuario para implementar
- 🛑 Nao oficialmente suportado ou documentado.

|                                                    | React Query                              | SWR [_(Website)_][swr]                   | Apollo Client [_(Website)_][apollo]        | RTK-Query [_(Website)_][rtk-query]   | React Router [_(Website)_][react-router]                                  |
| -------------------------------------------------- | ---------------------------------------- | ---------------------------------------- | ------------------------------------------ | ------------------------------------ | ------------------------------------------------------------------------- |
| Repositorio Github / Estrelas                      | [![][stars-react-query]][gh-react-query] | [![][stars-swr]][gh-swr]                 | [![][stars-apollo]][gh-apollo]             | [![][stars-rtk-query]][gh-rtk-query] | [![][stars-react-router]][gh-react-router]                                |
| Requisitos de Plataforma                           | React                                    | React                                    | React, GraphQL                             | Redux                                | React                                                                     |
| Comparacao Deles                                   |                                          | (nenhuma)                                | (nenhuma)                                  | [Comparacao][rtk-query-comparison]   | (nenhuma)                                                                 |
| Sintaxe de Query Suportada                         | Promise, REST, GraphQL                   | Promise, REST, GraphQL                   | GraphQL, Qualquer (Reactive Variables)     | Promise, REST, GraphQL               | Promise, REST, GraphQL                                                    |
| Frameworks Suportados                              | React                                    | React                                    | React + Outros                             | Qualquer                             | React                                                                     |
| Estrategia de Caching                              | Chave Hierarquica -> Valor               | Chave Unica -> Valor                     | Schema Normalizado                         | Chave Unica -> Valor                 | Route Aninhada -> valor                                                   |
| Estrategia de Chave de Cache                       | JSON                                     | JSON                                     | Query GraphQL                              | JSON                                 | Caminho da Route                                                          |
| Deteccao de Mudanca no Cache                       | Comparacao Profunda de Chaves (Serializacao Estavel) | Comparacao Profunda de Chaves (Serializacao Estavel) | Comparacao Profunda de Chaves (Serializacao Instavel) | Igualdade Referencial de Chave (===) | Mudanca de Route                                                          |
| Deteccao de Mudanca nos Dados                      | Comparacao Profunda + Compartilhamento Estrutural | Comparacao Profunda (via `stable-hash`)  | Comparacao Profunda (Serializacao Instavel) | Igualdade Referencial de Chave (===) | Execucao do Loader                                                        |
| Memoizacao de Dados                                | Compartilhamento Estrutural Completo     | Identidade (===)                         | Identidade Normalizada                     | Identidade (===)                     | Identidade (===)                                                          |
| Tamanho do Bundle                                  | [![][bp-react-query]][bpl-react-query]   | [![][bp-swr]][bpl-swr]                   | [![][bp-apollo]][bpl-apollo]               | [![][bp-rtk-query]][bpl-rtk-query]   | [![][bp-react-router]][bpl-react-router] + [![][bp-history]][bpl-history] |
| Local de Definicao da API                          | Component, Configuracao Externa          | Component                                | Schema GraphQL                             | Configuracao Externa                 | Configuracao da Arvore de Routes                                          |
| Queries                                            | ✅                                       | ✅                                       | ✅                                         | ✅                                   | ✅                                                                        |
| Persistencia de Cache                              | ✅                                       | ✅                                       | ✅                                         | ✅                                   | 🛑 Apenas Routes Ativas <sup>8</sup>                                      |
| Devtools                                           | ✅                                       | ✅                                       | ✅                                         | ✅                                   | 🛑                                                                        |
| Polling/Intervalos                                 | ✅                                       | ✅                                       | ✅                                         | ✅                                   | 🛑                                                                        |
| Queries Paralelas                                  | ✅                                       | ✅                                       | ✅                                         | ✅                                   | ✅                                                                        |
| Queries Dependentes                                | ✅                                       | ✅                                       | ✅                                         | ✅                                   | ✅                                                                        |
| Queries Paginadas                                  | ✅                                       | ✅                                       | ✅                                         | ✅                                   | ✅                                                                        |
| Queries Infinitas                                  | ✅                                       | ✅                                       | ✅                                         | ✅                                   | 🛑                                                                        |
| Queries Infinitas Bidirecionais                    | ✅                                       | 🔶                                       | 🔶                                         | ✅                                   | 🛑                                                                        |
| Refetch de Queries Infinitas                       | ✅                                       | ✅                                       | 🛑                                         | ✅                                   | 🛑                                                                        |
| Dados de Query Atrasados<sup>1</sup>               | ✅                                       | ✅                                       | ✅                                         | ✅                                   | ✅                                                                        |
| Seletores                                          | ✅                                       | 🛑                                       | ✅                                         | ✅                                   | N/A                                                                       |
| Dados Iniciais                                     | ✅                                       | ✅                                       | ✅                                         | ✅                                   | ✅                                                                        |
| Scroll Restoration                                 | ✅                                       | ✅                                       | ✅                                         | ✅                                   | ✅                                                                        |
| Manipulacao de Cache                               | ✅                                       | ✅                                       | ✅                                         | ✅                                   | 🛑                                                                        |
| Descarte de Queries Desatualizadas                 | ✅                                       | ✅                                       | ✅                                         | ✅                                   | ✅                                                                        |
| Agrupamento e Otimizacao de Rendering<sup>2</sup>  | ✅                                       | ✅                                       | 🛑                                         | ✅                                   | ✅                                                                        |
| Garbage Collection Automatico                      | ✅                                       | 🛑                                       | 🛑                                         | ✅                                   | N/A                                                                       |
| Hooks de Mutation                                  | ✅                                       | ✅                                       | ✅                                         | ✅                                   | ✅                                                                        |
| Suporte a Mutation Offline                         | ✅                                       | 🛑                                       | 🟡                                         | 🛑                                   | 🛑                                                                        |
| APIs de Prefetch                                   | ✅                                       | ✅                                       | ✅                                         | ✅                                   | ✅                                                                        |
| Cancelamento de Query                              | ✅                                       | 🛑                                       | 🛑                                         | 🛑                                   | ✅                                                                        |
| Correspondencia Parcial de Query<sup>3</sup>       | ✅                                       | 🔶                                       | ✅                                         | ✅                                   | N/A                                                                       |
| Stale While Revalidate                             | ✅                                       | ✅                                       | ✅                                         | ✅                                   | 🛑                                                                        |
| Configuracao de Stale Time                         | ✅                                       | 🛑<sup>7</sup>                           | 🛑                                         | ✅                                   | 🛑                                                                        |
| Configuracao Pre-uso de Query/Mutation<sup>4</sup> | ✅                                       | 🛑                                       | ✅                                         | ✅                                   | ✅                                                                        |
| Refetch ao Focar na Janela                         | ✅                                       | ✅                                       | 🛑                                         | ✅                                   | 🛑                                                                        |
| Refetch por Status de Rede                         | ✅                                       | ✅                                       | ✅                                         | ✅                                   | 🛑                                                                        |
| Dehydration/Rehydration Geral de Cache             | ✅                                       | 🛑                                       | ✅                                         | ✅                                   | ✅                                                                        |
| Caching Offline                                    | ✅                                       | 🛑                                       | ✅                                         | 🔶                                   | 🛑                                                                        |
| React Suspense                                     | ✅                                       | ✅                                       | ✅                                         | 🛑                                   | ✅                                                                        |
| Core Abstrato/Agnostico                            | ✅                                       | 🛑                                       | ✅                                         | ✅                                   | 🛑                                                                        |
| Refetch Automatico apos Mutation<sup>5</sup>       | 🔶                                       | 🔶                                       | ✅                                         | ✅                                   | ✅                                                                        |
| Caching Normalizado<sup>6</sup>                    | 🛑                                       | 🛑                                       | ✅                                         | 🛑                                   | 🛑                                                                        |

### Notas

> **<sup>1</sup> Dados de Query Atrasados** - React Query fornece uma forma de continuar vendo os dados de uma query existente enquanto a proxima query carrega (similar a mesma UX que o suspense vai fornecer nativamente em breve). Isso e extremamente importante ao escrever UIs de paginacao ou carregamento infinito onde voce nao quer mostrar um estado de carregamento rigido toda vez que uma nova query e requisitada. Outras bibliotecas nao tem essa capacidade e renderizam um estado de carregamento rigido para a nova query (a menos que tenha sido pre-buscada), enquanto a nova query carrega.

> **<sup>2</sup> Otimizacao de Rendering** - React Query tem excelente performance de rendering. Por padrao, ele vai rastrear automaticamente quais campos sao acessados e so vai re-renderizar se um deles mudar. Se voce quiser desativar essa otimizacao, definir `notifyOnChangeProps` para `'all'` vai re-renderizar seus components toda vez que a query for atualizada. Por exemplo, porque tem novos dados, ou para indicar que esta fazendo fetching. React Query tambem agrupa atualizacoes para garantir que sua aplicacao so re-renderize uma vez quando multiplos components estao usando a mesma query. Se voce esta interessado apenas nas propriedades `data` ou `error`, voce pode reduzir o numero de re-renders ainda mais definindo `notifyOnChangeProps` para `['data', 'error']`.

> **<sup>3</sup> Correspondencia parcial de query** - Como React Query usa serializacao deterministica de chaves de query, isso permite que voce manipule grupos variaveis de queries sem precisar conhecer cada chave de query individual que voce quer corresponder, por exemplo, voce pode fazer refetch de toda query que comeca com `todos` na sua chave, independente de variaveis, ou voce pode direcionar queries especificas com (ou sem) variaveis ou propriedades aninhadas, e ate usar uma funcao de filtro para corresponder apenas queries que passam nas suas condicoes especificas.

> **<sup>4</sup> Configuracao Pre-uso de Query** - Este e simplesmente um nome sofisticado para poder configurar como queries e mutations vao se comportar antes de serem usadas. Por exemplo, uma query pode ser totalmente configurada com padroes de antemao e quando chegar a hora de usa-la, apenas `useQuery({ queryKey })` e necessario, ao inves de ser obrigatorio passar o fetcher e/ou opcoes a cada uso. SWR tem uma forma parcial dessa funcionalidade permitindo que voce pre-configure um fetcher padrao, mas apenas como um fetcher global, nao por query e definitivamente nao para mutations.

> **<sup>5</sup> Refetch Automatico apos Mutation** - Para que o refetch verdadeiramente automatico aconteca apos uma mutation, um schema e necessario (como o que GraphQL fornece) junto com heuristicas que ajudam a biblioteca a saber como identificar entidades individuais e tipos de entidades naquele schema.

> **<sup>6</sup> Caching Normalizado** - React Query, SWR e RTK-Query atualmente nao suportam caching normalizado automatico, que descreve o armazenamento de entidades em uma arquitetura plana para evitar alguma duplicacao de dados de alto nivel.

> **<sup>7</sup> Modo Imutavel do SWR** - SWR vem com um modo "imutavel" que permite que voce busque uma query apenas uma vez durante a vida do cache, mas ainda nao tem o conceito de stale-time ou revalidacao automatica condicional

> **<sup>8</sup> Persistencia de cache do React Router** - React Router nao faz cache de dados alem das routes atualmente correspondidas. Se uma route e abandonada, seus dados sao perdidos.

[bpl-react-query]: https://bundlephobia.com/result?p=@tanstack/react-query
[bp-react-query]: https://badgen.net/bundlephobia/minzip/@tanstack/react-query?label=💾
[gh-react-query]: https://github.com/tannerlinsley/react-query
[stars-react-query]: https://img.shields.io/github/stars/tannerlinsley/react-query?label=%F0%9F%8C%9F
[swr]: https://github.com/vercel/swr
[bp-swr]: https://badgen.net/bundlephobia/minzip/swr?label=💾
[gh-swr]: https://github.com/vercel/swr
[stars-swr]: https://img.shields.io/github/stars/vercel/swr?label=%F0%9F%8C%9F
[bpl-swr]: https://bundlephobia.com/result?p=swr
[apollo]: https://github.com/apollographql/apollo-client
[bp-apollo]: https://badgen.net/bundlephobia/minzip/@apollo/client?label=💾
[gh-apollo]: https://github.com/apollographql/apollo-client
[stars-apollo]: https://img.shields.io/github/stars/apollographql/apollo-client?label=%F0%9F%8C%9F
[bpl-apollo]: https://bundlephobia.com/result?p=@apollo/client
[rtk-query]: https://redux-toolkit.js.org/rtk-query/overview
[rtk-query-comparison]: https://redux-toolkit.js.org/rtk-query/comparison
[rtk-query-bundle-size]: https://redux-toolkit.js.org/rtk-query/comparison#bundle-size
[bp-rtk]: https://badgen.net/bundlephobia/minzip/@reduxjs/toolkit?label=💾
[bp-rtk-query]: https://badgen.net/bundlephobia/minzip/@reduxjs/toolkit?label=💾
[gh-rtk-query]: https://github.com/reduxjs/redux-toolkit
[stars-rtk-query]: https://img.shields.io/github/stars/reduxjs/redux-toolkit?label=🌟
[bpl-rtk]: https://bundlephobia.com/result?p=@reduxjs/toolkit
[bpl-rtk-query]: https://bundlephobia.com/package/@reduxjs/toolkit
[react-router]: https://github.com/remix-run/react-router
[bp-react-router]: https://badgen.net/bundlephobia/minzip/react-router-dom?label=💾
[gh-react-router]: https://github.com/remix-run/react-router
[stars-react-router]: https://img.shields.io/github/stars/remix-run/react-router?label=%F0%9F%8C%9F
[bpl-react-router]: https://bundlephobia.com/result?p=react-router-dom
[bp-history]: https://badgen.net/bundlephobia/minzip/history?label=💾
[bpl-history]: https://bundlephobia.com/result?p=history
