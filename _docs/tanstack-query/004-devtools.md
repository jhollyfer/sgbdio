---
id: devtools
title: Devtools
---

Levante as maos e grite viva porque o React Query vem com devtools dedicadas! 🥳

Quando voce comecar sua jornada com React Query, voce vai querer essas devtools ao seu lado. Elas ajudam a visualizar todo o funcionamento interno do React Query e provavelmente vao te economizar horas de depuracao se voce se encontrar em uma situacao dificil!

> Para usuarios de Chrome, Firefox e Edge: extensoes de navegador de terceiros estao disponiveis para depurar o TanStack Query diretamente nas DevTools do navegador. Elas fornecem a mesma funcionalidade dos pacotes de devtools especificos de framework:
>
> - <img alt="Chrome logo" src="https://www.google.com/chrome/static/images/chrome-logo.svg" width="16" height="16" class="inline mr-1 not-prose" /> [Devtools para Chrome](https://chromewebstore.google.com/detail/tanstack-query-devtools/annajfchloimdhceglpgglpeepfghfai)
> - <img alt="Firefox logo" src="https://upload.wikimedia.org/wikipedia/commons/a/a0/Firefox_logo%2C_2019.svg" width="16" height="16" class="inline mr-1 not-prose" /> [Devtools para Firefox](https://addons.mozilla.org/en-US/firefox/addon/tanstack-query-devtools/)
> - <img alt="Edge logo" src="https://upload.wikimedia.org/wikipedia/commons/9/98/Microsoft_Edge_logo_%282019%29.svg" width="16" height="16" class="inline mr-1 not-prose" /> [Devtools para Edge](https://microsoftedge.microsoft.com/addons/detail/tanstack-query-devtools/edmdpkgkacmjopodhfolmphdenmddobj)

> Para usuarios de React Native: um aplicativo nativo de terceiros para macOS esta disponivel para depurar React Query em QUALQUER aplicacao baseada em js. Monitore queries entre dispositivos em tempo real. Confira aqui: [rn-better-dev-tools](https://github.com/LovesWorking/rn-better-dev-tools)

> Note que desde a versao 5, as devtools suportam a observacao de mutations tambem.

## Instalar e Importar as Devtools

As devtools sao um pacote separado que voce precisa instalar:

```bash
npm i @tanstack/react-query-devtools
```

ou

```bash
pnpm add @tanstack/react-query-devtools
```

ou

```bash
yarn add @tanstack/react-query-devtools
```

ou

```bash
bun add @tanstack/react-query-devtools
```

Para Next 13+ App Dir voce deve instala-lo como dependencia de desenvolvimento para que funcione.

Voce pode importar as devtools assim:

```tsx
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
```

Por padrao, as React Query Devtools so sao incluidas nos bundles quando `process.env.NODE_ENV === 'development'`, entao voce nao precisa se preocupar em exclui-las durante um build de producao.

## Modo Flutuante

O Modo Flutuante vai montar as devtools como um elemento fixo e flutuante na sua aplicacao e fornecer um botao no canto da tela para mostrar e esconder as devtools. Esse estado do botao sera armazenado e lembrado no localStorage entre recarregamentos.

Coloque o codigo a seguir o mais alto possivel na sua aplicacao React. Quanto mais proximo da raiz da pagina, melhor vai funcionar!

```tsx
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* The rest of your application */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

### Opcoes

- `initialIsOpen: boolean`
  - Defina como `true` se voce quiser que as devtools fiquem abertas por padrao
- `buttonPosition?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "relative"`
  - Padrao: `bottom-right`
  - A posicao do logo do React Query para abrir e fechar o painel das devtools
  - Se `relative`, o botao sera colocado no local onde voce renderizar as devtools.
- `position?: "top" | "bottom" | "left" | "right"`
  - Padrao: `bottom`
  - A posicao do painel das devtools do React Query
- `client?: QueryClient`,
  - Use isso para usar um QueryClient customizado. Caso contrario, o mais proximo do context sera usado.
- `errorTypes?: { name: string; initializer: (query: Query) => TError}[]`
  - Use isso para predefinir alguns erros que podem ser disparados nas suas queries. O initializer sera chamado (com a query especifica) quando aquele erro for ativado pela UI. Ele deve retornar um Error.
- `styleNonce?: string`
  - Use isso para passar um nonce para a tag style que e adicionada ao head do documento. Isso e util se voce esta usando um nonce de Content Security Policy (CSP) para permitir estilos inline.
- `shadowDOMTarget?: ShadowRoot`
  - O comportamento padrao vai aplicar os estilos das devtools na tag head dentro do DOM.
  - Use isso para passar um alvo de shadow DOM para as devtools para que os estilos sejam aplicados dentro do shadow DOM ao inves da tag head no light DOM.

## Modo Embutido

O modo embutido vai mostrar as ferramentas de desenvolvimento como um elemento fixo na sua aplicacao, para que voce possa usar nosso painel nas suas proprias ferramentas de desenvolvimento.

Coloque o codigo a seguir o mais alto possivel na sua aplicacao React. Quanto mais proximo da raiz da pagina, melhor vai funcionar!

```tsx
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";

function App() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      {/* The rest of your application */}
      <button
        onClick={() => setIsOpen(!isOpen)}
      >{`${isOpen ? "Close" : "Open"} the devtools panel`}</button>
      {isOpen && <ReactQueryDevtoolsPanel onClose={() => setIsOpen(false)} />}
    </QueryClientProvider>
  );
}
```

### Opcoes

- `style?: React.CSSProperties`
  - Estilos customizados para o painel das devtools
  - Padrao: `{ height: '500px' }`
  - Exemplo: `{ height: '100%' }`
  - Exemplo: `{ height: '100%', width: '100%' }`
- `onClose?: () => unknown`
  - Funcao de callback que e chamada quando o painel das devtools e fechado
- `client?: QueryClient`,
  - Use isso para usar um QueryClient customizado. Caso contrario, o mais proximo do context sera usado.
- `errorTypes?: { name: string; initializer: (query: Query) => TError}[]`
  - Use isso para predefinir alguns erros que podem ser disparados nas suas queries. O initializer sera chamado (com a query especifica) quando aquele erro for ativado pela UI. Ele deve retornar um Error.
- `styleNonce?: string`
  - Use isso para passar um nonce para a tag style que e adicionada ao head do documento. Isso e util se voce esta usando um nonce de Content Security Policy (CSP) nonce para permitir estilos inline.
- `shadowDOMTarget?: ShadowRoot`
  - O comportamento padrao vai aplicar os estilos das devtools na tag head dentro do DOM.
  - Use isso para passar um alvo de shadow DOM para as devtools para que os estilos sejam aplicados dentro do shadow DOM ao inves da tag head no light DOM.

## Devtools em producao

As devtools sao excluidas em builds de producao. No entanto, pode ser desejavel carregar as devtools de forma lazy em producao:

```tsx
import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Example } from "./Example";

const queryClient = new QueryClient();

const ReactQueryDevtoolsProduction = React.lazy(() =>
  import("@tanstack/react-query-devtools/build/modern/production.js").then(
    (d) => ({
      default: d.ReactQueryDevtools,
    }),
  ),
);

function App() {
  const [showDevtools, setShowDevtools] = React.useState(false);

  React.useEffect(() => {
    // @ts-expect-error
    window.toggleDevtools = () => setShowDevtools((old) => !old);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Example />
      <ReactQueryDevtools initialIsOpen />
      {showDevtools && (
        <React.Suspense fallback={null}>
          <ReactQueryDevtoolsProduction />
        </React.Suspense>
      )}
    </QueryClientProvider>
  );
}

export default App;
```

Com isso, chamar `window.toggleDevtools()` vai baixar o bundle das devtools e exibi-las.

### Bundlers modernos

Se o seu bundler suporta exportacoes de pacotes, voce pode usar o seguinte caminho de importacao:

```tsx
const ReactQueryDevtoolsProduction = React.lazy(() =>
  import("@tanstack/react-query-devtools/production").then((d) => ({
    default: d.ReactQueryDevtools,
  })),
);
```

Para TypeScript, voce precisaria definir `moduleResolution: 'nodenext'` no seu tsconfig, o que requer pelo menos TypeScript v4.7.
