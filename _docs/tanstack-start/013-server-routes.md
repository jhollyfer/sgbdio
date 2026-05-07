---
id: server-routes
title: Server Routes
---

Server routes sao um recurso poderoso do TanStack Start que permitem criar endpoints do lado do servidor na sua aplicacao e sao uteis para lidar com requisicoes HTTP brutas, envios de formularios, autenticacao de usuarios e muito mais.

Server routes podem ser definidas no diretorio `./src/routes` do seu projeto **junto com as suas routes do TanStack Router** e sao automaticamente tratadas pelo servidor do TanStack Start.

Aqui esta como uma server route simples se parece:

```ts
// routes/hello.ts
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/hello")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        return new Response("Hello, World!");
      },
    },
  },
});
```

## Server Routes e Routes da Aplicacao

Como server routes podem ser definidas no mesmo diretorio que as routes da sua aplicacao, voce pode ate usar o mesmo arquivo para ambas!

```tsx
// routes/hello.tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/hello")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.json();
        return new Response(
          JSON.stringify({ message: `Hello, ${body.name}!` }),
        );
      },
    },
  },
  component: HelloComponent,
});

function HelloComponent() {
  const [reply, setReply] = useState("");

  return (
    <div>
      <button
        onClick={() => {
          fetch("/hello", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: "Tanner" }),
          })
            .then((res) => res.json())
            .then((data) => setReply(data.message));
        }}
      >
        Say Hello
      </button>
    </div>
  );
}
```

## Convencoes de File Route

Server routes no TanStack Start seguem as mesmas convencoes de roteamento baseado em arquivo do TanStack Router. Isso significa que cada arquivo no seu diretorio `routes` com uma propriedade `server` na chamada `createFileRoute` sera tratado como uma API route. Aqui estao alguns exemplos:

- `/routes/users.ts` criara uma API route em `/users`
- `/routes/users.index.ts` **tambem** criara uma API route em `/users` (mas dara erro se metodos duplicados forem definidos)
- `/routes/users/$id.ts` criara uma API route em `/users/$id`
- `/routes/users/$id/posts.ts` criara uma API route em `/users/$id/posts`
- `/routes/users.$id.posts.ts` criara uma API route em `/users/$id/posts`
- `/routes/api/file/$.ts` criara uma API route em `/api/file/$`
- `/routes/my-script[.]js.ts` criara uma API route em `/my-script.js`

## Caminhos de Route Unicos

Cada route so pode ter um unico arquivo de handler associado a ela. Entao, se voce tem um arquivo chamado `routes/users.ts` que equivaleria ao caminho de requisicao `/users`, voce nao pode ter outros arquivos que tambem resolveriam para a mesma route. Por exemplo, os seguintes arquivos todos resolveriam para a mesma route e causariam erro:

- `/routes/users.index.ts`
- `/routes/users.ts`
- `/routes/users/index.ts`

## Correspondencia com Escape

Assim como com routes normais, server routes podem corresponder a caracteres com escape. Por exemplo, um arquivo chamado `routes/users[.]json.ts` criara uma API route em `/users.json`.

## Routes de Layout sem Caminho e Routes de Break-out

Por causa do sistema de roteamento unificado, routes de layout sem caminho e routes de break-out sao suportadas para funcionalidades similares em torno de middleware de server route.

- Routes de layout sem caminho podem ser usadas para adicionar middleware a um grupo de routes
- Routes de break-out podem ser usadas para "sair" do middleware pai

## Diretorios Aninhados vs Nomes de Arquivo

Nos exemplos acima, voce pode ter notado que as convencoes de nomenclatura de arquivo sao flexiveis e permitem misturar diretorios e nomes de arquivo. Isso e intencional e permite que voce organize suas Server routes de uma maneira que faca sentido para sua aplicacao. Voce pode ler mais sobre isso no [Guia de Roteamento Baseado em Arquivo do TanStack Router](/router/latest/docs/framework/react/routing/file-based-routing#s-or-s).

## Tratando Requisicoes de Server Route

Requisicoes de server route sao tratadas pelo Start automaticamente por padrao ou pelo `createStartHandler` do Start no seu arquivo de entry point personalizado `src/server.ts`.

O handler do Start e responsavel por corresponder uma requisicao recebida a uma server route e executar o middleware e handler apropriados.

Se voce precisa personalizar o handler do servidor, pode fazer isso criando um handler personalizado e entao passando o evento para o handler do Start. Veja [O Entry Point do Servidor](./server-entry-point).

## Definindo uma Server Route

Server routes sao criadas adicionando uma propriedade `server` a sua chamada `createFileRoute`. A propriedade `server` contem:

- `handlers` - Um objeto mapeando metodos HTTP para funcoes handler, ou uma funcao que recebe `createHandlers` para casos de uso mais avancados
- `middleware` - Array opcional de middleware no nivel da route que se aplica a todos os handlers

```ts
// routes/hello.ts
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/hello")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        return new Response("Hello, World! from " + request.url);
      },
    },
  },
});
```

## Definindo Handlers de Server Route

Voce pode definir handlers de duas maneiras:

- **Handlers simples**: Fornecer funcoes handler diretamente em um objeto handlers
- **Handlers com middleware**: Usar a funcao `createHandlers` para definir handlers com middleware

### Handlers simples

Para casos de uso simples, voce pode fornecer funcoes handler diretamente em um objeto handlers.

```ts
// routes/hello.ts
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/hello")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        return new Response("Hello, World! from " + request.url);
      },
    },
  },
});
```

### Adicionando middleware a handlers especificos

Para casos de uso mais avancados, voce pode adicionar middleware a handlers especificos. Isso requer o uso da funcao `createHandlers`:

```tsx
// routes/hello.ts
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/hello")({
  server: {
    handlers: ({ createHandlers }) =>
      createHandlers({
        GET: {
          middleware: [loggerMiddleware],
          handler: async ({ request }) => {
            return new Response("Hello, World! from " + request.url);
          },
        },
      }),
  },
});
```

### Adicionando middleware a todos os handlers

Voce tambem pode adicionar middleware que se aplica a todos os handlers em uma route usando a propriedade `middleware` no nivel do server:

```tsx
// routes/hello.ts
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/hello")({
  server: {
    middleware: [authMiddleware, loggerMiddleware], // Applies to all handlers
    handlers: {
      GET: async ({ request }) => {
        return new Response("Hello, World! from " + request.url);
      },
      POST: async ({ request }) => {
        const body = await request.json();
        return new Response(`Hello, ${body.name}!`);
      },
    },
  },
});
```

### Combinando middleware no nivel da route e especifico do handler

Voce pode combinar ambas as abordagens - o middleware no nivel da route sera executado primeiro, seguido pelo middleware especifico do handler:

```tsx
// routes/hello.ts
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/hello")({
  server: {
    middleware: [authMiddleware], // Runs first for all handlers
    handlers: ({ createHandlers }) =>
      createHandlers({
        GET: async ({ request }) => {
          return new Response("Hello, World!");
        },
        POST: {
          middleware: [validationMiddleware], // Runs after authMiddleware, only for POST
          handler: async ({ request }) => {
            const body = await request.json();
            return new Response(`Hello, ${body.name}!`);
          },
        },
      }),
  },
});
```

## Contexto do Handler

Cada handler de metodo HTTP recebe um objeto com as seguintes propriedades:

- `request`: O objeto de requisicao recebida. Voce pode ler mais sobre o objeto `Request` na [documentacao MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Request).
- `params`: Um objeto contendo os parametros de caminho dinamicos da route. Por exemplo, se o caminho da route e `/users/$id`, e a requisicao e feita para `/users/123`, entao `params` sera `{ id: '123' }`. Abordaremos parametros de caminho dinamicos e parametros wildcard mais adiante neste guia.
- `context`: Um objeto contendo o context da requisicao. Isso e util para passar dados entre middleware.

Depois de processar a requisicao, voce pode retornar um objeto `Response` ou `Promise<Response>` ou ate usar qualquer um dos helpers de `@tanstack/react-start` para manipular a resposta.

## Parametros de Caminho Dinamicos

Server routes suportam parametros de caminho dinamicos da mesma forma que o TanStack Router. Por exemplo, um arquivo chamado `routes/users/$id.ts` criara uma API route em `/users/$id` que aceita um parametro `id` dinamico.

```ts
// routes/users/$id.ts
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/users/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const { id } = params;
        return new Response(`User ID: ${id}`);
      },
    },
  },
});

// Visit /users/123 to see the response
// User ID: 123
```

Voce tambem pode ter multiplos parametros de caminho dinamicos em uma unica route. Por exemplo, um arquivo chamado `routes/users/$id/posts/$postId.ts` criara uma API route em `/users/$id/posts/$postId` que aceita dois parametros dinamicos.

```ts
// routes/users/$id/posts/$postId.ts
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/users/$id/posts/$postId")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const { id, postId } = params;
        return new Response(`User ID: ${id}, Post ID: ${postId}`);
      },
    },
  },
});

// Visit /users/123/posts/456 to see the response
// User ID: 123, Post ID: 456
```

## Parametro Wildcard/Splat

Server routes tambem suportam parametros wildcard no final do caminho, que sao indicados por um `$` seguido de nada. Por exemplo, um arquivo chamado `routes/file/$.ts` criara uma API route em `/file/$` que aceita um parametro wildcard.

```ts
// routes/file/$.ts
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/file/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const { _splat } = params;
        return new Response(`File: ${_splat}`);
      },
    },
  },
});

// Visit /file/hello.txt to see the response
// File: hello.txt
```

## Tratando requisicoes com corpo

Para tratar requisicoes POST, voce pode adicionar um handler `POST` ao objeto de route. O handler recebera o objeto de requisicao como primeiro argumento, e voce pode acessar o corpo da requisicao usando o metodo `request.json()`.

```ts
// routes/hello.ts
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/hello")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.json();
        return new Response(`Hello, ${body.name}!`);
      },
    },
  },
});

// Send a POST request to /hello with a JSON body like { "name": "Tanner" }
// Hello, Tanner!
```

Isso tambem se aplica a outros metodos HTTP como `PUT`, `PATCH` e `DELETE`. Voce pode adicionar handlers para esses metodos no objeto de route e acessar o corpo da requisicao usando o metodo apropriado.

E importante lembrar que o metodo `request.json()` retorna uma `Promise` que resolve para o corpo JSON parseado da requisicao. Voce precisa usar `await` no resultado para acessar o corpo.

Este e um padrao comum para tratar requisicoes POST em Server routes. Voce tambem pode usar outros metodos como `request.text()` ou `request.formData()` para acessar o corpo da requisicao.

## Respondendo com JSON

Ao retornar JSON usando um objeto Response, este e um padrao comum:

```ts
// routes/hello.ts
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/hello")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        return new Response(JSON.stringify({ message: "Hello, World!" }), {
          headers: {
            "Content-Type": "application/json",
          },
        });
      },
    },
  },
});

// Visit /hello to see the response
// {"message":"Hello, World!"}
```

## Usando a funcao helper `Response.json`

Ou voce pode usar a funcao helper [`Response.json`](https://developer.mozilla.org/en-US/docs/Web/API/Response/json_static) para definir automaticamente o header `Content-Type` como `application/json` e serializar o objeto JSON para voce.

```ts
// routes/hello.ts
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/hello")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        return Response.json({ message: "Hello, World!" });
      },
    },
  },
});

// Visit /hello to see the response
// {"message":"Hello, World!"}
```

## Respondendo com um codigo de status

Voce pode definir o codigo de status da resposta passando-o como uma propriedade do segundo argumento do construtor `Response`

```ts
// routes/hello.ts
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/hello")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const user = await findUser(params.id);
        if (!user) {
          return new Response("User not found", {
            status: 404,
          });
        }
        return Response.json(user);
      },
    },
  },
});
```

Neste exemplo, estamos retornando um codigo de status `404` se o usuario nao for encontrado. Voce pode definir qualquer codigo de status HTTP valido usando este metodo.

## Definindo headers na resposta

As vezes voce pode precisar definir headers na resposta. Voce pode fazer isso passando um objeto como segundo argumento do construtor `Response`.

```ts
// routes/hello.ts
import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/hello")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        return new Response("Hello, World!", {
          headers: {
            "Content-Type": "text/plain",
          },
        });
      },
    },
  },
});
// Visit /hello to see the response
// Hello, World!
```
