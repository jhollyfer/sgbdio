---
id: databases
title: Databases
---

Bancos de dados estao no nucleo de qualquer aplicacao dinamica, fornecendo a infraestrutura necessaria para armazenar, recuperar e gerenciar dados. O TanStack Start facilita a integracao com uma variedade de bancos de dados, oferecendo uma abordagem flexivel para gerenciar a camada de dados da sua aplicacao.

## O que devo usar?

O TanStack Start e **projetado para funcionar com qualquer provedor de banco de dados**, entao se voce ja tem um sistema de banco de dados preferido, pode integra-lo ao TanStack Start usando as APIs full-stack fornecidas. Seja trabalhando com SQL, NoSQL ou outros tipos de bancos de dados, o TanStack Start pode atender suas necessidades.

## Quao simples e usar um banco de dados com o TanStack Start?

Usar um banco de dados com o TanStack Start e tao simples quanto chamar o adapter/client/driver/servico do seu banco de dados a partir de uma server function ou server route do TanStack Start.

Aqui esta um exemplo abstrato de como voce pode se conectar a um banco de dados e ler/escrever nele:

```tsx
import { createServerFn } from "@tanstack/react-start";

const db = createMyDatabaseClient();

export const getUser = createServerFn().handler(async ({ context }) => {
  const user = await db.getUser(context.userId);
  return user;
});

export const createUser = createServerFn({ method: "POST" }).handler(
  async ({ data }) => {
    const user = await db.createUser(data);
    return user;
  },
);
```

Isso e obviamente simplificado, mas demonstra que voce pode usar literalmente qualquer provedor de banco de dados com o TanStack Start desde que consiga chama-lo a partir de uma server function ou server route.

## Provedores de Banco de Dados Recomendados

Embora o TanStack Start seja projetado para funcionar com qualquer provedor de banco de dados, recomendamos fortemente considerar um dos nossos provedores parceiros verificados [Neon](https://neon.tech?utm_source=tanstack) ou [Convex](https://convex.dev?utm_source=tanstack). Eles foram verificados pelo TanStack para corresponder aos nossos padroes de qualidade, abertura e performance e sao ambas excelentes escolhas para suas necessidades de banco de dados.

## O que e o Neon?

<a href="https://neon.tech?utm_source=tanstack" alt="Neon Logo">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/tanstack/tanstack.com/main/src/images/neon-dark.svg" width="280">
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/tanstack/tanstack.com/main/src/images/neon-light.svg" width="280">
    <img alt="Neon logo" src="https://raw.githubusercontent.com/tanstack/tanstack.com/main/src/images/neon-light.svg" width="280">
  </picture>
</a>

O Neon e um PostgreSQL serverless totalmente gerenciado com um plano gratuito generoso. Ele separa armazenamento e computacao para oferecer auto-scaling, branching e armazenamento ilimitado. Com o Neon, voce obtem todo o poder e confiabilidade do PostgreSQL combinado com capacidades modernas de nuvem, tornando-o perfeito para aplicacoes TanStack Start.

Recursos-chave que fazem o Neon se destacar:

- PostgreSQL serverless que escala automaticamente
- Branching de banco de dados para desenvolvimento e testes
- Connection pooling integrado
- Restauracao point-in-time
- Editor SQL baseado na web
- Armazenamento ilimitado
  <br />
  <br />
- Para saber mais sobre o Neon, visite o [site do Neon](https://neon.tech?utm_source=tanstack)
- Para se cadastrar, visite o [painel do Neon](https://console.neon.tech/signup?utm_source=tanstack)

## O que e o Convex?

<a href="https://convex.dev?utm_source=tanstack" alt="Convex Logo">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/tanstack/tanstack.com/main/src/images/convex-white.svg" width="280">
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/tanstack/tanstack.com/main/src/images/convex-color.svg" width="280">
    <img alt="Convex logo" src="https://raw.githubusercontent.com/tanstack/tanstack.com/main/src/images/convex-color.svg" width="280">
  </picture>
</a>

O Convex e uma poderosa plataforma de banco de dados serverless que simplifica o processo de gerenciar os dados da sua aplicacao. Com o Convex, voce pode construir aplicacoes full-stack sem a necessidade de gerenciar manualmente servidores de banco de dados ou escrever queries complexas. O Convex fornece um backend de dados em tempo real, escalavel e transacional que se integra perfeitamente com o TanStack Start, tornando-o uma excelente escolha para aplicacoes web modernas.

O modelo de dados declarativo e a resolucao automatica de conflitos do Convex garantem que sua aplicacao permaneca consistente e responsiva, mesmo em escala. Ele e projetado para ser amigavel ao desenvolvedor, com foco em simplicidade e produtividade.

- Para saber mais sobre o Convex, visite o [site do Convex](https://convex.dev?utm_source=tanstack)
- Para se cadastrar, visite o [painel do Convex](https://dashboard.convex.dev/signup?utm_source=tanstack)

## O que e o Prisma Postgres?

<a href="https://www.prisma.io?utm_source=tanstack&via=tanstack" alt="Prisma Logo">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/tanstack/tanstack.com/main/src/images/prisma-dark.svg" width="280">
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/tanstack/tanstack.com/main/src/images/prisma-light.svg" width="280">
    <img alt="Prisma logo" src="https://raw.githubusercontent.com/tanstack/tanstack.com/main/src/images/prisma-light.svg" width="280">
  </picture>
</a>

Postgres Instantaneo, Zero Configuracao: Obtenha um banco de dados Postgres pronto para producao em segundos, depois volte direto para o codigo. Nos cuidamos de conexoes, escalabilidade e ajustes para que seu fluxo nunca seja interrompido. Se integra perfeitamente com o TanStack Start.

- Otimizado para edge: Roteamento por regiao local significa menor latencia e menos saltos. Ate queries complexas sao uma unica viagem rapida.
- Se adapta a sua stack: Funciona com seus frameworks, bibliotecas e ferramentas para uma DX suave.
- Interface web: Uma interface hospedada para inspecionar, gerenciar e consultar dados com seu time.
- Auto-scaling: Cresce de zero a milhoes de usuarios sem cold starts ou ajuste manual.
- Isolamento unikernel: Cada banco de dados roda como seu proprio unikernel para seguranca, velocidade e eficiencia.
  <br />
  <br />
- Para saber mais sobre o Prisma Postgres, visite o [site do Prisma](https://www.prisma.io?utm_source=tanstack&via=tanstack)
- Para se cadastrar, visite o [Console do Prisma](https://console.prisma.io/sign-up?utm_source=tanstack&via=tanstack)

## Documentacao e APIs

A documentacao para integrar diferentes bancos de dados com o TanStack Start esta chegando em breve! Enquanto isso, fique de olho nos nossos exemplos e guia para aprender como aproveitar totalmente sua camada de dados em toda a sua aplicacao TanStack Start.
