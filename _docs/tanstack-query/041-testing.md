---
id: testing
title: Testing
---

O React Query funciona por meio de hooks - seja os que oferecemos ou hooks customizados que os envolvem.

Com React 17 ou anterior, escrever testes unitários para esses hooks customizados pode ser feito por meio da biblioteca [React Hooks Testing Library](https://react-hooks-testing-library.com/).

Instale executando:

```sh
npm install @testing-library/react-hooks react-test-renderer --save-dev
```

(A biblioteca `react-test-renderer` é necessária como dependência peer de `@testing-library/react-hooks`, e precisa corresponder à versão do React que você está usando.)

_Nota_: ao usar React 18 ou posterior, `renderHook` está disponível diretamente pelo pacote `@testing-library/react`, e `@testing-library/react-hooks` não é mais necessário.

## Nosso primeiro teste

Uma vez instalado, um teste simples pode ser escrito. Dado o seguinte hook customizado:

```tsx
export function useCustomHook() {
  return useQuery({ queryKey: ["customHook"], queryFn: () => "Hello" });
}
```

Podemos escrever um teste para isso da seguinte forma:

```tsx
import { renderHook, waitFor } from "@testing-library/react";

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

const { result } = renderHook(() => useCustomHook(), { wrapper });

await waitFor(() => expect(result.current.isSuccess).toBe(true));

expect(result.current.data).toEqual("Hello");
```

Note que fornecemos um wrapper customizado que cria o `QueryClient` e o `QueryClientProvider`. Isso ajuda a garantir que nosso teste esteja completamente isolado de quaisquer outros testes.

É possível escrever esse wrapper apenas uma vez, mas se fizer isso, precisamos garantir que o `QueryClient` seja limpo antes de cada teste, e que os testes não rodem em paralelo, caso contrário um teste influenciará os resultados de outros.

## Desabilitar retentativas

A biblioteca tem como padrão três retentativas com backoff exponencial, o que significa que seus testes provavelmente vão atingir timeout se você quiser testar uma query com erro. A maneira mais fácil de desabilitar retentativas é via `QueryClientProvider`. Vamos estender o exemplo acima:

```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // ✅ turns retries off
      retry: false,
    },
  },
});
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);
```

Isso vai definir os padrões para todas as queries na árvore de components como "sem retentativas". É importante saber que isso só vai funcionar se o seu `useQuery` real não tiver retentativas explícitas definidas. Se você tiver uma query que quer 5 retentativas, isso ainda terá precedência, porque os padrões são usados apenas como fallback.

## Definir gcTime como Infinity com Jest

Se você usa Jest, pode definir o `gcTime` como `Infinity` para evitar a mensagem de erro "Jest did not exit one second after the test run completed". Esse é o comportamento padrão no servidor, e só é necessário definir se você estiver explicitamente definindo um `gcTime`.

## Testando chamadas de rede

O uso principal do React Query é fazer cache de requisições de rede, então é importante que possamos testar se nosso código está fazendo as requisições de rede corretas em primeiro lugar.

Existem várias maneiras de testar isso, mas para este exemplo vamos usar o [nock](https://www.npmjs.com/package/nock).

Dado o seguinte hook customizado:

```tsx
function useFetchData() {
  return useQuery({
    queryKey: ["fetchData"],
    queryFn: () => request("/api/data"),
  });
}
```

Podemos escrever um teste para isso da seguinte forma:

```tsx
const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

const expectation = nock("http://example.com").get("/api/data").reply(200, {
  answer: 42,
});

const { result } = renderHook(() => useFetchData(), { wrapper });

await waitFor(() => expect(result.current.isSuccess).toBe(true));

expect(result.current.data).toEqual({ answer: 42 });
```

Aqui estamos usando `waitFor` e esperando até que o status da query indique que a requisição foi bem-sucedida. Dessa forma sabemos que nosso hook terminou e deve ter os dados corretos. _Nota_: ao usar React 18, a semântica de `waitFor` mudou como indicado acima.

## Testando Load More / Scroll Infinito

Primeiro precisamos mockar a resposta da nossa API

```tsx
function generateMockedResponse(page) {
  return {
    page: page,
    items: [...]
  }
}
```

Então, nossa configuração do `nock` precisa diferenciar respostas baseadas na página, e vamos usar `uri` para isso.
O valor de `uri` aqui será algo como `"/?page=1` ou `/?page=2`

```tsx
const expectation = nock("http://example.com")
  .persist()
  .query(true)
  .get("/api/data")
  .reply(200, (uri) => {
    const url = new URL(`http://example.com${uri}`);
    const { page } = Object.fromEntries(url.searchParams);
    return generateMockedResponse(page);
  });
```

(Note o `.persist()`, porque vamos chamar este endpoint várias vezes)

Agora podemos executar nossos testes com segurança, o truque aqui é aguardar que a asserção de dados passe:

```tsx
const { result } = renderHook(() => useInfiniteQueryCustomHook(), {
  wrapper,
});

await waitFor(() => expect(result.current.isSuccess).toBe(true));

expect(result.current.data.pages).toStrictEqual(generateMockedResponse(1));

result.current.fetchNextPage();

await waitFor(() =>
  expect(result.current.data.pages).toStrictEqual([
    ...generateMockedResponse(1),
    ...generateMockedResponse(2),
  ]),
);

expectation.done();
```

_Nota_: ao usar React 18, a semântica de `waitFor` mudou como indicado acima.

## Leitura adicional

Para dicas adicionais e uma configuração alternativa usando `mock-service-worker`, dê uma olhada [neste artigo do TkDodo sobre Testing React Query](https://tkdodo.eu/blog/testing-react-query).
