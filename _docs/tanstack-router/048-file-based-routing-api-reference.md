---
title: File-Based Routing API Reference
---

O file-based routing do TanStack Router é bastante flexível e pode ser configurado para atender às necessidades do seu projeto.

## Opções de configuração

As seguintes opções estão disponíveis para configurar o file-based routing:

- [`routesDirectory` (obrigatório)](#routesdirectory-required)
- [`generatedRouteTree` (obrigatório)](#generatedroutetree-required)
- [`virtualRouteConfig`](#virtualrouteconfig)
- [`routeFilePrefix`](#routefileprefix)
- [`routeFileIgnorePrefix`](#routefileignoreprefix)
- [`routeFileIgnorePattern`](#routefileignorepattern)
- [`indexToken`](#indextoken)
- [`routeToken`](#routetoken)
- [`quoteStyle`](#quotestyle)
- [`semicolons`](#semicolons)
- [`autoCodeSplitting`](#autocodesplitting)
- [`disableTypes`](#disabletypes)
- [`addExtensions`](#addextensions)
- [`disableLogging`](#disablelogging)
- [`routeTreeFileHeader`](#routetreefileheader)
- [`routeTreeFileFooter`](#routetreefilefooter)
- [`enableRouteTreeFormatting`](#enableroutetreeformatting)
- [`tmpDir`](#tmpdir)

> [!WARNING]
> Não defina as opções `routeFilePrefix`, `routeFileIgnorePrefix` ou `routeFileIgnorePattern` para corresponder a qualquer um dos tokens usados no guia de **Convenções de Nomenclatura de Arquivos**, ou você pode encontrar comportamentos inesperados.

### `routesDirectory` (obrigatório)

Este é o caminho para o diretório onde os arquivos de route estão localizados, relativo ao cwd (diretório de trabalho atual).

Por padrão, o valor é definido como o seguinte e não pode ser definido como uma `string` vazia ou `undefined`.

```txt
./src/routes
```

### `generatedRouteTree` (obrigatório)

Este é o caminho para o arquivo onde a route tree gerada será salva, relativo ao cwd (diretório de trabalho atual).

Por padrão, o valor é definido como o seguinte e não pode ser definido como uma `string` vazia ou `undefined`.

```txt
./src/routeTree.gen.ts
```

Se o [`disableTypes`](#disabletypes) estiver definido como `true`, a route tree gerada será salva com a extensão `.js` em vez de `.ts`.

### `virtualRouteConfig`

Esta opção é usada para configurar o recurso de Virtual File Routes. Consulte o guia "Virtual File Routes" para mais informações.

Por padrão, este valor é definido como `undefined`.

### `routeFilePrefix`

Esta opção é usada para identificar arquivos de route no diretório de routes. Isso significa que apenas arquivos que começam com este prefixo serão considerados para roteamento.

Por padrão, este valor é definido como `` e, portanto, todos os arquivos no diretório de routes serão considerados para roteamento.

### `routeFileIgnorePrefix`

Esta opção é usada para ignorar arquivos e diretórios específicos no diretório de routes. Isso pode ser útil se você quiser "excluir" certos arquivos ou diretórios que não deseja que sejam considerados para roteamento.

Por padrão, este valor é definido como `-`.

Ao usar esta opção, você pode ter estruturas como esta, onde é possível co-localizar arquivos relacionados que não são arquivos de route:

```txt
src/routes
├── posts
│   ├── -components  // Ignored
│   │   ├── Post.tsx
│   ├── index.tsx
│   ├── route.tsx
```

### `routeFileIgnorePattern`

Esta opção é usada para ignorar arquivos e diretórios específicos no diretório de routes. Pode ser usada no formato de expressão regular. Por exemplo, `.((css|const).ts)|test-page` irá ignorar arquivos/diretórios com nomes contendo `.css.ts`, `.const.ts` ou `test-page`.

Por padrão, este valor é definido como `undefined`.

### `routeToken`

Como mencionado no guia de Conceitos de Roteamento, um layout route é renderizado no caminho especificado, e os child routes são renderizados dentro do layout route. O `routeToken` é usado para identificar o arquivo de layout route no diretório de routes.

Por padrão, este valor é definido como `route`.

> 🧠 os seguintes nomes de arquivo resultariam na mesma URL em tempo de execução:

```txt
src/routes/posts.tsx -> /posts
src/routes/posts.route.tsx -> /posts
src/routes/posts/route.tsx -> /posts
```

#### Usando padrões regex para `routeToken`

Você pode usar um padrão de expressão regular em vez de uma string literal para corresponder a múltiplas convenções de nomenclatura de layout route. Isso é útil quando você deseja mais flexibilidade na nomenclatura dos seus arquivos.

**No `tsr.config.json`** (configuração JSON), use um objeto com as propriedades `regex` e opcionalmente `flags`:

```json
{
  "routeToken": { "regex": "[a-z]+-layout", "flags": "i" }
}
```

**No código** (configuração inline), você pode usar um `RegExp` nativo:

```ts
{
  routeToken: /[a-z]+-layout/i;
}
```

Com o padrão regex `[a-z]+-layout`, nomes de arquivo como `dashboard.main-layout.tsx`, `posts.protected-layout.tsx` ou `admin.settings-layout.tsx` seriam todos reconhecidos como layout routes.

> [!NOTE]
> O regex é correspondido contra o segmento final **inteiro** do caminho do route. Por exemplo, com `routeToken: { "regex": "[a-z]+-layout" }`:
>
> - `dashboard.main-layout.tsx` corresponde (`main-layout` é o segmento completo)
> - `dashboard.my-layout-extra.tsx` NÃO corresponde (o segmento é `my-layout-extra`, não apenas `my-layout`)

### `indexToken`

Como mencionado no guia de Conceitos de Roteamento, um index route é um route que é correspondido quando o caminho da URL é exatamente o mesmo que o route pai. O `indexToken` é usado para identificar o arquivo de index route no diretório de routes.

Por padrão, este valor é definido como `index`.

> 🧠 os seguintes nomes de arquivo resultariam na mesma URL em tempo de execução:

```txt
src/routes/posts.index.tsx -> /posts/
src/routes/posts/index.tsx -> /posts/
```

#### Usando padrões regex para `indexToken`

Similar ao `routeToken`, você pode usar um padrão de expressão regular para o `indexToken` para corresponder a múltiplas convenções de nomenclatura de index route.

**No `tsr.config.json`** (configuração JSON):

```json
{
  "indexToken": { "regex": "[a-z]+-page" }
}
```

**No código** (configuração inline):

```ts
{
  indexToken: /[a-z]+-page/;
}
```

Com o padrão regex `[a-z]+-page`, nomes de arquivo como `home-page.tsx`, `posts.list-page.tsx` ou `dashboard.overview-page.tsx` seriam todos reconhecidos como index routes.

#### Escapando tokens regex

Ao usar tokens regex, você ainda pode escapar um segmento para impedir que ele seja tratado como um token, envolvendo-o em colchetes. Por exemplo, se seu `indexToken` é `{ "regex": "[a-z]+-page" }` e você quer um segmento de route literal chamado `home-page`, nomeie seu arquivo como `[home-page].tsx`.

### `quoteStyle`

Quando sua route tree gerada é criada e quando você cria um novo route pela primeira vez, esses arquivos serão formatados com o estilo de aspas que você especificar aqui.

Por padrão, este valor é definido como `single`.

> [!TIP]
> Você deve ignorar o caminho do arquivo da route tree gerada no seu linter e formatador para evitar conflitos.

### `semicolons`

Quando sua route tree gerada é criada e quando você cria um novo route pela primeira vez, esses arquivos serão formatados com ponto e vírgula se esta opção estiver definida como `true`.

Por padrão, este valor é definido como `false`.

> [!TIP]
> Você deve ignorar o caminho do arquivo da route tree gerada no seu linter e formatador para evitar conflitos.

### `autoCodeSplitting`

Este recurso está disponível apenas se você estiver usando o TanStack Router Bundler Plugin.

Esta opção é usada para habilitar code splitting automático para itens de configuração de route não críticos. Consulte o guia "Code Splitting Automático" para mais informações.

Por padrão, este valor é definido como `false`.

> [!IMPORTANT]
> A próxima versão major do TanStack Router (ou seja, v2) terá este valor como `true` por padrão.

### `disableTypes`

Esta opção é usada para desabilitar a geração de tipos para a route tree.

Se definido como `true`, a route tree gerada não incluirá nenhum tipo e será escrita como um arquivo `.js` em vez de um arquivo `.ts`.

Por padrão, este valor é definido como `false`.

### `addExtensions`

Esta opção adiciona extensões de arquivo aos nomes de route na route tree gerada.

Por padrão, este valor é definido como `false`.

### `disableLogging`

Esta opção desativa o log no console para o processo de geração de routes.

Por padrão, este valor é definido como `false`.

### `routeTreeFileHeader`

Esta opção permite que você adicione conteúdo no início do arquivo da route tree gerada.

Por padrão, este valor é definido como:

```json
[
  "/* eslint-disable */",
  "// @ts-nocheck",
  "// noinspection JSUnusedGlobalSymbols"
]
```

### `routeTreeFileFooter`

Esta opção permite que você adicione conteúdo ao final do arquivo da route tree gerada.

Por padrão, este valor é definido como:

```json
[]
```

### `enableRouteTreeFormatting`

Esta opção ativa a função de formatação no arquivo da route tree gerada, o que pode ser demorado para projetos grandes.

Por padrão, este valor é definido como `true`.

### `tmpDir`

Escritas atômicas de arquivos (arquivos de route e o arquivo da route tree gerada) são implementadas criando um arquivo temporário primeiro e depois renomeando-o para sua localização real.

Esta opção de configuração permite configurar o caminho do diretório temporário que será usado para criar esses arquivos temporários.
Se for um caminho relativo, ele será resolvido em relação ao diretório de trabalho atual.
Se este valor não for definido, `process.env.TSR_TMP_DIR` será usado.
Se `process.env.TSR_TMP_DIR` não estiver definido, o padrão será `.tanstack/tmp` relativo ao diretório de trabalho atual.
