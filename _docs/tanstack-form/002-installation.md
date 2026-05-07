---
id: installation
title: Installation
---

O TanStack Form é compatível com diversos frameworks front-end, incluindo React, Vue e Solid. Instale o adaptador correspondente ao seu framework usando o gerenciador de pacotes de sua preferência:

<!-- ::start:tabs variant="package-managers" -->

react: @tanstack/react-form
vue: @tanstack/vue-form
angular: @tanstack/angular-form
solid: @tanstack/solid-form
lit: @tanstack/lit-form
svelte: @tanstack/svelte-form

<!-- ::end:tabs -->

<!-- ::start:framework -->

# React

## Meta-frameworks

Se você está usando um meta-framework, o TanStack Form fornece adaptadores adicionais para facilitar a integração:

- TanStack Start
- Next.js
- Remix

<!-- ::end:framework -->

<!-- ::start:tabs variant="package-manager" -->

react: @tanstack/react-form-start
react: @tanstack/react-form-nextjs
react: @tanstack/react-form-remix

<!-- ::end:tabs -->

<!-- ::start:framework -->

# React

## Devtools

Ferramentas de desenvolvimento estão disponíveis usando o [TanStack Devtools](https://tanstack.com/devtools/latest). Instale o adaptador de devtools para o seu framework como dependência de desenvolvimento para depurar forms e inspecionar o state deles.

# Solid

## Devtools

Ferramentas de desenvolvimento estão disponíveis usando o [TanStack Devtools](https://tanstack.com/devtools/latest). Instale o adaptador de devtools para o seu framework como dependência de desenvolvimento para depurar forms e inspecionar o state deles.

<!-- ::end:framework -->

<!-- ::start:tabs variant="package-manager" -->

react: @tanstack/react-devtools
react: @tanstack/react-form-devtools
solid: @tanstack/solid-devtools
solid: @tanstack/solid-form-devtools

<!-- ::end:tabs -->

> [!NOTE]- Requisitos de Polyfill
> Dependendo do seu ambiente, você pode precisar adicionar polyfills. Se quiser dar suporte a navegadores mais antigos, será necessário transpilar a biblioteca a partir do `node_modules` por conta própria.
