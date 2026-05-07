---
title: Navigation Blocking
---

O bloqueio de navegação é uma forma de impedir que a navegação aconteça. Isso é típico quando um usuário tenta navegar enquanto:

- Tem alterações não salvas
- Está no meio de um formulário
- Está no meio de um pagamento

Nessas situações, um prompt ou UI personalizada deve ser exibida ao usuário para confirmar que ele deseja sair.

- Se o usuário confirmar, a navegação continuará normalmente
- Se o usuário cancelar, todas as navegações pendentes serão bloqueadas

## Como funciona o bloqueio de navegação?

O bloqueio de navegação adiciona uma ou mais camadas de "bloqueadores" a toda a API de histórico subjacente. Se algum bloqueador estiver presente, a navegação será pausada através de uma das seguintes formas:

- UI personalizada
  - Se a navegação é acionada por algo que controlamos no nível do router, podemos permitir que você execute qualquer tarefa ou mostre qualquer UI que desejar ao usuário para confirmar a ação. A função `blocker` de cada bloqueador será executada de forma assíncrona e sequencial. Se qualquer função bloqueadora resolver ou retornar `true`, a navegação será permitida e todos os outros bloqueadores continuarão fazendo o mesmo até que todos tenham sido autorizados a prosseguir. Se qualquer bloqueador individual resolver ou retornar `false`, a navegação será cancelada e o restante das funções `blocker` será ignorado.
- O evento `onbeforeunload`
  - Para eventos de página que não podemos controlar diretamente, dependemos do evento `onbeforeunload` do navegador. Se o usuário tentar fechar a aba ou janela, atualizar, ou "descarregar" os recursos da página de qualquer forma, o diálogo genérico "Tem certeza de que deseja sair?" do navegador será exibido. Se o usuário confirmar, todos os bloqueadores serão ignorados e a página será descarregada. Se o usuário cancelar, o descarregamento será cancelado e a página permanecerá como está.

## Como eu uso o bloqueio de navegação?

Existem 2 formas de usar o bloqueio de navegação:

- Bloqueio baseado em hook/lógica
- Bloqueio baseado em component

## Bloqueio baseado em hook/lógica

Vamos imaginar que queremos impedir a navegação se um formulário estiver sujo. Podemos fazer isso usando o hook `useBlocker`:

[//]: # "HookBasedBlockingExample"

```tsx
import { useBlocker } from "@tanstack/react-router";

function MyComponent() {
  const [formIsDirty, setFormIsDirty] = useState(false);

  useBlocker({
    shouldBlockFn: () => {
      if (!formIsDirty) return false;

      const shouldLeave = confirm("Are you sure you want to leave?");
      return !shouldLeave;
    },
  });

  // ...
}
```

[//]: # "HookBasedBlockingExample"

`shouldBlockFn` dá acesso type-safe à localização `current` e `next`:

```tsx
import { useBlocker } from "@tanstack/react-router";

function MyComponent() {
  // always block going from /foo to /bar/123?hello=world
  const { proceed, reset, status } = useBlocker({
    shouldBlockFn: ({ current, next }) => {
      return (
        current.routeId === "/foo" &&
        next.fullPath === "/bar/$id" &&
        next.params.id === 123 &&
        next.search.hello === "world"
      );
    },
    withResolver: true,
  });

  // ...
}
```

Note que mesmo se `shouldBlockFn` retornar `false`, o evento `beforeunload` do navegador ainda pode ser acionado em recarregamentos de página ou fechamento de aba. Para ter controle sobre isso, você pode usar a opção `enableBeforeUnload` para registrar condicionalmente o handler de `beforeunload`:

[//]: # "HookBasedBlockingExample"

```tsx
import { useBlocker } from '@tanstack/react-router'

function MyComponent() {
  const [formIsDirty, setFormIsDirty] = useState(false)

  useBlocker({
    {/* ... */}
    enableBeforeUnload: formIsDirty, // or () => formIsDirty
  })

  // ...
}
```

Você pode encontrar mais informações sobre o hook `useBlocker` na [referência da API](../api/router/useBlockerHook.md).

## Bloqueio baseado em component

Além do bloqueio baseado em lógica/hook, você pode usar o component `Block` para alcançar resultados similares:

[//]: # "ComponentBasedBlockingExample"

```tsx
import { Block } from "@tanstack/react-router";

function MyComponent() {
  const [formIsDirty, setFormIsDirty] = useState(false);

  return (
    <Block
      shouldBlockFn={() => {
        if (!formIsDirty) return false;

        const shouldLeave = confirm("Are you sure you want to leave?");
        return !shouldLeave;
      }}
      enableBeforeUnload={formIsDirty}
    />
  );

  // OU

  return (
    <Block
      shouldBlockFn={() => formIsDirty}
      enableBeforeUnload={formIsDirty}
      withResolver
    >
      {({ status, proceed, reset }) => <>{/* ... */}</>}
    </Block>
  );
}
```

[//]: # "ComponentBasedBlockingExample"

## Como posso mostrar uma UI personalizada?

Na maioria dos casos, usar `window.confirm` na função `shouldBlockFn` com `withResolver: false` no hook é suficiente, pois mostrará claramente ao usuário que a navegação está sendo bloqueada e resolverá o bloqueio baseado na resposta dele.

No entanto, em algumas situações, você pode querer mostrar uma UI personalizada que seja intencionalmente menos intrusiva e mais integrada com o design do seu aplicativo.

**Nota:** O valor de retorno de `shouldBlockFn` não resolve o bloqueio se `withResolver` for `true`.

### UI personalizada baseada em hook/lógica com resolver

[//]: # "HookBasedCustomUIBlockingWithResolverExample"

```tsx
import { useBlocker } from '@tanstack/react-router'

function MyComponent() {
  const [formIsDirty, setFormIsDirty] = useState(false)

  const { proceed, reset, status } = useBlocker({
    shouldBlockFn: () => formIsDirty,
    withResolver: true,
  })

  // ...

  return (
    <>
      {/* ... */}
      {status === 'blocked' && (
        <div>
          <p>Are you sure you want to leave?</p>
          <button onClick={proceed}>Yes</button>
          <button onClick={reset}>No</button>
        </div>
      )}
    </>
}
```

[//]: # "HookBasedCustomUIBlockingWithResolverExample"

### UI personalizada baseada em hook/lógica sem resolver

[//]: # "HookBasedCustomUIBlockingWithoutResolverExample"

```tsx
import { useBlocker } from "@tanstack/react-router";

function MyComponent() {
  const [formIsDirty, setFormIsDirty] = useState(false);

  useBlocker({
    shouldBlockFn: () => {
      if (!formIsDirty) {
        return false;
      }

      const shouldBlock = new Promise<boolean>((resolve) => {
        // Using a modal manager of your choice
        modals.open({
          title: "Are you sure you want to leave?",
          children: (
            <SaveBlocker
              confirm={() => {
                modals.closeAll();
                resolve(false);
              }}
              reject={() => {
                modals.closeAll();
                resolve(true);
              }}
            />
          ),
          onClose: () => resolve(true),
        });
      });
      return shouldBlock;
    },
  });

  // ...
}
```

[//]: # "HookBasedCustomUIBlockingWithoutResolverExample"

### UI personalizada baseada em component

Similarmente ao hook, o component `Block` retorna o mesmo state e funções como render props:

[//]: # "ComponentBasedCustomUIBlockingExample"

```tsx
import { Block } from "@tanstack/react-router";

function MyComponent() {
  const [formIsDirty, setFormIsDirty] = useState(false);

  return (
    <Block shouldBlockFn={() => formIsDirty} withResolver>
      {({ status, proceed, reset }) => (
        <>
          {/* ... */}
          {status === "blocked" && (
            <div>
              <p>Are you sure you want to leave?</p>
              <button onClick={proceed}>Yes</button>
              <button onClick={reset}>No</button>
            </div>
          )}
        </>
      )}
    </Block>
  );
}
```

[//]: # "ComponentBasedCustomUIBlockingExample"
