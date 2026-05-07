---
id: scroll-restoration
title: Scroll Restoration
---

## Rolagem por Hash/Topo da Página

Por padrão, o TanStack Router suporta tanto **rolagem por hash** quanto **rolagem para o topo da página** sem nenhuma configuração adicional.

## Rolagem para o Topo e Áreas Roláveis Aninhadas

Por padrão, a rolagem para o topo imita o comportamento do navegador, o que significa que apenas a própria `window` é rolada para o topo após uma navegação bem-sucedida. Para muitos apps, no entanto, é comum que a área rolável principal seja uma div aninhada ou similar por causa de layouts avançados. Se você quiser que o TanStack Router também role essas áreas roláveis principais para você, pode adicionar seletores para direcioná-las usando `routerOptions.scrollToTopSelectors`:

```tsx
const router = createRouter({
  scrollToTopSelectors: ["#main-scrollable-area"],
});
```

Para seletores complexos que não podem ser simplesmente resolvidos usando `document.querySelector(selector)`, você pode passar funções que retornam elementos HTML para `routerOptions.scrollToTopSelectors`:

```tsx
const selector = () =>
  document
    .querySelector("#shadowRootParent")
    ?.shadowRoot?.querySelector("#main-scrollable-area");

const router = createRouter({
  scrollToTopSelectors: [selector],
});
```

Esses seletores são tratados **além da `window`**, que não pode ser desativada atualmente.

## Scroll Restoration

Scroll restoration é o processo de restaurar a posição de rolagem de uma página quando o usuário navega de volta para ela. Isso normalmente é um recurso nativo para sites HTML padrão, mas pode ser difícil de replicar para aplicações SPA porque:

- SPAs tipicamente usam a API `history.pushState` para navegação, então o navegador não sabe restaurar a posição de rolagem nativamente
- SPAs às vezes renderizam conteúdo de forma assíncrona, então o navegador não sabe a altura da página até que ela seja renderizada
- SPAs podem às vezes usar containers roláveis aninhados para forçar layouts e recursos específicos.

Além disso, é muito comum que aplicações tenham múltiplas áreas roláveis dentro de um app, não apenas o body. Por exemplo, uma aplicação de chat pode ter uma barra lateral rolável e uma área de chat rolável. Nesse caso, você gostaria de restaurar a posição de rolagem de ambas as áreas independentemente.

Para aliviar esse problema, o TanStack Router fornece um component e hook de scroll restoration que cuidam do processo de monitorar, armazenar em cache e restaurar posições de rolagem para você.

Ele faz isso ao:

- Monitorar o DOM por eventos de rolagem
- Registrar áreas roláveis no cache de scroll restoration
- Escutar os eventos apropriados do router para saber quando armazenar em cache e restaurar posições de rolagem
- Armazenar posições de rolagem para cada área rolável no cache (incluindo `window` e `body`)
- Restaurar posições de rolagem após navegações bem-sucedidas antes da pintura do DOM

Pode parecer muita coisa, mas para você é tão simples quanto:

```tsx
import { createRouter } from "@tanstack/react-router";

const router = createRouter({
  scrollRestoration: true,
});
```

> [!NOTE]
> O component `<ScrollRestoration />` ainda funciona, mas está depreciado.

## Chaves de Cache Personalizadas

Seguindo a mesma linha das APIs de Scroll Restoration do Remix, você também pode personalizar a chave usada para armazenar em cache as posições de rolagem para uma determinada área rolável usando a opção `getKey`. Isso poderia ser usado, por exemplo, para forçar a mesma posição de rolagem a ser usada independentemente do histórico do navegador do usuário.

A opção `getKey` recebe o state `Location` relevante do TanStack Router e espera que você retorne uma string para identificar de forma única as medições de rolagem para aquele state.

O `getKey` padrão é `(location) => location.state.__TSR_key!`, onde `__TSR_key` é a chave única gerada para cada entrada no histórico.

> Versões anteriores, anteriores à `v1.121.34`, usavam `state.key` como a chave padrão, mas isso foi depreciado em favor de `state.__TSR_key`. Por enquanto, `location.state.key` ainda estará disponível para compatibilidade, mas será removido na próxima versão major.

## Exemplos

Você poderia sincronizar a rolagem com o pathname:

```tsx
import { createRouter } from "@tanstack/react-router";

const router = createRouter({
  getScrollRestorationKey: (location) => location.pathname,
});
```

Você pode sincronizar condicionalmente apenas alguns caminhos, e usar a chave para o restante:

```tsx
import { createRouter } from "@tanstack/react-router";

const router = createRouter({
  getScrollRestorationKey: (location) => {
    const paths = ["/", "/chat"];
    return paths.includes(location.pathname)
      ? location.pathname
      : location.state.__TSR_key!;
  },
});
```

## Prevenindo Scroll Restoration

Às vezes você pode querer impedir que a scroll restoration aconteça. Para isso, você pode utilizar a opção `resetScroll` disponível nas seguintes APIs:

- `<Link resetScroll={false}>`
- `navigate({ resetScroll: false })`
- `redirect({ resetScroll: false })`

Quando `resetScroll` é definido como `false`, a posição de rolagem para a próxima navegação não será restaurada (se estiver navegando para um evento de histórico existente na pilha) nem resetada para o topo (se for um novo evento de histórico na pilha).

## Scroll Restoration Manual

Na maioria das vezes, você não precisará fazer nada especial para que a scroll restoration funcione. No entanto, existem alguns casos em que você pode precisar controlar manualmente a scroll restoration. O exemplo mais comum são **listas virtualizadas**.

Para controlar manualmente a scroll restoration para listas virtualizadas dentro de toda a janela do navegador:

[//]: # "VirtualizedWindowScrollRestorationExample"

```tsx
function Component() {
  const scrollEntry = useElementScrollRestoration({
    getElement: () => window,
  })

  // Let's use TanStack Virtual to virtualize some content!
  const virtualizer = useWindowVirtualizer({
    count: 10000,
    estimateSize: () => 100,
    // We pass the scrollY from the scroll restoration entry to the virtualizer
    // as the initial offset
    initialOffset: scrollEntry?.scrollY,
  })

  return (
    <div>
      {virtualizer.getVirtualItems().map(item => (
        ...
      ))}
    </div>
  )
}
```

[//]: # "VirtualizedWindowScrollRestorationExample"

Para controlar manualmente a scroll restoration para um elemento específico, você pode usar o hook `useElementScrollRestoration` e o atributo DOM `data-scroll-restoration-id`:

[//]: # "ManualRestorationExample"

```tsx
function Component() {
  // We need a unique ID for manual scroll restoration on a specific element
  // It should be as unique as possible for this element across your app
  const scrollRestorationId = "myVirtualizedContent";

  // We use that ID to get the scroll entry for this element
  const scrollEntry = useElementScrollRestoration({
    id: scrollRestorationId,
  });

  // Let's use TanStack Virtual to virtualize some content!
  const virtualizerParentRef = React.useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: 10000,
    getScrollElement: () => virtualizerParentRef.current,
    estimateSize: () => 100,
    // We pass the scrollY from the scroll restoration entry to the virtualizer
    // as the initial offset
    initialOffset: scrollEntry?.scrollY,
  });

  return (
    <div
      ref={virtualizerParentRef}
      // We pass the scroll restoration ID to the element
      // as a custom attribute that will get picked up by the
      // scroll restoration watcher
      data-scroll-restoration-id={scrollRestorationId}
      className="flex-1 border rounded-lg overflow-auto relative"
    >
      ...
    </div>
  );
}
```

[//]: # "ManualRestorationExample"

## Comportamento de Rolagem

Para controlar o comportamento de rolagem ao navegar entre páginas, você pode usar a opção `scrollRestorationBehavior`. Isso permite que você torne a transição entre páginas instantânea em vez de uma rolagem suave. A configuração global do comportamento de scroll restoration tem as mesmas opções suportadas pelo navegador, que são `smooth`, `instant` e `auto` (veja [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView#behavior) para mais informações).

```tsx
import { createRouter } from "@tanstack/react-router";

const router = createRouter({
  scrollRestorationBehavior: "instant",
});
```
