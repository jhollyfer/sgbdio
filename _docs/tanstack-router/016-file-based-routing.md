---
title: File-Based Routing
---

A maior parte da documentação do TanStack Router é escrita para file-based routing e tem como objetivo ajudar você a entender em mais detalhes como configurar o file-based routing e os detalhes técnicos por trás de como ele funciona. Embora o file-based routing seja a forma preferida e recomendada de configurar o TanStack Router, você também pode usar [code-based routing](./code-based-routing.md) se preferir.

## O que é File-Based Routing?

File-based routing é uma forma de configurar suas routes usando o sistema de arquivos. Em vez de definir a estrutura de routes via código, você pode definir suas routes usando uma série de arquivos e diretórios que representam a hierarquia de routes da sua aplicação. Isso traz uma série de benefícios:

- **Simplicidade**: O file-based routing é visualmente intuitivo e fácil de entender tanto para desenvolvedores novos quanto experientes.
- **Organização**: As routes são organizadas de uma forma que espelha a estrutura de URL da sua aplicação.
- **Escalabilidade**: Conforme sua aplicação cresce, o file-based routing facilita adicionar novas routes e manter as existentes.
- **Code-Splitting**: O file-based routing permite que o TanStack Router faça code splitting automático das suas routes para melhor performance.
- **Type-Safety**: O file-based routing eleva o nível de type-safety gerando e gerenciando as ligações de tipos para suas routes, o que de outra forma pode ser um processo tedioso via code-based routing.
- **Consistência**: O file-based routing impõe uma estrutura consistente para suas routes, facilitando a manutenção e atualização da sua aplicação e a migração de um projeto para outro.

## `/`s ou `.`s?

Embora diretórios há muito tempo sejam usados para representar a hierarquia de routes, o file-based routing introduz um conceito adicional de usar o caractere `.` no nome do arquivo para denotar aninhamento de route. Isso permite que você evite criar diretórios para poucas routes profundamente aninhadas e continue usando diretórios para hierarquias de routes mais amplas. Vamos ver alguns exemplos!

## Routes por Diretório

Diretórios podem ser usados para denotar hierarquia de routes, o que pode ser útil para organizar múltiplas routes em grupos lógicos e também reduzir o comprimento do nome do arquivo para grandes grupos de routes profundamente aninhadas.

Veja o exemplo abaixo:

| Filename                | Route Path                | Component Output                  |
| ----------------------- | ------------------------- | --------------------------------- |
| ʦ `__root.tsx`          |                           | `<Root>`                          |
| ʦ `index.tsx`           | `/` (exact)               | `<Root><RootIndex>`               |
| ʦ `about.tsx`           | `/about`                  | `<Root><About>`                   |
| ʦ `posts.tsx`           | `/posts`                  | `<Root><Posts>`                   |
| 📂 `posts`              |                           |                                   |
| ┄ ʦ `index.tsx`         | `/posts` (exact)          | `<Root><Posts><PostsIndex>`       |
| ┄ ʦ `$postId.tsx`       | `/posts/$postId`          | `<Root><Posts><Post>`             |
| 📂 `posts_`             |                           |                                   |
| ┄ 📂 `$postId`          |                           |                                   |
| ┄ ┄ ʦ `edit.tsx`        | `/posts/$postId/edit`     | `<Root><EditPost>`                |
| ʦ `settings.tsx`        | `/settings`               | `<Root><Settings>`                |
| 📂 `settings`           |                           | `<Root><Settings>`                |
| ┄ ʦ `profile.tsx`       | `/settings/profile`       | `<Root><Settings><Profile>`       |
| ┄ ʦ `notifications.tsx` | `/settings/notifications` | `<Root><Settings><Notifications>` |
| ʦ `_pathlessLayout.tsx` |                           | `<Root><PathlessLayout>`          |
| 📂 `_pathlessLayout`    |                           |                                   |
| ┄ ʦ `route-a.tsx`       | `/route-a`                | `<Root><PathlessLayout><RouteA>`  |
| ┄ ʦ `route-b.tsx`       | `/route-b`                | `<Root><PathlessLayout><RouteB>`  |
| 📂 `files`              |                           |                                   |
| ┄ ʦ `$.tsx`             | `/files/$`                | `<Root><Files>`                   |
| 📂 `account`            |                           |                                   |
| ┄ ʦ `route.tsx`         | `/account`                | `<Root><Account>`                 |
| ┄ ʦ `overview.tsx`      | `/account/overview`       | `<Root><Account><Overview>`       |

## Flat Routes

O flat routing dá a você a capacidade de usar `.`s para denotar níveis de aninhamento de route.

Isso pode ser útil quando você tem um grande número de routes profundamente aninhadas de forma única e quer evitar criar diretórios para cada uma:

Veja o exemplo abaixo:

| Filename                        | Route Path                | Component Output                  |
| ------------------------------- | ------------------------- | --------------------------------- |
| ʦ `__root.tsx`                  |                           | `<Root>`                          |
| ʦ `index.tsx`                   | `/` (exact)               | `<Root><RootIndex>`               |
| ʦ `about.tsx`                   | `/about`                  | `<Root><About>`                   |
| ʦ `posts.tsx`                   | `/posts`                  | `<Root><Posts>`                   |
| ʦ `posts.index.tsx`             | `/posts` (exact)          | `<Root><Posts><PostsIndex>`       |
| ʦ `posts.$postId.tsx`           | `/posts/$postId`          | `<Root><Posts><Post>`             |
| ʦ `posts_.$postId.edit.tsx`     | `/posts/$postId/edit`     | `<Root><EditPost>`                |
| ʦ `settings.tsx`                | `/settings`               | `<Root><Settings>`                |
| ʦ `settings.profile.tsx`        | `/settings/profile`       | `<Root><Settings><Profile>`       |
| ʦ `settings.notifications.tsx`  | `/settings/notifications` | `<Root><Settings><Notifications>` |
| ʦ `_pathlessLayout.tsx`         |                           | `<Root><PathlessLayout>`          |
| ʦ `_pathlessLayout.route-a.tsx` | `/route-a`                | `<Root><PathlessLayout><RouteA>`  |
| ʦ `_pathlessLayout.route-b.tsx` | `/route-b`                | `<Root><PathlessLayout><RouteB>`  |
| ʦ `files.$.tsx`                 | `/files/$`                | `<Root><Files>`                   |
| ʦ `account.tsx`                 | `/account`                | `<Root><Account>`                 |
| ʦ `account.overview.tsx`        | `/account/overview`       | `<Root><Account><Overview>`       |

## Routes Flat e por Diretório Combinadas

É extremamente provável que uma estrutura 100% por diretório ou flat não seja a melhor opção para o seu projeto, e é por isso que o TanStack Router permite que você combine routes flat e por diretório para criar uma árvore de routes que usa o melhor dos dois mundos onde fizer sentido:

Veja o exemplo abaixo:

| Filename                       | Route Path                | Component Output                  |
| ------------------------------ | ------------------------- | --------------------------------- |
| ʦ `__root.tsx`                 |                           | `<Root>`                          |
| ʦ `index.tsx`                  | `/` (exact)               | `<Root><RootIndex>`               |
| ʦ `about.tsx`                  | `/about`                  | `<Root><About>`                   |
| ʦ `posts.tsx`                  | `/posts`                  | `<Root><Posts>`                   |
| 📂 `posts`                     |                           |                                   |
| ┄ ʦ `index.tsx`                | `/posts` (exact)          | `<Root><Posts><PostsIndex>`       |
| ┄ ʦ `$postId.tsx`              | `/posts/$postId`          | `<Root><Posts><Post>`             |
| ┄ ʦ `$postId.edit.tsx`         | `/posts/$postId/edit`     | `<Root><Posts><Post><EditPost>`   |
| ʦ `settings.tsx`               | `/settings`               | `<Root><Settings>`                |
| ʦ `settings.profile.tsx`       | `/settings/profile`       | `<Root><Settings><Profile>`       |
| ʦ `settings.notifications.tsx` | `/settings/notifications` | `<Root><Settings><Notifications>` |
| ʦ `account.tsx`                | `/account`                | `<Root><Account>`                 |
| ʦ `account.overview.tsx`       | `/account/overview`       | `<Root><Account><Overview>`       |

Routes flat e por diretório podem ser combinadas para criar uma árvore de routes que usa o melhor dos dois mundos onde fizer sentido.

> [!TIP]
> Se você achar que a estrutura padrão de file-based routing não atende suas necessidades, você sempre pode usar [Virtual File Routes](./virtual-file-routes.md) para controlar a origem das suas routes enquanto ainda aproveita os incríveis benefícios de performance do file-based routing.

## Começando com File-Based Routing

Para começar com o file-based routing, você precisará configurar o bundler do seu projeto para usar o TanStack Router Plugin ou o TanStack Router CLI.

Para habilitar o file-based routing, você precisará estar usando React com um bundler suportado. Veja se o seu bundler está listado nos guias de configuração abaixo.

[//]: # "SupportedBundlersList"

- [Instalação com Vite](../installation/with-vite)
- [Instalação com Rspack/Rsbuild](../installation/with-rspack)
- [Instalação com Webpack](../installation/with-webpack)
- [Instalação com Esbuild](../installation/with-esbuild)

[//]: # "SupportedBundlersList"

Ao usar o file-based routing do TanStack Router através de um dos bundlers suportados, nosso plugin irá **gerar automaticamente a configuração das suas routes através dos processos de dev e build do seu bundler**. É a forma mais fácil de usar os recursos de geração de routes do TanStack Router.

Se o seu bundler ainda não é suportado, você pode entrar em contato conosco no Discord ou GitHub para nos informar.
