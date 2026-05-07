---
title: Type Safety
---

O TanStack Router foi construído para ser o mais type-safe possível dentro dos limites do compilador e runtime do TypeScript. Isso significa que ele não é apenas escrito em TypeScript, mas que também **infere completamente os tipos fornecidos e os conduz tenazmente por toda a experiência de roteamento**.

No final das contas, isso significa que você **escreve menos tipos como desenvolvedor** e tem **mais confiança no seu código** à medida que ele evolui.

## Definições de Route

### Roteamento baseado em arquivo

As routes são hierárquicas, e suas definições também são. Se você estiver usando roteamento baseado em arquivo, grande parte da segurança de tipos já é cuidada para você.

### Roteamento baseado em código

Se você estiver usando a classe `Route` diretamente, precisará estar ciente de como garantir que suas routes sejam tipadas corretamente usando a opção `getParentRoute` da `Route`. Isso porque as routes filhas precisam estar cientes de **todos** os tipos de suas routes pai. Sem isso, aqueles preciosos search params que você extraiu de suas routes de _layout_ e _layout sem caminho_, 3 níveis acima, seriam perdidos no vazio do JS.

Então, não esqueça de passar a route pai para suas routes filhas!

```tsx
const parentRoute = createRoute({
  getParentRoute: () => parentRoute,
});
```

## Hooks, Components e Utilitários Exportados

Para que os tipos do seu router funcionem com exportações de nível superior como `Link`, `useNavigate`, `useParams`, etc., eles precisam permear a fronteira de módulo do TypeScript e ser registrados diretamente na biblioteca. Para fazer isso, usamos a mesclagem de declarações na interface `Register` exportada.

```ts
const router = createRouter({
  // ...
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
```

Ao registrar seu router com o módulo, você agora pode usar os hooks, components e utilitários exportados com os tipos exatos do seu router.

## Corrigindo o Problema de Context do Component

O context de component é uma ferramenta maravilhosa no React e outros frameworks para fornecer dependências aos components. No entanto, se esse context está mudando de tipos conforme se move pela hierarquia de components, torna-se impossível para o TypeScript saber como inferir essas mudanças. Para contornar isso, hooks e components baseados em context exigem que você dê a eles uma dica sobre como e onde estão sendo usados.

```tsx
export const Route = createFileRoute("/posts")({
  component: PostsComponent,
});

function PostsComponent() {
  // Each route has type-safe versions of most of the built-in hooks from TanStack Router
  const params = Route.useParams();
  const search = Route.useSearch();

  // Some hooks require context from the *entire* router, not just the current route. To achieve type-safety here,
  // we must pass the `from` param to tell the hook our relative position in the route hierarchy.
  const navigate = useNavigate({ from: Route.fullPath });
  // ... etc
}
```

Todo hook e component que requer uma dica de context terá um parâmetro `from` onde você pode passar o ID ou caminho da route dentro da qual está renderizando.

> 🧠 Dica rápida: Se seu component é dividido por código (code-split), você pode usar a [função getRouteApi](./code-splitting.md#manually-accessing-route-apis-in-other-files-with-the-getrouteapi-helper) para evitar ter que passar o `Route.fullPath` para obter acesso aos hooks tipados `useParams()` e `useSearch()`.

### E se eu não souber a route? E se for um component compartilhado?

A propriedade `from` é opcional, o que significa que se você não passá-la, você receberá a melhor estimativa do router sobre quais tipos estarão disponíveis. Normalmente, isso significa que você receberá uma union de todos os tipos de todas as routes no router.

### E se eu passar o caminho `from` errado?

É tecnicamente possível passar um `from` que satisfaça o TypeScript, mas que pode não corresponder à route real dentro da qual você está renderizando em tempo de execução. Neste caso, cada hook e component que suporta `from` detectará se suas expectativas não correspondem à route real dentro da qual você está renderizando, e lançará um erro em tempo de execução.

### E se eu não souber a route, ou for um component compartilhado, e não puder passar `from`?

Se você está renderizando um component que é compartilhado entre múltiplas routes, ou está renderizando um component que não está dentro de uma route, você pode passar `strict: false` em vez da opção `from`. Isso não apenas silenciará o erro em tempo de execução, mas também dará tipos relaxados, porém precisos, para o hook potencial que você está chamando. Um bom exemplo disso é chamar `useSearch` de um component compartilhado:

```tsx
function MyComponent() {
  const search = useSearch({ strict: false });
}
```

Neste caso, a variável `search` será tipada como uma union de todos os possíveis search params de todas as routes no router.

## Router Context

O router context é extremamente útil, pois é a injeção de dependência hierárquica definitiva. Você pode fornecer context ao router e a cada route que ele renderiza. Conforme você constrói esse context, o TanStack Router irá mesclá-lo na hierarquia de routes, de modo que cada route tenha acesso ao context de todos os seus pais.

A factory `createRootRouteWithContext` cria um novo router com o tipo instanciado, o que então cria um requisito para você cumprir o mesmo contrato de tipo no seu router, e também garantirá que seu context seja devidamente tipado por toda a árvore de routes.

```tsx
const rootRoute = createRootRouteWithContext<{ whateverYouWant: true }>()({
  component: App,
});

const routeTree = rootRoute.addChildren([
  // ... all child routes will have access to `whateverYouWant` in their context
]);

const router = createRouter({
  routeTree,
  context: {
    // This will be required to be passed now
    whateverYouWant: true,
  },
});
```

## Recomendações de Performance

Conforme sua aplicação escala, os tempos de verificação do TypeScript naturalmente aumentarão. Há algumas coisas para ter em mente quando sua aplicação escala para manter os tempos de verificação do TS baixos.

### Infira apenas os tipos que você precisa

Um ótimo padrão com caches de dados do lado do cliente (TanStack Query, etc.) é pré-carregar dados. Por exemplo, com o TanStack Query você pode ter uma route que chama `queryClient.ensureQueryData` em um `loader`.

```tsx
export const Route = createFileRoute("/posts/$postId/deep")({
  loader: ({ context: { queryClient }, params: { postId } }) =>
    queryClient.ensureQueryData(postQueryOptions(postId)),
  component: PostDeepComponent,
});

function PostDeepComponent() {
  const params = Route.useParams();
  const data = useSuspenseQuery(postQueryOptions(params.postId));

  return <></>;
}
```

Isso pode parecer correto e para árvores de routes pequenas você pode não notar problemas de performance do TS. No entanto, neste caso o TS tem que inferir o tipo de retorno do loader, apesar de nunca ser usado na sua route. Se os dados do loader são um tipo complexo com muitas routes que fazem prefetch dessa maneira, isso pode desacelerar a performance do editor. Neste caso, a mudança é bastante simples: deixe o TypeScript inferir `Promise<void>`.

```tsx
export const Route = createFileRoute("/posts/$postId/deep")({
  loader: async ({ context: { queryClient }, params: { postId } }) => {
    await queryClient.ensureQueryData(postQueryOptions(postId));
  },
  component: PostDeepComponent,
});

function PostDeepComponent() {
  const params = Route.useParams();
  const data = useSuspenseQuery(postQueryOptions(params.postId));

  return <></>;
}
```

Dessa forma, os dados do loader nunca são inferidos e a inferência é movida para fora da árvore de routes para a primeira vez que você usa `useSuspenseQuery`.

### Restrinja às routes relevantes o máximo possível

Considere o seguinte uso de `Link`

```tsx
<Link to=".." search={{ page: 0 }} />
<Link to="." search={{ page: 0 }} />
```

**Esses exemplos são ruins para a performance do TS**. Isso porque `search` resolve para uma union de todos os `search` params de todas as routes e o TS tem que verificar o que você passa para a prop `search` contra essa union potencialmente grande. Conforme sua aplicação cresce, esse tempo de verificação aumentará linearmente com o número de routes e search params. Fizemos o nosso melhor para otimizar esse caso (o TypeScript tipicamente faz esse trabalho uma vez e o armazena em cache), mas a verificação inicial contra essa union grande é custosa. Isso também se aplica a `params` e outras APIs como `useSearch`, `useParams`, `useNavigate` etc.

Em vez disso, você deveria tentar restringir às routes relevantes com `from` ou `to`.

```tsx
<Link from={Route.fullPath} to=".." search={{page: 0}} />
<Link from="/posts" to=".." search={{page: 0}} />
```

Lembre-se de que você sempre pode passar uma union para `to` ou `from` para restringir as routes de seu interesse.

```tsx
const from: '/posts/$postId/deep' | '/posts/' = '/posts/'
<Link from={from} to='..' />
```

Você também pode passar branches para `from` para resolver `search` ou `params` apenas dos descendentes daquele branch:

```tsx
const from = '/posts'
<Link from={from} to='..' />
```

`/posts` poderia ser um branch com muitos descendentes que compartilham os mesmos `search` ou `params`

### Considere usar a sintaxe de objeto do `addChildren`

É típico que routes tenham `params`, `search`, `loaders` ou `context` que podem até referenciar dependências externas que também são pesadas na inferência do TS. Para tais aplicações, usar objetos para criar a árvore de routes pode ser mais performático do que tuplas.

`createChildren` também pode aceitar um objeto. Para árvores de routes grandes com routes complexas e bibliotecas externas, objetos podem ser muito mais rápidos para o TS verificar tipos em comparação com tuplas grandes. Os ganhos de performance dependem do seu projeto, quais dependências externas você tem e como os tipos dessas bibliotecas são escritos

```tsx
const routeTree = rootRoute.addChildren({
  postsRoute: postsRoute.addChildren({ postRoute, postsIndexRoute }),
  indexRoute,
});
```

Note que essa sintaxe é mais verbosa, mas tem melhor performance no TS. Com roteamento baseado em arquivo, a árvore de routes é gerada para você, então uma árvore de routes verbosa não é uma preocupação

### Evite tipos internos sem restringir

É comum querer reutilizar tipos expostos. Por exemplo, você pode ficar tentado a usar `LinkProps` assim

```tsx
const props: LinkProps = {
  to: '/posts/',
}

return (
  <Link {...props}>
)
```

**Isso é MUITO ruim para a performance do TS**. O problema aqui é que `LinkProps` não tem argumentos de tipo e é, portanto, um tipo extremamente grande. Ele inclui `search` que é uma union de todos os `search` params, contém `params` que é uma union de todos os `params`. Ao mesclar esse objeto com `Link`, ele fará uma comparação estrutural desse tipo enorme.

Em vez disso, você pode usar `as const satisfies` para inferir um tipo preciso e não usar `LinkProps` diretamente para evitar a verificação enorme

```tsx
const props = {
  to: '/posts/',
} as const satisfies LinkProps

return (
  <Link {...props}>
)
```

Como `props` não é do tipo `LinkProps`, essa verificação é mais barata porque o tipo é muito mais preciso. Você também pode melhorar a verificação de tipos ainda mais restringindo `LinkProps`

```tsx
const props = {
  to: '/posts/',
} as const satisfies LinkProps<RegisteredRouter, string '/posts/'>

return (
  <Link {...props}>
)
```

Isso é ainda mais rápido, pois estamos verificando contra o tipo `LinkProps` restringido.

Você também pode usar isso para restringir o tipo de `LinkProps` a um tipo específico para ser usado como prop ou parâmetro de uma função

```tsx
export const myLinkProps = [
  {
    to: "/posts",
  },
  {
    to: "/posts/$postId",
    params: { postId: "postId" },
  },
] as const satisfies ReadonlyArray<LinkProps>;

export type MyLinkProps = (typeof myLinkProps)[number];

const MyComponent = (props: { linkProps: MyLinkProps }) => {
  return <Link {...props.linkProps} />;
};
```

Isso é mais rápido do que usar `LinkProps` diretamente em um component porque `MyLinkProps` é um tipo muito mais preciso

Outra solução é não usar `LinkProps` e fornecer inversão de controle para renderizar um component `Link` restringido a uma route específica. Render props são um bom método de inverter o controle para o usuário de um component

```tsx
export interface MyComponentProps {
  readonly renderLink: () => React.ReactNode;
}

const MyComponent = (props: MyComponentProps) => {
  return <div>{props.renderLink()}</div>;
};

const Page = () => {
  return <MyComponent renderLink={() => <Link to="/absolute" />} />;
};
```

Esse exemplo em particular é muito rápido, pois invertemos o controle de para onde estamos navegando para o usuário do component. O `Link` é restringido à route exata para a qual queremos navegar
