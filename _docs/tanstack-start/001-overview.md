---
id: overview
title: TanStack Start Overview
---

> [!NOTE]
> TanStack Start esta atualmente no estagio de **Release Candidate**! Isso significa que ele e considerado feature-complete e sua API e considerada estavel.
> **Isso nao significa que esta livre de bugs ou problemas, e por isso convidamos voce a experimenta-lo e fornecer feedback!**
> O caminho ate a v1 provavelmente sera rapido, entao nao espere muito para experimenta-lo!

TanStack Start e um framework full-stack para React alimentado pelo TanStack Router. Ele oferece SSR de documento completo, streaming, server functions, bundling e muito mais. Gracas ao [Vite](https://vite.dev/), ele esta pronto para desenvolver e fazer deploy em qualquer provedor de hospedagem ou runtime que voce quiser!

## Dependencias

TanStack Start e construido sobre duas tecnologias principais:

- **[TanStack Router](https://tanstack.com/router)**: Um router type-safe para construir aplicacoes web com recursos avancados como rotas aninhadas, search params e carregamento de dados
- **[Vite](https://vite.dev/)**: Uma ferramenta de build moderna que oferece desenvolvimento rapido com hot module replacement e builds de producao otimizados

## Devo usar o TanStack Start ou apenas o TanStack Router?

90% de qualquer framework geralmente se resume ao router, e o TanStack Start nao e diferente. **TanStack Start depende 100% do TanStack Router para seu sistema de rotas.** Alem dos recursos incriveis do TanStack Router, o Start habilita recursos ainda mais poderosos:

- **SSR de documento completo** - Rendering no lado do servidor para melhor performance e SEO
- **Streaming** - Carregamento progressivo de paginas para melhor experiencia do usuario
- **Server Routes e API Routes** - Construa endpoints de backend junto com seu frontend
- **Server Functions** - RPCs type-safe entre cliente e servidor
- **Middleware e Context** - Manipulacao poderosa de requisicao/resposta e injecao de dados
- **Bundling Full-Stack** - Builds otimizados para codigo do cliente e do servidor
- **Deploy Universal** - Faca deploy em qualquer provedor de hospedagem compativel com Vite
- **Type Safety de ponta a ponta** - Suporte completo a TypeScript em toda a stack

Dito isso, se voce **tem certeza absoluta** de que nao precisara de nenhum dos recursos acima, entao voce pode considerar usar apenas o TanStack Router, que ainda e um upgrade poderoso e type-safe de roteamento SPA em comparacao com outros routers e frameworks.

## Existem limitacoes?

A unica limitacao relevante e que o TanStack Start atualmente nao suporta React Server Components, **mas estamos trabalhando ativamente na integracao e esperamos suporta-los em um futuro proximo.**

Fora isso, o TanStack Start oferece a mesma capacidade de outros frameworks full-stack como Next.js, Remix, etc., com ainda mais recursos e uma experiencia de desenvolvedor mais poderosa.

## Como o TanStack Start e financiado?

TanStack e 100% open source, gratuito para uso e sempre sera. Ele e construido e mantido por uma comunidade extremamente talentosa e dedicada de desenvolvedores e engenheiros de software. TanStack.com (tambem open source) e de propriedade da TanStack LLC, uma empresa privada, 100% bootstrapped e autofinanciada. Nao somos financiados por venture capital e nunca buscamos investidores. Para apoiar o desenvolvimento do TanStack Start e outras bibliotecas TanStack, o TanStack.com faz parceria com [essas empresas incriveis](https://tanstack.com/partners?status=active&libraries=%5B%22start%22%5D) que oferecem suporte financeiro e recursos para nos ajudar a continuar construindo a melhor experiencia possivel para desenvolvedores da comunidade web:

<iframe src="https://tanstack.com/partners-embed" style="aspect-ratio: 1/2; width: 100%;"></iframe>

## Pronto para comecar?

Va para a proxima pagina para aprender como instalar o TanStack Start e criar sua primeira aplicacao!
