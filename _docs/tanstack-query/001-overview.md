---
id: overview
title: Overview
---

TanStack Query (anteriormente conhecido como React Query) é frequentemente descrito como a biblioteca de fetching de dados que faltava para aplicações web, mas em termos mais técnicos, ele torna o **fetching, caching, sincronização e atualização do state do servidor** nas suas aplicações web algo extremamente simples.

## Motivação

A maioria dos frameworks web principais **não** vem com uma forma opinativa de fazer fetching ou atualizar dados de maneira holística. Por causa disso, os desenvolvedores acabam construindo meta-frameworks que encapsulam opiniões rígidas sobre fetching de dados, ou inventam suas próprias formas de buscar dados. Isso geralmente significa juntar state baseado em components e efeitos colaterais, ou usar bibliotecas de gerenciamento de state mais genéricas para armazenar e fornecer dados assíncronos em suas aplicações.

Embora a maioria das bibliotecas tradicionais de gerenciamento de state sejam ótimas para trabalhar com state do cliente, elas **não são tão boas para trabalhar com state assíncrono ou do servidor**. Isso porque o **state do servidor é totalmente diferente**. Para começar, o state do servidor:

- É persistido remotamente em um local que você pode não controlar ou possuir
- Requer APIs assíncronas para fetching e atualização
- Implica propriedade compartilhada e pode ser alterado por outras pessoas sem o seu conhecimento
- Pode potencialmente ficar "desatualizado" nas suas aplicações se você não tiver cuidado

Uma vez que você compreende a natureza do state do servidor na sua aplicação, **ainda mais desafios surgirão** conforme você avança, por exemplo:

- Caching... (possivelmente a coisa mais difícil de fazer em programação)
- Deduplicação de múltiplas requisições para os mesmos dados em uma única requisição
- Atualização de dados "desatualizados" em segundo plano
- Saber quando os dados estão "desatualizados"
- Refletir atualizações nos dados o mais rápido possível
- Otimizações de performance como paginação e carregamento lazy de dados
- Gerenciamento de memória e garbage collection do state do servidor
- Memoização de resultados de queries com compartilhamento estrutural

Se você não ficou sobrecarregado com essa lista, então isso deve significar que você provavelmente já resolveu todos os seus problemas de state do servidor e merece um prêmio. Porém, se você é como a grande maioria das pessoas, ou ainda não enfrentou todos ou a maioria desses desafios e nós estamos apenas arranhando a superfície!

TanStack Query é sem dúvida uma das _melhores_ bibliotecas para gerenciar state do servidor. Ele funciona incrivelmente bem **direto da caixa, com zero configuração, e pode ser customizado** ao seu gosto conforme sua aplicação cresce.

TanStack Query permite que você vença e supere os desafios e obstáculos complicados do _state do servidor_ e controle os dados da sua aplicação antes que eles comecem a controlar você.

Em uma nota mais técnica, TanStack Query provavelmente vai:

- Ajudar você a remover **muitas** linhas de código complicado e mal compreendido da sua aplicação e substituir por apenas algumas linhas de lógica do TanStack Query
- Tornar sua aplicação mais fácil de manter e mais fácil de construir novas funcionalidades sem se preocupar em conectar novas fontes de dados do state do servidor
- Ter um impacto direto nos seus usuários finais, fazendo sua aplicação parecer mais rápida e responsiva do que nunca
- Potencialmente ajudar você a economizar largura de banda e aumentar a performance de memória

[//]: # "Example"

## Chega de conversa, me mostre código!

No exemplo abaixo, você pode ver o TanStack Query na sua forma mais básica e simples sendo usado para buscar as estatísticas do GitHub para o próprio projeto TanStack Query no GitHub:

[Abrir no StackBlitz](https://stackblitz.com/github/TanStack/query/tree/main/examples/react/simple)

```tsx
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Example />
    </QueryClientProvider>
  );
}

function Example() {
  const { isPending, error, data } = useQuery({
    queryKey: ["repoData"],
    queryFn: () =>
      fetch("https://api.github.com/repos/TanStack/query").then((res) =>
        res.json(),
      ),
  });

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.description}</p>
      <strong>👀 {data.subscribers_count}</strong>{" "}
      <strong>✨ {data.stargazers_count}</strong>{" "}
      <strong>🍴 {data.forks_count}</strong>
    </div>
  );
}
```

[//]: # "Example"
[//]: # "Materials"

## Você está convencido, e agora?

- Considere fazer o curso oficial [TanStack Query Course](https://query.gg?s=tanstack) (ou comprar para toda a sua equipe!)
- Aprenda TanStack Query no seu próprio ritmo com nosso incrível e detalhado [Guia Passo a Passo](./installation.md) e [Referência da API](./reference/useQuery.md)
- Veja o artigo [Por que Você Quer React Query](https://tkdodo.eu/blog/why-you-want-react-query).

[//]: # "Materials"
