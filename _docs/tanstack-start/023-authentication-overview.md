---
id: authentication-overview
title: Authentication
---

## Autenticacao vs Autorizacao

- **Autenticacao**: Quem e este usuario? (Login/logout, verificacao de identidade)
- **Autorizacao**: O que este usuario pode fazer? (Permissoes, roles, controle de acesso)

## Visao Geral da Arquitetura

### Modelo de Autenticacao Full-Stack

**Lado do Servidor (Seguro)**

- Armazenamento e validacao de sessao
- Verificacao de credenciais do usuario
- Operacoes de banco de dados
- Geracao/verificacao de tokens
- Endpoints de API protegidos

**Lado do Cliente (Publico)**

- Gerenciamento de state de autenticacao
- Logica de protecao de route
- Interface de login/logout
- Tratamento de redirecionamentos

**Isomorfico (Ambos)**

- Route loaders verificando state de autenticacao
- Logica de validacao compartilhada
- Acesso a dados de perfil do usuario

### Padroes de Gerenciamento de Sessao

**Cookies HTTP-Only (Recomendado)**

- Abordagem mais segura - nao acessivel via JavaScript
- Manuseio automatico pelo navegador
- Protecao CSRF integrada com `sameSite`
- Melhor para aplicacoes web tradicionais

**Tokens JWT**

- Autenticacao stateless
- Bom para aplicacoes API-first
- Requer manuseio cuidadoso para evitar vulnerabilidades XSS
- Considere rotacao de refresh token

**Sessoes do Lado do Servidor**

- Controle centralizado de sessao
- Facil de revogar sessoes
- Requer armazenamento de sessao (banco de dados, Redis)
- Bom para aplicacoes que requerem controle imediato de sessao

### Arquitetura de Protecao de Route

**Padrao de Layout Route (Recomendado)**

- Proteja subarvores inteiras de route com layout routes pai
- Logica de autenticacao centralizada
- Protecao automatica para todas as routes filhas
- Separacao limpa entre routes autenticadas vs publicas

**Protecao em Nivel de Component**

- Rendering condicional dentro de components
- Controle mais granular sobre estados da UI
- Bom para conteudo misto publico/privado na mesma route
- Requer manuseio cuidadoso para prevenir mudancas de layout

**Guards de Server Function**

- Validacao do lado do servidor antes de executar operacoes sensiveis
- Funciona junto com protecao em nivel de route
- Essencial para seguranca de API independente da protecao do lado do cliente

### Padroes de Gerenciamento de State

**State Orientado pelo Servidor (Recomendado)**

- State de autenticacao obtido do servidor em cada requisicao
- Sempre atualizado com o state do servidor
- Funciona perfeitamente com SSR
- Melhor seguranca - servidor e a fonte da verdade

**State Baseado em Context**

- Gerenciamento de state de autenticacao no lado do cliente
- Bom para provedores de autenticacao de terceiros (Auth0, Firebase)
- Requer sincronizacao cuidadosa com o state do servidor
- Considere para aplicacoes altamente interativas client-first

**Abordagem Hibrida**

- State inicial do servidor, atualizacoes no lado do cliente
- Equilibrio entre seguranca e UX
- Validacao periodica do lado do servidor

## Opcoes de Autenticacao

### 🏢 Solucoes Parceiras

- **[WorkOS](https://workos.com)**
- **[Clerk](https://clerk.dev)**

### 🛠️ Autenticacao DIY

Construa seu proprio sistema de autenticacao usando server functions e gerenciamento de sessao do TanStack Start:

- **Controle Total**: Customizacao completa sobre o fluxo de autenticacao
- **Server Functions**: Logica de autenticacao segura no servidor
- **Gerenciamento de Sessao**: Tratamento de sessao integrado com cookies HTTP-only
- **Seguranca de Tipos**: Seguranca de tipos de ponta a ponta para o state de autenticacao

### 🌐 Outras Excelentes Opcoes

**Solucoes Open Source e Comunidade:**

- **[Better Auth](https://www.better-auth.com/)** - Biblioteca de autenticacao moderna, TypeScript-first
- **[Auth.js](https://authjs.dev/)** (anteriormente NextAuth.js) - Biblioteca de autenticacao popular para React

**Servicos Hospedados:**

- **[Supabase Auth](https://supabase.com/auth)** - Alternativa open source ao Firebase com autenticacao integrada
- **[Auth0](https://auth0.com/)** - Plataforma de autenticacao estabelecida com recursos extensivos
- **[Firebase Auth](https://firebase.google.com/docs/auth)** - Servico de autenticacao do Google

## Solucoes Parceiras

### WorkOS - Autenticacao Empresarial

<a href="https://workos.com/" alt="WorkOS Logo">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/tanstack/tanstack.com/main/src/images/workos-white.svg" width="280">
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/tanstack/tanstack.com/main/src/images/workos-black.svg" width="280">
    <img alt="WorkOS logo" src="https://raw.githubusercontent.com/tanstack/tanstack.com/main/src/images/workos-black.svg" width="280">
  </picture>
</a>

- **Single Sign-On (SSO)** - Integracoes SAML, OIDC e OAuth
- **Directory Sync** - Provisionamento SCIM com Active Directory e Google Workspace
- **Autenticacao Multi-fator** - Opcoes de seguranca de nivel empresarial
- **Pronto para Conformidade** - Compativel com SOC 2, GDPR e CCPA

[Visite o WorkOS →](https://workos.com/) | [Ver exemplo →](https://github.com/TanStack/router/tree/main/examples/react/start-workos)

### Clerk - Plataforma Completa de Autenticacao

<a href="https://go.clerk.com/wOwHtuJ" alt="Clerk Logo">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/tanstack/tanstack.com/main/src/images/clerk-logo-dark.svg" width="280">
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/tanstack/tanstack.com/main/src/images/clerk-logo-light.svg" width="280">
    <img alt="Clerk logo" src="https://raw.githubusercontent.com/tanstack/tanstack.com/main/src/images/clerk-logo-light.svg" width="280">
  </picture>
</a>

- **Components de UI Prontos para Uso** - Login, cadastro, perfil de usuario e gerenciamento de organizacao
- **Logins Sociais** - Google, GitHub, Discord e mais de 20 provedores
- **Autenticacao Multi-fator** - SMS, TOTP e codigos de backup
- **Organizacoes e Times** - Suporte integrado para aplicacoes baseadas em times

[Visite o Clerk →](https://go.clerk.com/wOwHtuJ) | [Cadastre-se gratis →](https://go.clerk.com/PrSDXti) | [Ver exemplo →](https://github.com/TanStack/router/tree/main/examples/react/start-clerk-basic)

## Exemplos

**Solucoes Parceiras:**

- [Integracao com Clerk](https://github.com/TanStack/router/tree/main/examples/react/start-clerk-basic)
- [Integracao com WorkOS](https://github.com/TanStack/router/tree/main/examples/react/start-workos)

**Implementacoes DIY:**

- [Autenticacao Basica com Prisma](https://github.com/TanStack/router/tree/main/examples/react/start-basic-auth)
- [Supabase Auth](https://github.com/TanStack/router/tree/main/examples/react/start-supabase-basic)

**Exemplos do Lado do Cliente:**

- [Autenticacao Basica](https://github.com/TanStack/router/tree/main/examples/react/authenticated-routes)
- [Firebase Auth](https://github.com/TanStack/router/tree/main/examples/react/authenticated-routes-firebase)

## Guia de Decisao de Arquitetura

### Escolhendo uma Abordagem de Autenticacao

**Solucoes Parceiras:**

- Foque na logica de negocios principal
- Recursos empresariais (SSO, conformidade)
- Seguranca e atualizacoes gerenciadas
- Components de UI pre-construidos

**Solucoes OSS:**

- Desenvolvimento orientado pela comunidade
- Customizacoes especificas
- Solucoes auto-hospedadas
- Evitar vendor lock-in

**Implementacao DIY:**

- Controle completo sobre o fluxo de autenticacao
- Requisitos de seguranca customizados
- Necessidades de logica de negocios especificas
- Propriedade total dos dados de autenticacao

### Consideracoes de Seguranca

- Use HTTPS em producao
- Use cookies HTTP-only quando possivel
- Valide todas as entradas no servidor
- Mantenha segredos em funcoes somente do servidor
- Implemente rate limiting para endpoints de autenticacao
- Use protecao CSRF para envios de formularios

## Proximos Passos

- **Solucoes parceiras** → [Clerk](https://go.clerk.com/wOwHtuJ) ou [WorkOS](https://workos.com/)
- **Implementacao DIY** → [Guia de Autenticacao](./authentication.md)
- **Exemplos** → [Implementacoes funcionais](https://github.com/TanStack/router/tree/main/examples/react)

## Recursos

**Guias de Implementacao:**

- [Padroes de Autenticacao](./authentication.md)
- [Guia de Autenticacao do Router](/router/latest/docs/framework/react/guide/authenticated-routes.md)

**Conceitos Fundamentais:**

- [Modelo de Execucao](./execution-model.md)
- [Server Functions](./server-functions.md)

**Tutoriais Passo a Passo:**

- [Guias How-to do Router](/router/latest/docs/framework/react/how-to/README.md#authentication)
