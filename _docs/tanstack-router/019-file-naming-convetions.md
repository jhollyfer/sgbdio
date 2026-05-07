---
title: File Naming Conventions
---

O file-based routing requer que você siga algumas convenções simples de nomeação de arquivos para garantir que suas routes sejam geradas corretamente. Os conceitos que essas convenções habilitam são cobertos em detalhes no guia [Route Trees & Nesting](./route-trees.md).

| Recurso                           | Descrição                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`__root.tsx`**                   | O arquivo da root route deve ser nomeado `__root.tsx` e deve ser colocado na raiz do `routesDirectory` configurado.                                                                                                                                                                                                                                                                                                                                |
| **Separador `.`**                  | As routes podem usar o caractere `.` para denotar uma route aninhada. Por exemplo, `blog.post` será gerada como filha de `blog`.                                                                                                                                                                                                                                                                                                                   |
| **Token `$`**                      | Segmentos de route com o token `$` são parametrizados e vão extrair o valor do pathname da URL como um `param` da route.                                                                                                                                                                                                                                                                                                                           |
| **Prefixo `_`**                    | Segmentos de route com o prefixo `_` são considerados pathless layout routes e não serão usados ao combinar suas routes filhas com o pathname da URL.                                                                                                                                                                                                                                                                                              |
| **Sufixo `_`**                     | Segmentos de route com o sufixo `_` excluem a route de ser aninhada sob qualquer route pai.                                                                                                                                                                                                                                                                                                                                                        |
| **Prefixo `-`**                    | Arquivos e pastas com o prefixo `-` são excluídos da route tree. Eles não serão adicionados ao arquivo `routeTree.gen.ts` e podem ser usados para colocar lógica junto às pastas de route.                                                                                                                                                                                                                                                         |
| **Padrão de nome de pasta `(folder)`** | Uma pasta que corresponde a este padrão é tratada como um **route group**, impedindo que a pasta seja incluída no path da URL da route.                                                                                                                                                                                                                                                                                                        |
| **Escape `[x]`**                   | Colchetes escapam caracteres especiais em nomes de arquivos que de outra forma teriam significado de routing. Por exemplo, `script[.]js.tsx` se torna `/script.js` e `api[.]v1.tsx` se torna `/api.v1`.                                                                                                                                                                                                                                             |
| **Token `index`**                  | Segmentos de route que terminam com o token `index` (antes de qualquer extensão de arquivo) vão corresponder à route pai quando o pathname da URL corresponder exatamente à route pai. Isso pode ser configurado via a opção de configuração `indexToken` (suporta tanto strings quanto padrões regex), veja [opções](../../../api/file-based-routing.md#indextoken).                                                                                |
| **Tipo de arquivo `.route.tsx`**   | Ao usar diretórios para organizar routes, o sufixo `route` pode ser usado para criar um arquivo de route no path do diretório. Por exemplo, `blog.post.route.tsx` ou `blog/post/route.tsx` podem ser usados como o arquivo de route para a route `/blog/post`. Isso pode ser configurado via a opção de configuração `routeToken` (suporta tanto strings quanto padrões regex), veja [opções](../../../api/file-based-routing.md#routetoken).       |

> **Lembre-se:** As convenções de nomeação de arquivo do seu projeto podem ser afetadas pelas [opções](../../../api/file-based-routing.md) configuradas.

## Path Params Dinâmicos

Path params dinâmicos podem ser usados tanto em flat routes quanto em directory routes para criar routes que podem corresponder a um segmento dinâmico do path da URL. Path params dinâmicos são denotados pelo caractere `$` no nome do arquivo:

| Filename              | Route Path       | Component Output      |
| --------------------- | ---------------- | --------------------- |
| ...                   | ...              | ...                   |
| ʦ `posts.$postId.tsx` | `/posts/$postId` | `<Root><Posts><Post>` |

Vamos aprender mais sobre path params dinâmicos no guia [Path Params](../guide/path-params.md).

## Pathless Routes

Pathless routes envolvem routes filhas com lógica ou um component sem exigir um path de URL. Routes sem path são denotadas pelo caractere `_` no nome do arquivo:

| Filename       | Route Path | Component Output |
| -------------- | ---------- | ---------------- |
| ʦ `_app.tsx`   |            |                  |
| ʦ `_app.a.tsx` | /a         | `<Root><App><A>` |
| ʦ `_app.b.tsx` | /b         | `<Root><App><B>` |

Para saber mais sobre pathless routes, veja o guia [Routing Concepts - Pathless Routes](./routing-concepts.md#pathless-layout-routes).
