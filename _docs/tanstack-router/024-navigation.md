---
title: Navigation
---

## Tudo é Relativo

Acredite ou não, toda navegação dentro de um app é **relativa**, mesmo que você não esteja usando sintaxe explícita de caminho relativo (`../../somewhere`). Toda vez que um link é clicado ou uma chamada de navegação imperativa é feita, você sempre terá um caminho de **origem** e um caminho de **destino**, o que significa que você está navegando **de** uma route **para** outra route.

O TanStack Router mantém esse conceito constante de navegação relativa em mente para cada navegação, então você verá constantemente duas propriedades na API:

- `from` - O caminho da route de origem
- `to` - O caminho da route de destino

> ⚠️ Se um caminho de route `from` não for fornecido, o router assumirá que você está navegando a partir da route raiz `/` e só fará autocomplete de caminhos absolutos. Afinal, você precisa saber de onde está vindo para saber para onde está indo 😉.

## API de Navegação Compartilhada

Toda API de navegação e correspondência de routes no TanStack Router usa a mesma interface central com pequenas diferenças dependendo da API. Isso significa que você pode aprender navegação e correspondência de routes uma vez e usar a mesma sintaxe e conceitos em toda a biblioteca.

### Interface `ToOptions`

Esta é a interface central `ToOptions` que é usada em toda API de navegação e correspondência de routes:

```ts
type ToOptions<
  TRouteTree extends AnyRoute = AnyRoute,
  TFrom extends RoutePaths<TRouteTree> | string = string,
  TTo extends string = "",
> = {
  // `from` is an optional route ID or path. If it is not supplied, only absolute paths will be auto-completed and type-safe. It's common to supply the route.fullPath of the origin route you are rendering from for convenience. If you don't know the origin route, leave this empty and work with absolute paths or unsafe relative paths.
  from?: string;
  // `to` can be an absolute route path or a relative path from the `from` option to a valid route path. ⚠️ Do not interpolate path params, hash or search params into the `to` options. Use the `params`, `search`, and `hash` options instead.
  to: string;
  // `params` is either an object of path params to interpolate into the `to` option or a function that supplies the previous params and allows you to return new ones. This is the only way to interpolate dynamic parameters into the final URL. Depending on the `from` and `to` route, you may need to supply none, some or all of the path params. TypeScript will notify you of the required params if there are any.
  params:
    | Record<string, unknown>
    | ((prevParams: Record<string, unknown>) => Record<string, unknown>);
  // `search` is either an object of query params or a function that supplies the previous search and allows you to return new ones. Depending on the `from` and `to` route, you may need to supply none, some or all of the query params. TypeScript will notify you of the required search params if there are any.
  search:
    | Record<string, unknown>
    | ((prevSearch: Record<string, unknown>) => Record<string, unknown>);
  // `hash` is either a string or a function that supplies the previous hash and allows you to return a new one.
  hash?: string | ((prevHash: string) => string);
  // `state` is either an object of state or a function that supplies the previous state and allows you to return a new one. State is stored in the history API and can be useful for passing data between routes that you do not want to permanently store in URL search params.
  state?:
    | Record<string, any>
    | ((prevState: Record<string, unknown>) => Record<string, unknown>);
};
```

> 🧠 Todo objeto de route tem uma propriedade `to`, que pode ser usada como o `to` para qualquer API de navegação ou correspondência de route. Quando possível, isso permitirá que você evite strings simples e use referências de route com type safety em vez disso:

```tsx
import { Route as aboutRoute } from "./routes/about.tsx";

function Comp() {
  return <Link to={aboutRoute.to}>About</Link>;
}
```

### Interface `NavigateOptions`

Esta é a interface central `NavigateOptions` que estende `ToOptions`. Qualquer API que esteja realmente realizando uma navegação usará esta interface:

```ts
export type NavigateOptions<
  TRouteTree extends AnyRoute = AnyRoute,
  TFrom extends RoutePaths<TRouteTree> | string = string,
  TTo extends string = "",
> = ToOptions<TRouteTree, TFrom, TTo> & {
  // `replace` is a boolean that determines whether the navigation should replace the current history entry or push a new one.
  replace?: boolean;
  // `resetScroll` is a boolean that determines whether scroll position will be reset to 0,0 after the location is committed to browser history.
  resetScroll?: boolean;
  // `hashScrollIntoView` is a boolean or object that determines whether an id matching the hash will be scrolled into view after the location is committed to history.
  hashScrollIntoView?: boolean | ScrollIntoViewOptions;
  // `viewTransition` is either a boolean or function that determines if and how the browser will call document.startViewTransition() when navigating.
  viewTransition?: boolean | ViewTransitionOptions;
  // `ignoreBlocker` is a boolean that determines if navigation should ignore any blockers that might prevent it.
  ignoreBlocker?: boolean;
  // `reloadDocument` is a boolean that determines if navigation to a route inside of router will trigger a full page load instead of the traditional SPA navigation.
  reloadDocument?: boolean;
  // `href` is a string that can be used in place of `to` to navigate to a full built href, e.g. pointing to an external target.
  href?: string;
};
```

### Interface `LinkOptions`

Em qualquer lugar onde uma tag `<a>` real for usada, a interface `LinkOptions` que estende `NavigateOptions` estará disponível:

```tsx
export type LinkOptions<
  TRouteTree extends AnyRoute = AnyRoute,
  TFrom extends RoutePaths<TRouteTree> | string = string,
  TTo extends string = "",
> = NavigateOptions<TRouteTree, TFrom, TTo> & {
  // The standard anchor tag target attribute
  target?: HTMLAnchorElement["target"];
  // Defaults to `{ exact: false, includeHash: false }`
  activeOptions?: {
    exact?: boolean;
    includeHash?: boolean;
    includeSearch?: boolean;
    explicitUndefined?: boolean;
  };
  // If set, will preload the linked route on hover and cache it for this many milliseconds in hopes that the user will eventually navigate there.
  preload?: false | "intent";
  // Delay intent preloading by this many milliseconds. If the intent exits before this delay, the preload will be cancelled.
  preloadDelay?: number;
  // If true, will render the link without the href attribute
  disabled?: boolean;
};
```

## API de Navegação

Com a navegação relativa e todas as interfaces em mente agora, vamos falar sobre os diferentes sabores de API de navegação à sua disposição:

- O component `<Link>`
  - Gera uma tag `<a>` real com um `href` válido que pode ser clicado ou até mesmo cmd/ctrl + clicado para abrir em uma nova aba
- O hook `useNavigate()`
  - Quando possível, o component `Link` deve ser usado para navegação, mas às vezes você precisa navegar imperativamente como resultado de um efeito colateral. `useNavigate` retorna uma função que pode ser chamada para realizar uma navegação imediata no lado do cliente.
- O component `<Navigate>`
  - Não renderiza nada e realiza uma navegação imediata no lado do cliente.
- O método `Router.navigate()`
  - Esta é a API de navegação mais poderosa do TanStack Router. Similar ao `useNavigate`, ele navega imperativamente, mas está disponível em qualquer lugar onde você tenha acesso à sua instância do router.

⚠️ Nenhuma dessas APIs substitui redirecionamentos no lado do servidor. Se você precisar redirecionar um usuário imediatamente de uma route para outra antes de montar sua aplicação, use um redirecionamento no lado do servidor em vez de uma navegação no lado do cliente.

## Component `<Link>`

O component `Link` é a forma mais comum de navegar dentro de um app. Ele renderiza uma tag `<a>` real com um atributo `href` válido que pode ser clicado ou até mesmo cmd/ctrl + clicado para abrir em uma nova aba. Ele também suporta quaisquer atributos normais de `<a>`, incluindo `target` para abrir links em novas janelas, etc.

Além da interface [`LinkOptions`](#interface-linkoptions), o component `Link` também suporta as seguintes props:

```tsx
export type LinkProps<
  TFrom extends RoutePaths<RegisteredRouter["routeTree"]> | string = string,
  TTo extends string = "",
> = LinkOptions<RegisteredRouter["routeTree"], TFrom, TTo> & {
  // A function that returns additional props for the `active` state of this link. These props override other props passed to the link (`style`'s are merged, `className`'s are concatenated)
  activeProps?:
    | FrameworkHTMLAnchorTagAttributes
    | (() => FrameworkHTMLAnchorAttributes);
  // A function that returns additional props for the `inactive` state of this link. These props override other props passed to the link (`style`'s are merged, `className`'s are concatenated)
  inactiveProps?:
    | FrameworkHTMLAnchorAttributes
    | (() => FrameworkHTMLAnchorAttributes);
};
```

### Links Absolutos

Vamos criar um link estático simples!

```tsx
import { Link } from "@tanstack/react-router";

const link = <Link to="/about">About</Link>;
```

### Links Dinâmicos

Links dinâmicos são links que possuem segmentos dinâmicos neles. Por exemplo, um link para um post de blog pode ser assim:

```tsx
const link = (
  <Link
    to="/blog/post/$postId"
    params={{
      postId: "my-first-blog-post",
    }}
  >
    Blog Post
  </Link>
);
```

Tenha em mente que normalmente os params de segmentos dinâmicos são valores `string`, mas eles também podem ser qualquer outro tipo para o qual você os faça parse nas opções da sua route. De qualquer forma, o tipo será verificado em tempo de compilação para garantir que você está passando o tipo correto.

### Links Relativos

Por padrão, todos os links são absolutos, a menos que um caminho de route `from` seja fornecido. Isso significa que o link acima sempre navegará para a route `/about`, independentemente de qual route você está atualmente.

Links relativos podem ser combinados com um caminho de route `from`. Se um caminho de route `from` não for fornecido, caminhos relativos usarão por padrão a localização ativa atual.

> [!NOTE]
> Tenha em mente que ao chamar useNavigate como um método na route, por exemplo `Route.useNavigate`, a localização `from` é predefinida como a route na qual ele é chamado.
>
> Outra armadilha comum é quando se usa isso em uma layout route sem caminho (pathless), já que a layout route sem caminho não tem um caminho real, a localização `from` é considerada como o pai da layout route sem caminho. Portanto, o roteamento relativo será resolvido a partir desse pai.

```tsx
const postIdRoute = createRoute({
  path: "/blog/post/$postId",
});

const link = (
  <Link from={postIdRoute.fullPath} to="../categories">
    Categories
  </Link>
);
```

Como visto acima, é comum fornecer o `route.fullPath` como o caminho de route `from`. Isso porque o `route.fullPath` é uma referência que será atualizada se você refatorar sua aplicação. No entanto, às vezes não é possível importar a route diretamente, nesse caso é perfeitamente aceitável fornecer o caminho da route diretamente como uma string. Ele ainda será verificado por tipos como de costume!

### Caminhos relativos especiais: `"."` e `".."`

Com bastante frequência você pode querer recarregar a localização atual ou outro caminho `from`, por exemplo, para re-executar os loaders na route atual e/ou nas routes pai, ou talvez navegar de volta para uma route pai. Isso pode ser alcançado especificando um caminho de route `to` de `"."` que recarregará a localização atual ou o caminho `from` fornecido.

Outra necessidade comum é navegar uma route para trás em relação à localização atual ou outro caminho. Especificando um caminho de route `to` de `".."`, a navegação será resolvida para a primeira route pai que precede a localização atual.

```tsx
export const Route = createFileRoute("/posts/$postId")({
  component: PostComponent,
});

function PostComponent() {
  return (
    <div>
      <Link to=".">Reload the current route of /posts/$postId</Link>
      <Link to="..">Navigate back to /posts</Link>
      // the below are all equivalent
      <Link to="/posts">Navigate back to /posts</Link>
      <Link from="/posts" to=".">
        Navigate back to /posts
      </Link>
      // the below are all equivalent
      <Link to="/">Navigate to root</Link>
      <Link from="/posts" to="..">
        Navigate to root
      </Link>
    </div>
  );
}
```

### Links com Search Params

Search params são uma ótima forma de fornecer contexto adicional a uma route. Por exemplo, você pode querer fornecer uma consulta de busca para uma página de pesquisa:

```tsx
const link = (
  <Link
    to="/search"
    search={{
      query: "tanstack",
    }}
  >
    Search
  </Link>
);
```

Também é comum querer atualizar um único search param sem fornecer nenhuma outra informação sobre a route existente. Por exemplo, você pode querer atualizar o número da página de um resultado de busca:

```tsx
const link = (
  <Link
    to="."
    search={(prev) => ({
      ...prev,
      page: prev.page + 1,
    })}
  >
    Next Page
  </Link>
);
```

### Type Safety de Search Params

Search params são um mecanismo de gerenciamento de state altamente dinâmico, então é importante garantir que você está passando os tipos corretos para seus search params. Veremos em uma seção posterior em detalhes como validar e garantir a type safety de search params, entre outras ótimas funcionalidades!

### Links com Hash

Links com hash são uma ótima forma de vincular a uma seção específica de uma página. Por exemplo, você pode querer vincular a uma seção específica de um post de blog:

```tsx
const link = (
  <Link
    to="/blog/post/$postId"
    params={{
      postId: "my-first-blog-post",
    }}
    hash="section-1"
  >
    Section 1
  </Link>
);
```

> ⚠️ Ao navegar diretamente para uma URL com um fragmento de hash, o fragmento está disponível apenas no cliente; o navegador não envia o fragmento para o servidor como parte da URL da requisição.
>
> Isso significa que se você está usando uma abordagem de rendering no lado do servidor, o fragmento de hash não estará disponível no lado do servidor, e erros de hydration podem ocorrer ao usar o hash para renderizar marcação.
>
> Exemplos disso seriam:
>
> - retornar o valor do hash na marcação,
> - rendering condicional baseado no valor do hash, ou
> - definir o Link como ativo baseado no valor do hash.

### Navegando com Parâmetros Opcionais

Parâmetros de caminho opcionais fornecem padrões de navegação flexíveis onde você pode incluir ou omitir parâmetros conforme necessário. Parâmetros opcionais usam a sintaxe `{-$paramName}` e oferecem controle granular sobre a estrutura da URL.

#### Herança de Parâmetros vs Remoção

Ao navegar com parâmetros opcionais, você tem duas estratégias principais:

**Herdando os Parâmetros Atuais**
Use `params: {}` para herdar todos os parâmetros da route atual:

```tsx
// Inherits current route parameters
<Link to="/posts/{-$category}" params={{}}>
  All Posts
</Link>
```

**Removendo Parâmetros**
Defina os parâmetros como `undefined` para removê-los explicitamente:

```tsx
// Removes the category parameter
<Link to="/posts/{-$category}" params={{ category: undefined }}>
  All Posts
</Link>
```

#### Navegação Básica com Parâmetro Opcional

```tsx
// Navigate with optional parameter
<Link
  to="/posts/{-$category}"
  params={{ category: 'tech' }}
>
  Tech Posts
</Link>

// Navigate without optional parameter
<Link
  to="/posts/{-$category}"
  params={{ category: undefined }}
>
  All Posts
</Link>

// Navigate using parameter inheritance
<Link
  to="/posts/{-$category}"
  params={{}}
>
  Current Category
</Link>
```

#### Atualizações de Parâmetros com Estilo de Função

Atualizações de parâmetros com estilo de função são particularmente úteis com parâmetros opcionais:

```tsx
// Remove a parameter using function syntax
<Link
  to="/posts/{-$category}"
  params={(prev) => ({ ...prev, category: undefined })}
>
  Clear Category
</Link>

// Update a parameter while keeping others
<Link
  to="/articles/{-$category}/{-$slug}"
  params={(prev) => ({ ...prev, category: 'news' })}
>
  News Articles
</Link>

// Conditionally set parameters
<Link
  to="/posts/{-$category}"
  params={(prev) => ({
    ...prev,
    category: someCondition ? 'tech' : undefined
  })}
>
  Conditional Category
</Link>
```

#### Múltiplos Parâmetros Opcionais

Ao trabalhar com múltiplos parâmetros opcionais, você pode misturar e combinar quais incluir:

```tsx
// Navigate with some optional parameters
<Link
  to="/posts/{-$category}/{-$slug}"
  params={{ category: 'tech', slug: undefined }}
>
  Tech Posts
</Link>

// Remove all optional parameters
<Link
  to="/posts/{-$category}/{-$slug}"
  params={{ category: undefined, slug: undefined }}
>
  All Posts
</Link>

// Set multiple parameters
<Link
  to="/posts/{-$category}/{-$slug}"
  params={{ category: 'tech', slug: 'react-tips' }}
>
  Specific Post
</Link>
```

#### Parâmetros Obrigatórios e Opcionais Misturados

Parâmetros opcionais funcionam perfeitamente com parâmetros obrigatórios:

```tsx
// Required 'id', optional 'tab'
<Link
  to="/users/$id/{-$tab}"
  params={{ id: '123', tab: 'settings' }}
>
  User Settings
</Link>

// Remove optional parameter while keeping required
<Link
  to="/users/$id/{-$tab}"
  params={{ id: '123', tab: undefined }}
>
  User Profile
</Link>

// Use function style with mixed parameters
<Link
  to="/users/$id/{-$tab}"
  params={(prev) => ({ ...prev, tab: 'notifications' })}
>
  User Notifications
</Link>
```

#### Padrões Avançados de Parâmetros Opcionais

**Parâmetros com Prefixo e Sufixo**
Parâmetros opcionais com prefixo/sufixo funcionam com navegação:

```tsx
// Navigate to file with optional name
<Link
  to="/files/prefix{-$name}.txt"
  params={{ name: 'document' }}
>
  Document File
</Link>

// Navigate to file without optional name
<Link
  to="/files/prefix{-$name}.txt"
  params={{ name: undefined }}
>
  Default File
</Link>
```

**Todos os Parâmetros Opcionais**
Routes onde todos os parâmetros são opcionais:

```tsx
// Navigate to specific date
<Link
  to="/{-$year}/{-$month}/{-$day}"
  params={{ year: '2023', month: '12', day: '25' }}
>
  Christmas 2023
</Link>

// Navigate to partial date
<Link
  to="/{-$year}/{-$month}/{-$day}"
  params={{ year: '2023', month: '12', day: undefined }}
>
  December 2023
</Link>

// Navigate to root with all parameters removed
<Link
  to="/{-$year}/{-$month}/{-$day}"
  params={{ year: undefined, month: undefined, day: undefined }}
>
  Home
</Link>
```

#### Navegação com Search Params e Parâmetros Opcionais

Parâmetros opcionais funcionam muito bem em combinação com search params:

```tsx
// Combine optional path params with search params
<Link
  to="/posts/{-$category}"
  params={{ category: 'tech' }}
  search={{ page: 1, sort: 'newest' }}
>
  Tech Posts - Page 1
</Link>

// Remove path param but keep search params
<Link
  to="/posts/{-$category}"
  params={{ category: undefined }}
  search={(prev) => prev}
>
  All Posts - Same Filters
</Link>
```

#### Navegação Imperativa com Parâmetros Opcionais

Todos os mesmos padrões funcionam com navegação imperativa:

```tsx
function Component() {
  const navigate = useNavigate();

  const clearFilters = () => {
    navigate({
      to: "/posts/{-$category}/{-$tag}",
      params: { category: undefined, tag: undefined },
    });
  };

  const setCategory = (category: string) => {
    navigate({
      to: "/posts/{-$category}/{-$tag}",
      params: (prev) => ({ ...prev, category }),
    });
  };

  const applyFilters = (category?: string, tag?: string) => {
    navigate({
      to: "/posts/{-$category}/{-$tag}",
      params: { category, tag },
    });
  };
}
```

### Props Active e Inactive

O component `Link` suporta duas props adicionais: `activeProps` e `inactiveProps`. Essas props são funções que retornam props adicionais para os states `active` e `inactive` do link. Todas as props, exceto estilos e classes passados aqui, substituirão as props originais passadas ao `Link`. Quaisquer estilos ou classes passados são mesclados juntos.

Aqui está um exemplo:

```tsx
const link = (
  <Link
    to="/blog/post/$postId"
    params={{
      postId: "my-first-blog-post",
    }}
    activeProps={{
      style: {
        fontWeight: "bold",
      },
    }}
  >
    Section 1
  </Link>
);
```

### O atributo `data-status`

Além das props `activeProps` e `inactiveProps`, o component `Link` também adiciona um atributo `data-status` ao elemento renderizado quando está em state ativo. Este atributo será `active` ou `undefined` dependendo do state atual do link. Isso pode ser útil se você preferir usar data-attributes para estilizar seus links em vez de props.

### Opções de Active

O component `Link` possui uma propriedade `activeOptions` que oferece algumas opções para determinar se um link está ativo ou não. A seguinte interface descreve essas opções:

```tsx
export interface ActiveOptions {
  // If true, the link will be active if the current route matches the `to` route path exactly (no children routes)
  // Defaults to `false`
  exact?: boolean;
  // If true, the link will only be active if the current URL hash matches the `hash` prop
  // Defaults to `false`
  includeHash?: boolean; // Defaults to false
  // If true, the link will only be active if the current URL search params inclusively match the `search` prop
  // Defaults to `true`
  includeSearch?: boolean;
  // This modifies the `includeSearch` behavior.
  // If true,  properties in `search` that are explicitly `undefined` must NOT be present in the current URL search params for the link to be active.
  // defaults to `false`
  explicitUndefined?: boolean;
}
```

Por padrão, ele verificará se o **pathname** resultante é um prefixo da route atual. Se algum search param for fornecido, ele verificará que eles correspondem _inclusivamente_ aos da localização atual. Hashes não são verificados por padrão.

Por exemplo, se você estiver na route `/blog/post/my-first-blog-post`, os seguintes links estarão ativos:

```tsx
const link1 = (
  <Link to="/blog/post/$postId" params={{ postId: "my-first-blog-post" }}>
    Blog Post
  </Link>
);
const link2 = <Link to="/blog/post">Blog Post</Link>;
const link3 = <Link to="/blog">Blog Post</Link>;
```

No entanto, os seguintes links não estarão ativos:

```tsx
const link4 = (
  <Link to="/blog/post/$postId" params={{ postId: "my-second-blog-post" }}>
    Blog Post
  </Link>
);
```

É comum que alguns links só estejam ativos se forem uma correspondência exata. Um bom exemplo disso seria um link para a página inicial. Em cenários como esses, você pode passar a opção `exact: true`:

```tsx
const link = (
  <Link to="/" activeOptions={{ exact: true }}>
    Home
  </Link>
);
```

Isso garantirá que o link não fique ativo quando você estiver em uma route filha.

Mais algumas opções para estar ciente:

- Se você quiser incluir o hash na sua correspondência, pode passar a opção `includeHash: true`
- Se você **não** quiser incluir os search params na sua correspondência, pode passar a opção `includeSearch: false`

### Passando `isActive` para filhos

O component `Link` aceita uma função como seus filhos, permitindo que você propague sua propriedade `isActive` para os filhos. Por exemplo, você poderia estilizar um component filho com base em se o link pai está ativo:

```tsx
const link = (
  <Link to="/blog/post">
    {({ isActive }) => {
      return (
        <>
          <span>My Blog Post</span>
          <icon className={isActive ? "active" : "inactive"} />
        </>
      );
    }}
  </Link>
);
```

### Preloading de Link

O component `Link` suporta preloading automático de routes por intenção (hover ou touchstart por enquanto). Isso pode ser configurado como padrão nas opções do router (sobre o qual falaremos mais em breve) ou passando uma prop `preload='intent'` para o component `Link`. Aqui está um exemplo:

```tsx
const link = (
  <Link to="/blog/post/$postId" preload="intent">
    Blog Post
  </Link>
);
```

Com preloading habilitado e dependências assíncronas relativamente rápidas na route (se houver), esse truque simples pode aumentar a performance percebida da sua aplicação com muito pouco esforço.

O que é ainda melhor é que usando uma biblioteca cache-first como `@tanstack/query`, routes pré-carregadas permanecerão disponíveis e prontas para uma experiência stale-while-revalidate se o usuário decidir navegar para a route mais tarde.

### Atraso de Preloading do Link

Junto com o preloading há um atraso configurável que determina quanto tempo um usuário deve passar o mouse sobre um link para acionar o preloading baseado em intenção. O atraso padrão é de 50 milissegundos, mas você pode alterá-lo passando uma prop `preloadDelay` para o component `Link` com o número de milissegundos que deseja esperar:

```tsx
const link = (
  <Link to="/blog/post/$postId" preload="intent" preloadDelay={100}>
    Blog Post
  </Link>
);
```

## `useNavigate`

> ⚠️ Por causa das facilidades integradas do component `Link` em torno de `href`, capacidade de cmd/ctrl + click, e capacidades de active/inactive, é recomendado usar o component `Link` em vez de `useNavigate` para qualquer coisa com a qual o usuário possa interagir (por exemplo, links, botões). No entanto, existem alguns casos onde `useNavigate` é necessário para lidar com navegações de efeito colateral (por exemplo, uma ação assíncrona bem-sucedida que resulta em uma navegação).

O hook `useNavigate` retorna uma função `navigate` que pode ser chamada para navegar imperativamente. É uma ótima forma de navegar para uma route a partir de um efeito colateral (por exemplo, uma ação assíncrona bem-sucedida). Aqui está um exemplo:

```tsx
function Component() {
  const navigate = useNavigate({ from: "/posts/$postId" });

  const handleSubmit = async (e: FrameworkFormEvent) => {
    e.preventDefault();

    const response = await fetch("/posts", {
      method: "POST",
      body: JSON.stringify({ title: "My First Post" }),
    });

    const { id: postId } = await response.json();

    if (response.ok) {
      navigate({ to: "/posts/$postId", params: { postId } });
    }
  };
}
```

> 🧠 Como mostrado acima, você pode passar a opção `from` para especificar a route de onde navegar na chamada do hook. Embora isso também seja possível passar na função `navigate` resultante cada vez que você a chamar, é recomendado passar aqui para reduzir potenciais erros e também digitar menos!

### Opções do `navigate`

A função `navigate` retornada por `useNavigate` aceita a [interface `NavigateOptions`](#interface-navigateoptions)

## Component `Navigate`

Ocasionalmente, você pode se encontrar precisando navegar imediatamente quando um component é montado. Seu primeiro instinto pode ser usar `useNavigate` e um efeito colateral imediato (por exemplo, useEffect), mas isso é desnecessário. Em vez disso, você pode renderizar o component `Navigate` para alcançar o mesmo resultado:

```tsx
function Component() {
  return <Navigate to="/posts/$postId" params={{ postId: "my-first-post" }} />;
}
```

Pense no component `Navigate` como uma forma de navegar para uma route imediatamente quando um component é montado. É uma ótima forma de lidar com redirecionamentos apenas no cliente. Ele _definitivamente não é_ um substituto para lidar com redirecionamentos conscientes do servidor de forma responsável no servidor.

## `router.navigate`

O método `router.navigate` é o mesmo que a função `navigate` retornada por `useNavigate` e aceita a mesma [interface `NavigateOptions`](#interface-navigateoptions). Diferente do hook `useNavigate`, ele está disponível em qualquer lugar onde sua instância do `router` estiver disponível e é, portanto, uma ótima forma de navegar imperativamente de qualquer lugar na sua aplicação, incluindo fora do seu framework.

## `useMatchRoute` e `<MatchRoute>`

O hook `useMatchRoute` e o component `<MatchRoute>` são a mesma coisa, mas o hook é um pouco mais flexível. Ambos aceitam a interface padrão de navegação `ToOptions` como opções ou props e retornam `true/false` se aquela route está atualmente correspondida. Ele também possui uma opção `pending` muito útil que retornará `true` se a route estiver atualmente pendente (por exemplo, uma route está atualmente em transição para aquela route). Isso pode ser extremamente útil para mostrar UI otimista em torno de para onde um usuário está navegando:

```tsx
function Component() {
  return (
    <div>
      <Link to="/users">
        Users
        <MatchRoute to="/users" pending>
          <Spinner />
        </MatchRoute>
      </Link>
    </div>
  );
}
```

A versão component `<MatchRoute>` também pode ser usada com uma função como filhos para renderizar algo quando a route é correspondida:

```tsx
function Component() {
  return (
    <div>
      <Link to="/users">
        Users
        <MatchRoute to="/users" pending>
          {(match) => {
            return <Spinner show={match} />;
          }}
        </MatchRoute>
      </Link>
    </div>
  );
}
```

A versão hook `useMatchRoute` retorna uma função que pode ser chamada programaticamente para verificar se uma route é correspondida:

```tsx
function Component() {
  const matchRoute = useMatchRoute();

  useEffect(() => {
    if (matchRoute({ to: "/users", pending: true })) {
      console.info("The /users route is matched and pending");
    }
  });

  return (
    <div>
      <Link to="/users">Users</Link>
    </div>
  );
}
```

---

Ufa! Isso foi muita navegação! Dito isso, esperamos que você esteja se sentindo bem confiante sobre como se locomover pela sua aplicação agora. Vamos em frente!
