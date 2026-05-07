---
title: Route Masking
---

Route masking é uma forma de mascarar a URL real de uma route que é persistida no histórico do navegador e na barra de URL. Isso é útil para cenários onde você quer mostrar uma URL diferente da que está sendo realmente navegada e então voltar para a URL exibida quando ela é compartilhada e (opcionalmente) quando a página é recarregada. Aqui estão alguns exemplos:

- Navegar para uma route modal como `/photo/5/modal`, mas mascarando a URL real como `/photos/5`
- Navegar para uma route modal como `/post/5/comments`, mas mascarando a URL real como `/posts/5`
- Navegar para uma route com o search param `?showLogin=true`, mas mascarando a URL para _não_ conter o search param
- Navegar para uma route com o search param `?modal=settings`, mas mascarando a URL como `/settings`

Cada um desses cenários pode ser alcançado com route masking e até estendido para suportar padrões mais avançados como [routes paralelas](./parallel-routes.md).

## Como funciona o route masking?

> [!IMPORTANT]
> Você **não precisa** entender como o route masking funciona para usá-lo. Esta seção é para aqueles que têm curiosidade sobre como funciona internamente. Pule para [Como eu uso route masking?](#como-eu-uso-route-masking) para aprender a usá-lo!

O route masking utiliza a API `location.state` para armazenar a localização desejada em tempo de execução dentro da localização que será escrita na URL. Ele armazena essa localização de runtime sob a propriedade de state `__tempLocation`:

```tsx
const location = {
  pathname: "/photos/5",
  search: "",
  hash: "",
  state: {
    key: "wesdfs",
    __tempKey: "sadfasd",
    __tempLocation: {
      pathname: "/photo/5/modal",
      search: "",
      hash: "",
      state: {},
    },
  },
};
```

Quando o router analisa uma localização do histórico com a propriedade `location.state.__tempLocation`, ele usará essa localização em vez da que foi analisada da URL. Isso permite que você navegue para uma route como `/photos/5` e faça o router realmente navegar para `/photo/5/modal`. Quando isso acontece, a localização do histórico é salva de volta na propriedade `location.maskedLocation`, caso precisemos saber qual é a **URL real**. Um exemplo de onde isso é usado é nas Devtools, onde detectamos se uma route está mascarada e mostramos a URL real em vez da mascarada!

Lembre-se, você não precisa se preocupar com nada disso. Tudo é tratado automaticamente internamente!

## Como eu uso route masking?

O route masking é uma API simples que pode ser usada de 2 formas:

- Imperativamente via a opção `mask` disponível nas APIs `<Link>` e `navigate()`
- Declarativamente via a opção `routeMasks` do Router

Ao usar qualquer uma das APIs de route masking, a opção `mask` aceita o mesmo objeto de navegação que as APIs `<Link>` e `navigate()` aceitam. Isso significa que você pode usar as mesmas opções `to`, `replace`, `state` e `search` com as quais já está familiarizado. A única diferença é que a opção `mask` será usada para mascarar a URL da route sendo navegada.

> 🧠 A opção mask também é **type-safe**! Isso significa que se você estiver usando TypeScript, receberá erros de tipo se tentar passar um objeto de navegação inválido para a opção `mask`. Excelente!

### Route masking imperativo

As APIs `<Link>` e `navigate()` aceitam uma opção `mask` que pode ser usada para mascarar a URL da route sendo navegada. Aqui está um exemplo de uso com o component `<Link>`:

```tsx
<Link
  to="/photos/$photoId/modal"
  params={{ photoId: 5 }}
  mask={{
    to: "/photos/$photoId",
    params: {
      photoId: 5,
    },
  }}
>
  Open Photo
</Link>
```

E aqui está um exemplo de uso com a API `navigate()`:

```tsx
const navigate = useNavigate();

function onOpenPhoto() {
  navigate({
    to: "/photos/$photoId/modal",
    params: { photoId: 5 },
    mask: {
      to: "/photos/$photoId",
      params: {
        photoId: 5,
      },
    },
  });
}
```

### Route masking declarativo

Além da API imperativa, você também pode usar a opção `routeMasks` do Router para mascarar routes declarativamente. Em vez de precisar passar a opção `mask` para cada chamada `<Link>` ou `navigate()`, você pode criar uma máscara de route no Router para mascarar routes que correspondam a um determinado padrão. Aqui está um exemplo da mesma máscara de route acima, mas usando a opção `routeMasks`:

// Use o seguinte para o exemplo abaixo

```tsx
import { createRouteMask } from "@tanstack/react-router";

const photoModalToPhotoMask = createRouteMask({
  routeTree,
  from: "/photos/$photoId/modal",
  to: "/photos/$photoId",
  params: (prev) => ({
    photoId: prev.photoId,
  }),
});

const router = createRouter({
  routeTree,
  routeMasks: [photoModalToPhotoMask],
});
```

Ao criar uma máscara de route, você precisará passar 1 argumento com pelo menos:

- `routeTree` - A árvore de routes à qual a máscara de route será aplicada
- `from` - O ID da route à qual a máscara de route será aplicada
- `...navigateOptions` - As opções padrão `to`, `search`, `params`, `replace`, etc. que as APIs `<Link>` e `navigate()` aceitam

> 🧠 A opção `createRouteMask` também é **type-safe**! Isso significa que se você estiver usando TypeScript, receberá erros de tipo se tentar passar uma máscara de route inválida para a opção `routeMasks`.

## Desmascaramento ao compartilhar a URL

As URLs são automaticamente desmascaradas quando são compartilhadas, pois assim que uma URL é desvinculada da pilha de histórico local do seu navegador, os dados de mascaramento da URL não estão mais disponíveis. Essencialmente, assim que você copia e cola uma URL fora do seu histórico, seus dados de mascaramento são perdidos... afinal, esse é o propósito de mascarar uma URL!

## Padrões de Desmascaramento Local

**Por padrão, as URLs não são desmascaradas quando a página é recarregada localmente**. Os dados de mascaramento são armazenados na propriedade `location.state` da localização do histórico, então enquanto a localização do histórico ainda estiver na memória da sua pilha de histórico, os dados de mascaramento estarão disponíveis e a URL continuará mascarada.

## Desmascaramento ao recarregar a página

**Como mencionado acima, as URLs não são desmascaradas quando a página é recarregada por padrão**.

Se você quer desmascarar uma URL localmente quando a página é recarregada, você tem 3 opções, cada uma sobrescrevendo a anterior em prioridade se passada:

- Definir a opção padrão `unmaskOnReload` do Router como `true`
- Retornar a opção `unmaskOnReload: true` da função de mascaramento ao criar uma máscara de route com `createRouteMask()`
- Passar a opção `unmaskOnReload: true` para o component `<Link>` ou a API `navigate()`
