---
id: type-utilities
title: Type Utilities
---

A maioria dos tipos expostos pelo TanStack Router são internos, sujeitos a mudanças que quebram compatibilidade e nem sempre fáceis de usar. Por isso, o TanStack Router possui um subconjunto de tipos expostos focados na facilidade de uso, com a intenção de serem usados externamente. Esses tipos fornecem a mesma experiência type-safe dos conceitos de runtime do TanStack Router no nível de tipos, com flexibilidade de onde fornecer verificação de tipos

## Verificação de tipos das opções de Link com `ValidateLinkOptions`

`ValidateLinkOptions` verifica tipos de objetos literais para garantir que estejam em conformidade com as opções do `Link` nos locais de inferência. Por exemplo, você pode ter um component genérico `HeadingLink` que aceita uma prop `title` junto com `linkOptions`, a ideia sendo que esse component pode ser reutilizado para qualquer navegação.

```tsx
export interface HeaderLinkProps<
  TRouter extends RegisteredRouter = RegisteredRouter,
  TOptions = unknown,
> {
  title: string;
  linkOptions: ValidateLinkOptions<TRouter, TOptions>;
}

export function HeadingLink<TRouter extends RegisteredRouter, TOptions>(
  props: HeaderLinkProps<TRouter, TOptions>,
): React.ReactNode;
export function HeadingLink(props: HeaderLinkProps): React.ReactNode {
  return (
    <>
      <h1>{props.title}</h1>
      <Link {...props.linkOptions} />
    </>
  );
}
```

Uma sobrecarga mais permissiva de `HeadingLink` é usada para evitar asserções de tipo que você teria que fazer com a assinatura genérica. Usar uma assinatura mais flexível sem parâmetros de tipo é uma maneira fácil de evitar asserções de tipo na implementação de `HeadingLink`

Todos os parâmetros de tipo para utilitários são opcionais, mas para a melhor performance do TypeScript, `TRouter` deve sempre ser especificado para a assinatura pública. E `TOptions` deve sempre ser usado nos locais de inferência como `HeadingLink` para inferir as `linkOptions` e restringir corretamente `params` e `search`

O resultado disso é que `linkOptions` no exemplo a seguir é completamente type-safe

```tsx
<HeadingLink title="Posts" linkOptions={{ to: '/posts' }} />
<HeadingLink title="Post" linkOptions={{ to: '/posts/$postId', params: {postId: 'postId'} }} />
```

## Verificação de tipos de um array de opções de Link com `ValidateLinkOptionsArray`

Todos os utilitários de tipo de navegação possuem uma variante de array. `ValidateLinkOptionsArray` permite a verificação de tipos de um array de opções de `Link`. Por exemplo, você pode ter um component genérico `Menu` onde cada item é um `Link`.

```tsx
export interface MenuProps<
  TRouter extends RegisteredRouter = RegisteredRouter,
  TItems extends ReadonlyArray<unknown> = ReadonlyArray<unknown>,
> {
  items: ValidateLinkOptionsArray<TRouter, TItems>;
}

export function Menu<
  TRouter extends RegisteredRouter = RegisteredRouter,
  TItems extends ReadonlyArray<unknown>,
>(props: MenuProps<TRouter, TItems>): React.ReactNode;
export function Menu(props: MenuProps): React.ReactNode {
  return (
    <ul>
      {props.items.map((item) => (
        <li>
          <Link {...item} />
        </li>
      ))}
    </ul>
  );
}
```

Isso obviamente permite que a prop `items` a seguir seja completamente type-safe

```tsx
<Menu
  items={[
    { to: "/posts" },
    { to: "/posts/$postId", params: { postId: "postId" } },
  ]}
/>
```

Também é possível fixar `from` para cada opção de `Link` no array. Isso permitiria que todos os itens do `Menu` naveguem relativamente ao `from`. Verificação de tipos adicional para `from` pode ser fornecida pelo utilitário `ValidateFromPath`

```tsx
export interface MenuProps<
  TRouter extends RegisteredRouter = RegisteredRouter,
  TItems extends ReadonlyArray<unknown> = ReadonlyArray<unknown>,
  TFrom extends string = string,
> {
  from: ValidateFromPath<TRouter, TFrom>;
  items: ValidateLinkOptionsArray<TRouter, TItems, TFrom>;
}

export function Menu<
  TRouter extends RegisteredRouter = RegisteredRouter,
  TItems extends ReadonlyArray<unknown>,
  TFrom extends string = string,
>(props: MenuProps<TRouter, TItems, TFrom>): React.ReactNode;
export function Menu(props: MenuProps): React.ReactNode {
  return (
    <ul>
      {props.items.map((item) => (
        <li>
          <Link {...item} from={props.from} />
        </li>
      ))}
    </ul>
  );
}
```

`ValidateLinkOptionsArray` permite que você fixe `from` fornecendo um parâmetro de tipo extra. O resultado é um array type-safe de opções de `Link` fornecendo navegação relativa ao `from`

```tsx
<Menu
  from="/posts"
  items={[{ to: "." }, { to: "./$postId", params: { postId: "postId" } }]}
/>
```

## Verificação de tipos das opções de redirect com `ValidateRedirectOptions`

`ValidateRedirectOptions` verifica tipos de objetos literais para garantir que estejam em conformidade com as opções de redirect nos locais de inferência. Por exemplo, você pode precisar de uma função genérica `fetchOrRedirect` que aceita uma `url` junto com `redirectOptions`, a ideia sendo que essa função fará redirect quando o `fetch` falhar.

```tsx
export async function fetchOrRedirect<
  TRouter extends RegisteredRouter = RegisteredRouter,
  TOptions,
>(
  url: string,
  redirectOptions: ValidateRedirectOptions<TRouter, TOptions>,
): Promise<unknown>;
export async function fetchOrRedirect(
  url: string,
  redirectOptions: ValidateRedirectOptions,
): Promise<unknown> {
  const response = await fetch(url);

  if (!response.ok && response.status === 401) {
    throw redirect(redirectOptions);
  }

  return await response.json();
}
```

O resultado é que `redirectOptions` passado para `fetchOrRedirect` é completamente type-safe

```tsx
fetchOrRedirect("http://example.com/", { to: "/login" });
```

## Verificação de tipos das opções de navigate com `ValidateNavigateOptions`

`ValidateNavigateOptions` verifica tipos de objetos literais para garantir que estejam em conformidade com as opções de navigate nos locais de inferência. Por exemplo, você pode querer escrever um hook personalizado para habilitar/desabilitar navegação.

[//]: # "TypeCheckingNavigateOptionsWithValidateNavigateOptionsImpl"

```tsx
export interface UseConditionalNavigateResult {
  enable: () => void;
  disable: () => void;
  navigate: () => void;
}

export function useConditionalNavigate<
  TRouter extends RegisteredRouter = RegisteredRouter,
  TOptions,
>(
  navigateOptions: ValidateNavigateOptions<TRouter, TOptions>,
): UseConditionalNavigateResult;
export function useConditionalNavigate(
  navigateOptions: ValidateNavigateOptions,
): UseConditionalNavigateResult {
  const [enabled, setEnabled] = useState(false);
  const navigate = useNavigate();
  return {
    enable: () => setEnabled(true),
    disable: () => setEnabled(false),
    navigate: () => {
      if (enabled) {
        navigate(navigateOptions);
      }
    },
  };
}
```

[//]: # "TypeCheckingNavigateOptionsWithValidateNavigateOptionsImpl"

O resultado disso é que `navigateOptions` passado para `useConditionalNavigate` é completamente type-safe e podemos habilitar/desabilitar navegação baseado no state do React

```tsx
const { enable, disable, navigate } = useConditionalNavigate({
  to: "/posts/$postId",
  params: { postId: "postId" },
});
```
