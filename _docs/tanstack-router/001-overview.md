---
title: Overview
---

**TanStack Router é um router para construir aplicações React e Solid**. Algumas de suas funcionalidades incluem:

- Suporte a TypeScript 100% inferido
- Navegação typesafe
- Routing aninhado e layout routes (com layouts sem path)
- Route Loaders embutidos com SWR Caching
- Projetado para caches de dados do lado do cliente (TanStack Query, SWR, etc.)
- Prefetch automático de route
- Elementos de route assíncronos e error boundaries
- Geração de Route baseada em arquivo
- APIs de gerenciamento de state de Search Params typesafe com JSON-first
- Validação de Schema de Path e Search Parameter
- APIs de navegação por Search Param
- Suporte a parser/serializer customizado de Search Param
- Search param middleware
- Route matching/loading middleware

Para começar rapidamente, vá para a próxima página. Para uma explicação mais detalhada, aperte os cintos enquanto eu te coloco a par de tudo!

## "Uma Bifurcação no Route"

Usar um router para construir aplicações é amplamente considerado indispensável e geralmente é uma das primeiras escolhas que você fará na sua stack de tecnologia.

## Por que TanStack Router?

O TanStack Router entrega as mesmas expectativas fundamentais de outros routers que você já espera:

- Routes aninhados, layout routes, routes agrupados
- Routing baseado em arquivo
- Carregamento paralelo de dados
- Prefetching
- URL Path Params
- Error Boundaries e tratamento de erros
- SSR
- Route Masking

E também entrega algumas funcionalidades novas que elevam o padrão:

- Suporte a TypeScript 100% inferido
- Navegação typesafe
- SWR Caching embutido para loaders
- Projetado para caches de dados do lado do cliente (TanStack Query, SWR, etc.)
- APIs de gerenciamento de state de Search Params typesafe com JSON-first
- Validação de Schema de Path e Search Parameter
- APIs de navegação por Search Parameter
- Suporte a parser/serializer customizado de Search Param
- Search param middleware
- Route Context herdado
- Routing misto baseado em arquivo e baseado em código

Vamos mergulhar em alguns dos mais importantes com mais detalhes!

## Suporte a TypeScript 100% Inferido

Tudo hoje em dia é escrito "em TypeScript" ou, no mínimo, oferece definições de tipo que são um verniz sobre a funcionalidade em tempo de execução, mas poucos pacotes no ecossistema realmente projetam suas APIs com TypeScript em mente. Então, embora seja bom que seu router faça auto-complete dos campos de opções e capture alguns erros de digitação de propriedade/método aqui e ali, há muito mais a ser obtido.

- O TanStack Router tem plena consciência de todos os seus routes e suas configurações em qualquer ponto do seu código. Isso inclui o path, path params, search params, context e qualquer outra configuração que você tenha fornecido. Em última análise, isso significa que você pode navegar para qualquer route na sua aplicação com 100% de segurança de tipo e confiança de que sua chamada de link ou navigate será bem-sucedida.
- O TanStack Router fornece inferência de tipo sem perdas. Ele usa inúmeros parâmetros de tipo genéricos para impor e propagar qualquer informação de tipo que você forneça ao longo do resto de sua API e, por fim, da sua aplicação. Nenhum outro router oferece esse nível de segurança de tipo e confiança para o desenvolvedor.

O que tudo isso significa para você?

- Desenvolvimento mais rápido de funcionalidades com auto-complete e dicas de tipo
- Refatorações mais seguras e rápidas
- Confiança de que seu código funcionará como esperado

## Search Parameters de Primeira Classe

Search parameters são frequentemente um pensamento posterior, tratados como uma caixa preta de strings (ou string) que você pode parsear e atualizar, mas não muito mais. Soluções existentes **não** são type-safe também, adicionando à cautela necessária para lidar com eles. Mesmo os frameworks e routers mais "modernos" deixam para você descobrir como gerenciar esse state. Às vezes eles parseiam a string de busca em um objeto para você, ou às vezes você fica por conta própria com `URLSearchParams`.

Vamos dar um passo atrás e lembrar que **search params são o gerenciador de state mais poderoso em toda a sua aplicação.** Eles são globais, serializáveis, favoritáveis e compartilháveis, tornando-os o lugar perfeito para armazenar qualquer tipo de state que precise sobreviver a um refresh de página ou um compartilhamento social.

Para fazer jus a essa responsabilidade, search parameters são cidadãos de primeira classe no TanStack Router. Embora ainda baseado em URLSearchParams padrão, o TanStack Router usa um poderoso parser/serializer para gerenciar estruturas de dados mais profundas e complexas nos seus search params, tudo mantendo-os type-safe e fáceis de trabalhar.

**É como ter `useState` direto na URL!**

Search parameters são:

- Automaticamente parseados e serializados como JSON
- Validados e tipados
- Herdados de routes pais
- Acessíveis em loaders, components e hooks
- Facilmente modificados com o hook useSearch, Link, navigate e as APIs router.navigate
- Customizáveis com filtros de busca e middleware personalizados
- Subscritos via selectors de search param de granularidade fina para re-renders eficientes

Uma vez que você comece a usar os search parameters do TanStack Router, vai se perguntar como viveu sem eles.

## Caching Embutido e Carregamento de Dados Amigável

Carregamento de dados é uma parte crítica de qualquer aplicação e, embora a maioria dos routers existentes ofereça alguma forma de APIs de carregamento de dados críticos, eles frequentemente ficam aquém quando se trata de caching e gerenciamento do ciclo de vida dos dados. Soluções existentes sofrem de alguns problemas comuns:

- Nenhum caching. Os dados estão sempre frescos, mas seus usuários ficam esperando que dados acessados frequentemente carreguem repetidamente.
- Caching excessivamente agressivo. Os dados são cacheados por tempo demais, levando a dados stale e uma experiência ruim para o usuário.
- Estratégias e APIs de invalidação brutas. Os dados podem ser invalidados com muita frequência, levando a requisições de rede desnecessárias e desperdício de recursos, ou você pode não ter nenhum controle granular sobre quando os dados são invalidados.

O TanStack Router resolve esses problemas com uma abordagem de duas frentes para caching e carregamento de dados:

### Cache Embutido

O TanStack Router fornece uma camada de caching leve e embutida que funciona perfeitamente com o Router. Essa camada de caching é vagamente baseada no TanStack Query, mas com menos funcionalidades e uma superfície de API muito menor. Como o TanStack Query, padrões sensatos mas poderosos garantem que seus dados sejam cacheados para reutilização, invalidados quando necessário e coletados pelo garbage collection quando não estão em uso. Ele também fornece uma API simples para invalidar o cache manualmente quando necessário.

### APIs de Ciclo de Vida de Dados Flexíveis e Poderosas

O TanStack Router é projetado com uma API de carregamento de dados flexível e poderosa que se integra mais facilmente com bibliotecas de fetching de dados existentes como TanStack Query, SWR, Apollo, Relay, ou até mesmo sua própria solução customizada de fetching de dados. APIs configuráveis como `context`, `beforeLoad`, `loaderDeps` e `loader` trabalham em conjunto para facilitar a definição de dependências declarativas de dados, prefetch de dados e gerenciamento do ciclo de vida de uma fonte de dados externa com facilidade.

## Route Context Herdado

O context do router e route do TanStack Router é uma funcionalidade poderosa que permite definir context específico de um route que é então herdado por todos os routes filhos. Até mesmo o router e os routes raiz podem fornecer context. O context pode ser construído tanto síncrona quanto assincronamente, e pode ser usado para compartilhar dados, configuração ou até funções entre routes e configurações de route. Isso é especialmente útil para cenários como:

- Autenticação e Autorização
- Fetching e preloading de dados híbrido SSR/CSR
- Tematização
- Singletons e utilitários globais
- Currying ou aplicação parcial entre os estágios de preloading, loading e rendering

Além disso, o que seria route context se não fosse type-safe? O route context do TanStack Router é totalmente type-safe e inferido sem custo para você.

## Routing Baseado em Arquivo e/ou Baseado em Código

O TanStack Router suporta routing baseado em arquivo e baseado em código ao mesmo tempo. Essa flexibilidade permite que você escolha a abordagem que melhor se adapta às necessidades do seu projeto.

A abordagem de routing baseado em arquivo do TanStack Router é exclusivamente voltada para o usuário. A configuração de route é gerada para você pelo plugin Vite ou pelo TanStack Router CLI, deixando o uso do código gerado por sua conta! Isso significa que você sempre tem total controle sobre seus routes e router, mesmo que use routing baseado em arquivo.

## Agradecimentos

O TanStack Router se baseia em conceitos e padrões popularizados por muitos outros projetos OSS, incluindo:

- [TRPC](https://trpc.io/)
- [Remix](https://remix.run)
- [Chicane](https://swan-io.github.io/chicane/)
- [Next.js](https://nextjs.org)

Reconhecemos o investimento, risco e pesquisa que foram dedicados ao seu desenvolvimento, mas estamos animados em elevar ainda mais o padrão que eles estabeleceram.

## Vamos lá!

Visão geral suficiente, há muito mais para fazer com o TanStack Router. Clique no botão de próximo e vamos começar!
