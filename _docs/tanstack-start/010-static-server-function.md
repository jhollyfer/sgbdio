---
id: static-server-functions
title: Static Server Functions
---

> [!WARNING]
> Server Functions Estaticas sao experimentais!

## O que sao Server Functions Estaticas?

Server functions estaticas sao server functions que sao executadas no tempo de build e armazenadas em cache como assets estaticos ao usar pre-rendering/geracao estatica. Elas podem ser definidas no modo "static" aplicando o middleware `staticFunctionMiddleware` ao `createServerFn`:

```tsx
import { createServerFn } from "@tanstack/react-start";
import { staticFunctionMiddleware } from "@tanstack/start-static-server-functions";

const myServerFn = createServerFn({ method: "GET" })
  .middleware([staticFunctionMiddleware])
  .handler(async () => {
    return "Hello, world!";
  });
```

Certifique-se de que `staticFunctionMiddleware` seja o ultimo middleware!

Este padrao funciona da seguinte forma:

- Tempo de build
  - Durante o pre-rendering no tempo de build, uma server function com `staticFunctionMiddleware` e executada
  - O resultado e armazenado em cache com a saida do seu build como um arquivo JSON estatico sob uma chave derivada (ID da funcao + hash dos parametros/payload)
  - O resultado e retornado normalmente durante o pre-rendering/geracao estatica e usado para pre-renderizar a pagina
- Runtime
  - Inicialmente, o HTML da pagina pre-renderizada e servido e os dados da server function sao incorporados no HTML
  - Quando o cliente monta, os dados incorporados da server function sao hidratados
  - Para invocacoes futuras do lado do cliente, a server function e substituida por uma chamada fetch ao arquivo JSON estatico
