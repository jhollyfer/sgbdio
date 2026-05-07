---
title: Decisions on Developer Experience
---

Quando as pessoas começam a usar o TanStack Router, elas geralmente têm muitas perguntas que giram em torno dos seguintes temas:

> Por que eu tenho que fazer as coisas desse jeito?

> Por que é feito desse jeito? e não daquele?

> Eu estou acostumado a fazer desse jeito, por que eu deveria mudar?

E são todas perguntas válidas. Na maioria das vezes, as pessoas estão acostumadas a usar bibliotecas de routing que são muito semelhantes entre si. Todas têm uma API similar, conceitos similares e maneiras similares de fazer as coisas.

Mas o TanStack Router é diferente. Ele não é sua biblioteca de routing comum. Não é sua biblioteca de gerenciamento de state comum. Não é nada comum.

## A história de origem do TanStack Router

É importante lembrar que as origens do TanStack Router vêm da necessidade do [Nozzle.io](https://nozzle.io) por uma solução de routing do lado do cliente que oferecesse uma experiência de primeira classe com _URL Search Parameters_ sem comprometer a **_segurança de tipo_** necessária para alimentar seus dashboards complexos.

E assim, desde a sua concepção, cada faceta do design do TanStack Router foi meticulosamente pensada para garantir que sua segurança de tipo e experiência de desenvolvedor fossem incomparáveis.

## Como o TanStack Router consegue isso?

> TypeScript! TypeScript! TypeScript!

Cada aspecto do TanStack Router é projetado para ser o mais type-safe possível, e isso é alcançado aproveitando o sistema de tipos do TypeScript ao máximo. Isso envolve o uso de alguns tipos muito avançados e complexos, inferência de tipo e outros recursos para garantir que a experiência do desenvolvedor seja a mais suave possível.

Mas para alcançar isso, tivemos que tomar algumas decisões que desviam das normas no mundo do routing.

1. [**Boilerplate de configuração de route?**](#why-is-the-routers-configuration-done-this-way): Você precisa definir seus routes de uma maneira que permita ao TypeScript inferir os tipos dos seus routes o máximo possível.
2. [**Declaração de módulo TypeScript para o router?**](#declaring-the-router-instance-for-type-inference): Você precisa passar a instância do `Router` para o resto da sua aplicação usando a declaração de módulo do TypeScript.
3. [**Por que incentivar routing baseado em arquivo ao invés de baseado em código?**](#why-is-file-based-routing-the-preferred-way-to-define-routes): Incentivamos o routing baseado em arquivo como a maneira preferida de definir seus routes.

> TLDR; Todas as decisões de design na experiência de desenvolvedor ao usar o TanStack Router são feitas para que você tenha uma experiência de segurança de tipo de primeira classe sem comprometer o controle, a flexibilidade e a manutenibilidade das suas configurações de route.

## Por que a configuração do Router é feita dessa maneira?

Quando você quer aproveitar os recursos de inferência do TypeScript ao máximo, rapidamente perceberá que _Generics_ são seu melhor amigo. E então, o TanStack Router usa Generics em todo lugar para garantir que os tipos dos seus routes sejam inferidos o máximo possível.

Isso significa que você precisa definir seus routes de uma maneira que permita ao TypeScript inferir os tipos dos seus routes o máximo possível.

> Posso usar JSX para definir meus routes?

Usar JSX para definir seus routes está **fora de questão**, pois o TypeScript não será capaz de inferir os tipos de configuração de route do seu router.

```tsx
// ⛔️ This is not possible
function App() {
  return (
    <Router>
      <Route path="/posts" component={PostsPage} />
      <Route path="/posts/$postId" component={PostIdPage} />
      {/* ... */}
    </Router>
    // ^? TypeScript cannot infer the routes in this configuration
  );
}
```

E como isso significaria que você teria que tipar manualmente a prop `to` do component `<Link>` e não detectaria nenhum erro até o tempo de execução, não é uma opção viável.

> Talvez eu pudesse definir meus routes como uma árvore de objetos aninhados?

```tsx
// ⛔️ This file will just keep growing and growing...
const router = createRouter({
  routes: {
    posts: {
      component: PostsPage, // /posts
      children: {
        $postId: {
          component: PostIdPage, // /posts/$postId
        },
      },
    },
    // ...
  },
});
```

À primeira vista, isso parece uma boa ideia. É fácil visualizar toda a hierarquia de routes de uma só vez. Mas essa abordagem tem algumas desvantagens grandes que a tornam não ideal para aplicações grandes:

- **Não é muito escalável**: Conforme sua aplicação cresce, a árvore crescerá e ficará mais difícil de gerenciar. E como tudo é definido em um único arquivo, pode ficar muito difícil de manter.
- **Não é ótimo para code splitting**: Você teria que fazer code splitting manualmente de cada component e depois passá-lo para a propriedade `component` do route, complicando ainda mais a configuração de route com um arquivo de configuração cada vez maior.

Isso só piora conforme você começa a usar mais recursos do router, como context aninhado, loaders, validação de search param, etc.

> Então, qual é a melhor maneira de definir meus routes?

O que descobrimos ser a melhor maneira de definir seus routes é abstrair a definição da configuração de route para fora da árvore de routes. Depois, costurar as configurações de route em uma única árvore de routes coesa que é então passada para a função `createRouter`.

Você pode ler mais sobre [routing baseado em código](./routing/code-based-routing.md) para ver como definir seus routes dessa maneira.

> [!TIP]
> Achando o routing baseado em código um pouco trabalhoso demais? Veja por que o [routing baseado em arquivo](#why-is-file-based-routing-the-preferred-way-to-define-routes) é a maneira preferida de definir seus routes.

## Declarando a instância do Router para inferência de tipo

> Por que eu tenho que declarar o `Router`?

> Esse negócio de declaração é complicado demais para mim...

Uma vez que você construiu seus routes em uma árvore e os passou para sua instância do Router (usando `createRouter`) com todos os generics funcionando corretamente, você então precisa de alguma forma passar essa informação para o resto da sua aplicação.

Havia duas abordagens que consideramos para isso:

1. **Imports**: Você poderia importar a instância do `Router` do arquivo onde a criou e usá-la diretamente nos seus components.

```tsx
import { router } from "@/src/app";
export const PostsIdLink = () => {
  return (
    <Link<typeof router> to="/posts/$postId" params={{ postId: "123" }}>
      Go to post 123
    </Link>
  );
};
```

Uma desvantagem dessa abordagem é que você teria que importar toda a instância do `Router` em cada arquivo onde quisesse usá-la. Isso pode levar a tamanhos de bundle maiores e pode ser trabalhoso de gerenciar, e só piora conforme sua aplicação cresce e você usa mais recursos do router.

2. **Declaração de módulo**: Você pode usar a declaração de módulo do TypeScript para declarar a instância do `Router` como um módulo que pode ser usado para inferência de tipo em qualquer lugar da sua aplicação sem precisar importá-la.

Você fará isso uma vez na sua aplicação.

```tsx
// src/app.tsx
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
```

E então você pode se beneficiar do auto-complete em qualquer lugar da sua aplicação sem precisar importá-la.

```tsx
export const PostsIdLink = () => {
  return (
    <Link
      to="/posts/$postId"
      // ^? TypeScript will auto-complete this for you
      params={{ postId: "123" }} // and this too!
    >
      Go to post 123
    </Link>
  );
};
```

Optamos pela **declaração de módulo**, pois é o que descobrimos ser a abordagem mais escalável e manutenível com a menor quantidade de overhead e boilerplate.

## Por que o routing baseado em arquivo é a maneira preferida de definir routes?

> Por que a documentação insiste no routing baseado em arquivo?

> Estou acostumado a definir meus routes em um único arquivo, por que eu deveria mudar?

Algo que você vai notar (bem cedo) na documentação do TanStack Router é que incentivamos o **routing baseado em arquivo** como o método preferido para definir seus routes. Isso porque descobrimos que o routing baseado em arquivo é a maneira mais escalável e manutenível de definir seus routes.

> [!TIP]
> Antes de continuar, é importante que você tenha um bom entendimento do [routing baseado em código](./routing/code-based-routing.md) e do [routing baseado em arquivo](./routing/file-based-routing.md).

Como mencionado no início, o TanStack Router foi projetado para aplicações complexas que exigem um alto grau de segurança de tipo e manutenibilidade. E para alcançar isso, a configuração do router foi feita de uma maneira precisa que permite ao TypeScript inferir os tipos dos seus routes o máximo possível.

Uma diferença chave na configuração de uma aplicação _básica_ com o TanStack Router é que suas configurações de route requerem que uma função seja fornecida para `getParentRoute`, que retorna o route pai do route atual.

```tsx
import { createRoute } from "@tanstack/react-router";
import { postsRoute } from "./postsRoute";

export const postsIndexRoute = createRoute({
  getParentRoute: () => postsRoute,
  path: "/",
});
```

Neste estágio, isso é feito para que a definição de `postsIndexRoute` possa estar ciente da sua localização na árvore de routes e para que possa inferir corretamente os tipos do `context`, `path params`, `search params` retornados pelo route pai. Definir incorretamente a função `getParentRoute` significa que as propriedades do route pai não serão corretamente inferidas pelo route filho.

Como tal, essa é uma parte crítica da configuração de route e um ponto de falha se não for feita corretamente.

Mas essa é apenas uma parte da configuração de uma aplicação básica. O TanStack Router requer que todos os routes (incluindo o root route) sejam costurados em uma **_árvore de routes_** para que possa ser passada para a função `createRouter` antes de declarar a instância do `Router` no módulo para inferência de tipo. Essa é outra parte crítica da configuração de route e um ponto de falha se não for feita corretamente.

> Se essa árvore de routes estivesse em seu próprio arquivo para uma aplicação com ~40-50 routes, ela pode facilmente crescer para mais de 700 linhas.

```tsx
const routeTree = rootRoute.addChildren([
  postsRoute.addChildren([postsIndexRoute, postsIdRoute]),
]);
```

Essa complexidade só aumenta conforme você começa a usar mais recursos do router, como context aninhado, loaders, validação de search param, etc. Assim, não é mais viável definir seus routes em um único arquivo. E então, os usuários acabam criando sua própria maneira _semi consistente_ de definir seus routes em múltiplos arquivos. Isso pode levar a inconsistências e erros na configuração de route.

Por fim, vem a questão do code splitting. Conforme sua aplicação cresce, você vai querer fazer code splitting dos seus components para reduzir o tamanho inicial do bundle da sua aplicação. Isso pode ser um pouco trabalhoso de gerenciar quando você está definindo seus routes em um único arquivo ou mesmo em múltiplos arquivos.

```tsx
import { createRoute, lazyRouteComponent } from "@tanstack/react-router";
import { postsRoute } from "./postsRoute";

export const postsIndexRoute = createRoute({
  getParentRoute: () => postsRoute,
  path: "/",
  component: lazyRouteComponent(() => import("../page-components/posts/index")),
});
```

Todo esse boilerplate, não importa quão essencial para fornecer uma experiência de inferência de tipo de primeira classe, pode ser um pouco esmagador e pode levar a inconsistências e erros na configuração de route.

... e essa configuração de exemplo é apenas para renderizar um único route com code splitting. Imagine ter que fazer isso para 40-50 routes. Agora lembre-se que você ainda nem tocou no `context`, `loaders`, `validação de search param` e outros recursos do router.

> Então, por que o routing baseado em arquivo é a maneira preferida?

O routing baseado em arquivo do TanStack Router é projetado para resolver todos esses problemas. Ele permite que você defina seus routes de uma maneira previsível que é fácil de gerenciar e manter, e é escalável conforme sua aplicação cresce.

A abordagem de routing baseado em arquivo é alimentada pelo TanStack Router Bundler Plugin. Ele realiza 3 tarefas essenciais que resolvem os pontos de dor na configuração de route ao usar routing baseado em código:

1. **Boilerplate de configuração de route**: Ele gera o boilerplate para suas configurações de route.
2. **Costura da árvore de routes**: Ele costura as configurações de route em uma única árvore de routes coesa. Também nos bastidores, ele atualiza corretamente as configurações de route para definir a função `getParentRoute` associando os routes com seus routes pais.
3. **Code splitting**: Ele automaticamente faz code splitting dos seus components de conteúdo de route e atualiza as configurações de route com o component correto. Adicionalmente, em tempo de execução, ele garante que o component correto seja carregado quando o route é visitado.

Vamos dar uma olhada em como a configuração de route do exemplo anterior ficaria com routing baseado em arquivo.

```tsx
// src/routes/posts/index.ts
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/posts/")({
  component: () => "Posts index component goes here!!!",
});
```

É isso! Sem necessidade de se preocupar em definir a função `getParentRoute`, costurar a árvore de routes ou fazer code splitting dos seus components. O TanStack Router Bundler Plugin cuida de tudo isso para você.

Em nenhum momento o TanStack Router Bundler Plugin tira seu controle sobre suas configurações de route. Ele é projetado para ser o mais flexível possível, permitindo que você defina seus routes de uma maneira que se adeque à sua aplicação enquanto reduz o boilerplate e a complexidade da configuração de route.

Confira os guias de [routing baseado em arquivo](./routing/file-based-routing.md) e [code splitting](./guide/code-splitting.md) para uma explicação mais aprofundada de como eles funcionam no TanStack Router.
