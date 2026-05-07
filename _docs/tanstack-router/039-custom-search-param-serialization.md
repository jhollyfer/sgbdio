---
title: Custom Search Param Serialization
---

Por padrão, o TanStack Router analisa e serializa seus URL Search Params automaticamente usando `JSON.stringify` e `JSON.parse`. Esse processo envolve escapar e desescapar a string de busca, que é uma prática comum para search params de URL, além da serialização e desserialização do objeto de busca.

Por exemplo, usando a configuração padrão, se você tiver o seguinte objeto de busca:

```tsx
const search = {
  page: 1,
  sort: "asc",
  filters: { author: "tanner", min_words: 800 },
};
```

Ele seria serializado e escapado na seguinte string de busca:

```txt
?page=1&sort=asc&filters=%7B%22author%22%3A%22tanner%22%2C%22min_words%22%3A800%7D
```

Podemos implementar o comportamento padrão com o seguinte código:

```tsx
import {
  createRouter,
  parseSearchWith,
  stringifySearchWith,
} from "@tanstack/react-router";

const router = createRouter({
  // ...
  parseSearch: parseSearchWith(JSON.parse),
  stringifySearch: stringifySearchWith(JSON.stringify),
});
```

No entanto, esse comportamento padrão pode não ser adequado para todos os casos de uso. Por exemplo, você pode querer usar um formato de serialização diferente, como codificação base64, ou pode querer usar uma biblioteca de serialização/desserialização dedicada, como [query-string](https://github.com/sindresorhus/query-string), [JSURL2](https://github.com/wmertens/jsurl2) ou [Zipson](https://jgranstrom.github.io/zipson/).

Isso pode ser alcançado fornecendo suas próprias funções de serialização e desserialização para as opções `parseSearch` e `stringifySearch` na configuração do [`Router`](../api/router/RouterOptionsType.md#stringifysearch-method). Ao fazer isso, você pode utilizar as funções auxiliares integradas do TanStack Router, `parseSearchWith` e `stringifySearchWith`, para simplificar o processo.

> [!TIP]
> Um aspecto importante da serialização e desserialização é que você consiga obter o mesmo objeto de volta após a desserialização. Isso é importante porque se o processo de serialização e desserialização não for feito corretamente, você pode perder algumas informações. Por exemplo, se você estiver usando uma biblioteca que não suporta objetos aninhados, poderá perder o objeto aninhado ao desserializar a string de busca.

![Diagrama mostrando a natureza idempotente da serialização e desserialização de URL search params](https://raw.githubusercontent.com/TanStack/router/main/docs/router/assets/search-serialization-deserialization-idempotency.jpg)

Aqui estão alguns exemplos de como você pode personalizar a serialização de search params no TanStack Router:

## Usando Base64

É comum codificar seus search params em base64 para alcançar máxima compatibilidade entre navegadores e desdobradores de URL, etc. Isso pode ser feito com o seguinte código:

```tsx
import {
  Router,
  parseSearchWith,
  stringifySearchWith,
} from "@tanstack/react-router";

const router = createRouter({
  parseSearch: parseSearchWith((value) => JSON.parse(decodeFromBinary(value))),
  stringifySearch: stringifySearchWith((value) =>
    encodeToBinary(JSON.stringify(value)),
  ),
});

function decodeFromBinary(str: string): string {
  return decodeURIComponent(
    Array.prototype.map
      .call(atob(str), function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(""),
  );
}

function encodeToBinary(str: string): string {
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
      return String.fromCharCode(parseInt(p1, 16));
    }),
  );
}
```

> [⚠️ Por que este trecho não usa atob/btoa?](#codificaçãodecodificação-binária-segura)

Então, se fôssemos transformar o objeto anterior em uma string de busca usando essa configuração, ficaria assim:

```txt
?page=1&sort=asc&filters=eyJhdXRob3IiOiJ0YW5uZXIiLCJtaW5fd29yZHMiOjgwMH0%3D
```

> [!WARNING]
> Se você estiver serializando entrada do usuário em Base64, corre o risco de causar uma colisão com a desserialização da URL. Isso pode levar a comportamento inesperado, como a URL não ser analisada corretamente ou ser interpretada como um valor diferente. Para evitar isso, você deve codificar os search params usando um método seguro de codificação/decodificação binária (veja abaixo).

## Usando a biblioteca query-string

A biblioteca [query-string](https://github.com/sindresorhus/query-string) é popular por ser capaz de analisar e serializar query strings de forma confiável. Você pode usá-la para personalizar o formato de serialização dos seus search params. Isso pode ser feito com o seguinte código:

```tsx
import { createRouter } from "@tanstack/react-router";
import qs from "query-string";

const router = createRouter({
  // ...
  stringifySearch: stringifySearchWith((value) =>
    qs.stringify(value, {
      // ...options
    }),
  ),
  parseSearch: parseSearchWith((value) =>
    qs.parse(value, {
      // ...options
    }),
  ),
});
```

Então, se fôssemos transformar o objeto anterior em uma string de busca usando essa configuração, ficaria assim:

```txt
?page=1&sort=asc&filters=author%3Dtanner%26min_words%3D800
```

## Usando a biblioteca JSURL2

[JSURL2](https://github.com/wmertens/jsurl2) é uma biblioteca não padrão que pode comprimir URLs mantendo a legibilidade. Isso pode ser feito com o seguinte código:

```tsx
import {
  Router,
  parseSearchWith,
  stringifySearchWith,
} from "@tanstack/react-router";
import { parse, stringify } from "jsurl2";

const router = createRouter({
  // ...
  parseSearch: parseSearchWith(parse),
  stringifySearch: stringifySearchWith(stringify),
});
```

Então, se fôssemos transformar o objeto anterior em uma string de busca usando essa configuração, ficaria assim:

```txt
?page=1&sort=asc&filters=(author~tanner~min*_words~800)~
```

## Usando a biblioteca Zipson

[Zipson](https://jgranstrom.github.io/zipson/) é uma biblioteca de compressão JSON muito amigável e performática (tanto em performance de runtime quanto na performance de compressão resultante). Para comprimir seus search params com ela (o que requer escapar/desescapar e codificar/decodificar em base64 também), você pode usar o seguinte código:

```tsx
import {
  Router,
  parseSearchWith,
  stringifySearchWith,
} from "@tanstack/react-router";
import { stringify, parse } from "zipson";

const router = createRouter({
  parseSearch: parseSearchWith((value) => parse(decodeFromBinary(value))),
  stringifySearch: stringifySearchWith((value) =>
    encodeToBinary(stringify(value)),
  ),
});

function decodeFromBinary(str: string): string {
  return decodeURIComponent(
    Array.prototype.map
      .call(atob(str), function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(""),
  );
}

function encodeToBinary(str: string): string {
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
      return String.fromCharCode(parseInt(p1, 16));
    }),
  );
}
```

> [⚠️ Por que este trecho não usa atob/btoa?](#codificaçãodecodificação-binária-segura)

Então, se fôssemos transformar o objeto anterior em uma string de busca usando essa configuração, ficaria assim:

```txt
?page=1&sort=asc&filters=JTdCJUMyJUE4YXV0aG9yJUMyJUE4JUMyJUE4dGFubmVyJUMyJUE4JUMyJUE4bWluX3dvcmRzJUMyJUE4JUMyJUEyQ3UlN0Q%3D
```

<hr>

### Codificação/Decodificação Binária Segura

No navegador, as funções `atob` e `btoa` não são garantidas de funcionar corretamente com caracteres não-UTF8. Recomendamos usar estes utilitários de codificação/decodificação em vez disso:

Para codificar de uma string para uma string binária:

```typescript
export function encodeToBinary(str: string): string {
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
      return String.fromCharCode(parseInt(p1, 16));
    }),
  );
}
```

Para decodificar de uma string binária para uma string:

```typescript
export function decodeFromBinary(str: string): string {
  return decodeURIComponent(
    Array.prototype.map
      .call(atob(str), function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(""),
  );
}
```
