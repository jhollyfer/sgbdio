---
title: Comparison | TanStack Router & TanStack Start vs Next.js vs React Router / Remix
toc: false
---

Escolhendo uma solução de routing? Esta comparação lado a lado destaca funcionalidades-chave, trade-offs e casos de uso comuns para ajudá-lo a avaliar rapidamente como cada opção se encaixa nas necessidades do seu projeto.

Embora tenhamos como objetivo fornecer uma comparação precisa e justa, observe que esta tabela pode não capturar todas as nuances ou atualizações recentes de cada biblioteca. Recomendamos revisar a documentação oficial e experimentar cada solução para tomar a decisão mais informada para o seu caso de uso específico.

Se você encontrar alguma discrepância ou tiver sugestões de melhoria, não hesite em contribuir através do link "Edit this page on GitHub" no final desta página ou abra uma issue no [repositório GitHub do TanStack Router](https://github.com/TanStack/router).

Legenda de Funcionalidades/Capacidades:

- ✅ De primeira classe, embutido e pronto para uso sem configuração ou código adicional
- 🟡 Suporte Parcial (em uma escala de 5)
- 🟠 Suportado via pacote addon/comunidade
- 🔶 Possível, mas requer código/implementação/casting customizado
- 🛑 Não suportado oficialmente

|                                                | TanStack Router / Start                          | React Router DOM [_(Website)_][router]                | Next.JS [_(Website)_][nextjs]                         |
| ---------------------------------------------- | ------------------------------------------------ | ----------------------------------------------------- | ----------------------------------------------------- |
| Repositório Github / Stars                     | [![][stars-tanstack-router]][gh-tanstack-router] | [![][stars-router]][gh-router]                        | [![][stars-nextjs]][gh-nextjs]                        |
| Tamanho do Bundle                              | [![][bp-tanstack-router]][bpl-tanstack-router]   | [![][bp-router]][bpl-router]                          | ❓                                                    |
| History, Memory & Hash Routers                 | ✅                                               | ✅                                                    | 🛑                                                    |
| Routes Aninhados / Layout                      | ✅                                               | ✅                                                    | 🟡                                                    |
| Transições de Route tipo Suspense              | ✅                                               | ✅                                                    | ✅                                                    |
| Routes Typesafe                                | ✅                                               | 🟡 (1/5)                                              | 🟡                                                    |
| Routes baseados em código                      | ✅                                               | ✅                                                    | 🛑                                                    |
| Routes baseados em arquivo                     | ✅                                               | ✅                                                    | ✅                                                    |
| Routes baseados em arquivo Virtual/Programático| ✅                                               | ✅                                                    | 🛑                                                    |
| Router Loaders                                 | ✅                                               | ✅                                                    | ✅                                                    |
| SWR Loader Caching                             | ✅                                               | 🛑                                                    | ✅                                                    |
| Route Prefetching                              | ✅                                               | ✅                                                    | ✅                                                    |
| Route Prefetching Automático                   | ✅                                               | ✅                                                    | ✅                                                    |
| Delay de Route Prefetching                     | ✅                                               | 🔶                                                    | 🛑                                                    |
| Path Params                                    | ✅                                               | ✅                                                    | ✅                                                    |
| Path Params Typesafe                           | ✅                                               | ✅                                                    | 🛑                                                    |
| Route Context Typesafe                         | ✅                                               | 🛑                                                    | 🛑                                                    |
| Validação de Path Param                        | ✅                                               | 🛑                                                    | 🛑                                                    |
| Parsing/Serialização customizado de Path Param | ✅                                               | 🛑                                                    | 🛑                                                    |
| Routes Ranqueados                              | ✅                                               | ✅                                                    | ✅                                                    |
| Customização de Link Ativo                     | ✅                                               | ✅                                                    | ✅                                                    |
| UI Otimista                                    | ✅                                               | ✅                                                    | 🔶                                                    |
| Navegação Absoluta + Relativa Typesafe         | ✅                                               | 🟡 (1/5 via util `buildHref`)                         | 🟠 (plugin de IDE)                                    |
| Eventos de Montagem/Transição/Desmontagem de Route | ✅                                           | 🛑                                                    | 🛑                                                    |
| Devtools                                       | ✅                                               | 🟠                                                    | 🛑                                                    |
| Search Params Básicos                          | ✅                                               | ✅                                                    | ✅                                                    |
| Search Param Hooks                             | ✅                                               | ✅                                                    | ✅                                                    |
| API de Search Param `<Link/>`/`useNavigate`    | ✅                                               | 🟡 (apenas search-string via opções `to`/`search`)    | 🟡 (apenas search-string via opções `to`/`search`)    |
| JSON Search Params                             | ✅                                               | 🔶                                                    | 🔶                                                    |
| Search Params TypeSafe                         | ✅                                               | 🛑                                                    | 🛑                                                    |
| Validação de Schema de Search Param            | ✅                                               | 🛑                                                    | 🛑                                                    |
| Imutabilidade + Structural Sharing de Search Param | ✅                                            | 🔶                                                    | 🛑                                                    |
| Parsing/serialização customizado de Search Param | ✅                                              | 🔶                                                    | 🛑                                                    |
| Search Param Middleware                        | ✅                                               | 🛑                                                    | 🛑                                                    |
| Elementos de Route com Suspense                | ✅                                               | ✅                                                    | ✅                                                    |
| Elementos de Erro de Route                     | ✅                                               | ✅                                                    | ✅                                                    |
| Elementos de Pendência de Route                | ✅                                               | ✅                                                    | ✅                                                    |
| `<Block>`/`useBlocker`                         | ✅                                               | 🔶 (sem hard reloads ou navegação cross-origin)       | 🛑                                                    |
| Primitivas Deferred                            | ✅                                               | ✅                                                    | ✅                                                    |
| Scroll Restoration de Navegação                | ✅                                               | ✅                                                    | ❓                                                    |
| Scroll Restoration de Elemento                 | ✅                                               | 🛑                                                    | 🛑                                                    |
| Scroll Restoration Assíncrona                  | ✅                                               | 🛑                                                    | 🛑                                                    |
| Invalidação do Router                          | ✅                                               | ✅                                                    | ✅                                                    |
| Manipulação de Route em Runtime (Fog of War)   | 🛑                                               | ✅                                                    | ✅                                                    |
| Routes Paralelos                               | 🛑                                               | 🛑                                                    | ✅                                                    |
| --                                             | --                                               | --                                                    | --                                                    |
| **Full Stack**                                 | --                                               | --                                                    | --                                                    |
| SSR                                            | ✅                                               | ✅                                                    | ✅                                                    |
| Streaming SSR                                  | ✅                                               | ✅                                                    | ✅                                                    |
| RPCs Genéricos                                 | ✅                                               | 🛑                                                    | 🛑                                                    |
| RPC Middleware Genérico                        | ✅                                               | 🛑                                                    | 🛑                                                    |
| React Server Functions                         | ✅                                               | 🛑                                                    | ✅                                                    |
| React Server Function Middleware               | ✅                                               | 🛑                                                    | 🛑                                                    |
| API Routes                                     | ✅                                               | ✅                                                    | ✅                                                    |
| API Middleware                                 | ✅                                               | ✅                                                    | ✅                                                    |
| React Server Components                        | 🛑                                               | 🟡 (Experimental)                                     | ✅                                                    |
| API `<Form>`                                   | 🛑                                               | ✅                                                    | ✅                                                    |

[bp-tanstack-router]: https://badgen.net/bundlephobia/minzip/@tanstack/react-router
[bpl-tanstack-router]: https://bundlephobia.com/result?p=@tanstack/react-router
[gh-tanstack-router]: https://github.com/tanstack/router
[stars-tanstack-router]: https://img.shields.io/github/stars/tanstack/router?label=%F0%9F%8C%9F
[_]: _
[router]: https://github.com/remix-run/react-router
[bp-router]: https://badgen.net/bundlephobia/minzip/react-router
[gh-router]: https://github.com/remix-run/react-router
[stars-router]: https://img.shields.io/github/stars/remix-run/react-router?label=%F0%9F%8C%9F
[bpl-router]: https://bundlephobia.com/result?p=react-router
[bpl-history]: https://bundlephobia.com/result?p=history
[_]: _
[nextjs]: https://nextjs.org/docs/routing/introduction
[bp-nextjs]: https://badgen.net/bundlephobia/minzip/next.js?label=All
[gh-nextjs]: https://github.com/vercel/next.js
[stars-nextjs]: https://img.shields.io/github/stars/vercel/next.js?label=%F0%9F%8C%9F
[bpl-nextjs]: https://bundlephobia.com/result?p=next
