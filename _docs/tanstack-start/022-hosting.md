---
id: hosting
title: Hosting
---

Hosting e o processo de fazer deploy da sua aplicacao na internet para que os usuarios possam acessa-la. Esta e uma parte critica de qualquer projeto de desenvolvimento web, garantindo que sua aplicacao esteja disponivel para o mundo. O TanStack Start e construido sobre o Vite, uma poderosa plataforma de desenvolvimento/build que nos permite tornar possivel fazer deploy da sua aplicacao em qualquer provedor de hosting.

## O que devo usar?

O TanStack Start e **projetado para funcionar com qualquer provedor de hosting**, entao se voce ja tem um provedor de hosting em mente, pode fazer deploy da sua aplicacao la usando as APIs full-stack fornecidas pelo TanStack Start.

No entanto, como hosting e um dos aspectos mais cruciais de performance, confiabilidade e escalabilidade da sua aplicacao, recomendamos usar um dos nossos **Parceiros Oficiais de Hosting**: [Cloudflare](https://www.cloudflare.com?utm_source=tanstack), [Netlify](https://www.netlify.com?utm_source=tanstack) ou [Railway](https://railway.com?utm_source=tanstack).

## Deploy

Depois de escolher um alvo de deploy, voce pode seguir as diretrizes de deploy abaixo para fazer deploy da sua aplicacao TanStack Start no provedor de hosting de sua escolha:

- [`cloudflare-workers`](#cloudflare-workers--official-partner): Deploy no Cloudflare Workers
- [`netlify`](#netlify--official-partner): Deploy no Netlify
- [`railway`](#railway--official-partner): Deploy no Railway
- [`nitro`](#nitro): Deploy usando Nitro
- [`vercel`](#vercel): Deploy no Vercel
- [`node-server`](#nodejs--docker): Deploy em um servidor Node.js
- [`bun`](#bun): Deploy em um servidor Bun
- [`appwrite-sites`](#appwrite-sites): Deploy no Appwrite Sites
- ... e mais por vir!

### Cloudflare Workers ⭐ _Parceiro Oficial_

<a href="https://www.cloudflare.com?utm_source=tanstack" alt="Cloudflare Logo">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/tanstack/tanstack.com/main/src/images/cloudflare-white.svg" width="280">
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/tanstack/tanstack.com/main/src/images/cloudflare-black.svg" width="280">
    <img alt="Cloudflare logo" src="https://raw.githubusercontent.com/tanstack/tanstack.com/main/src/images/cloudflare-black.svg" width="280">
  </picture>
</a>

Ao fazer deploy no Cloudflare Workers, voce precisara completar alguns passos extras antes que seus usuarios possam comecar a usar seu app.

1. Instale `@cloudflare/vite-plugin` e `wrangler`

```bash
pnpm add -D @cloudflare/vite-plugin wrangler
```

2. Adicione o plugin do Cloudflare ao seu arquivo `vite.config.ts`

```ts
// vite.config.ts
import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import viteReact from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tanstackStart(),
    viteReact(),
  ],
});
```

3. Adicione um arquivo de configuracao `wrangler.jsonc`

```json
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "tanstack-start-app",
  "compatibility_date": "2025-09-02",
  "compatibility_flags": ["nodejs_compat"],
  "main": "@tanstack/react-start/server-entry"
}
```

4. Modifique os scripts no seu arquivo `package.json`

```json
{
  "scripts": {
    "dev": "vite dev",
    "build": "vite build && tsc --noEmit",
    // ============ 👇 remove this line ============
    "start": "node .output/server/index.mjs",
    // ============ 👇 add these lines ============
    "preview": "vite preview",
    "deploy": "npm run build && wrangler deploy",
    "cf-typegen": "wrangler types"
  }
}
```

5. Faca login com o Wrangler para autenticar com sua conta do Cloudflare.

```bash
npx wrangler login
```

ou se estiver usando pnpm:

```bash
pnpm dlx wrangler login
```

Para verificar o usuario atual use `wrangler whoami`.

6. Deploy

```bash
pnpm run deploy
```

Faca deploy da sua aplicacao no Cloudflare Workers usando o processo de deploy com um clique, e voce esta pronto!

Um exemplo completo do TanStack Start para Cloudflare Workers esta disponivel [aqui](https://github.com/TanStack/router/tree/main/examples/react/start-basic-cloudflare).

### Netlify ⭐ _Parceiro Oficial_

<a href="https://www.netlify.com?utm_source=tanstack" alt="Netlify Logo">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/tanstack/tanstack.com/main/src/images/netlify-dark.svg" width="280">
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/tanstack/tanstack.com/main/src/images/netlify-light.svg" width="280">
    <img alt="Netlify logo" src="https://raw.githubusercontent.com/tanstack/tanstack.com/main/src/images/netlify-light.svg" width="280">
  </picture>
</a>

Instale e adicione o plugin [`@netlify/vite-plugin-tanstack-start`](https://www.npmjs.com/package/@netlify/vite-plugin-tanstack-start), que configura seu build para deploy no Netlify e fornece emulacao completa da plataforma de producao do Netlify em desenvolvimento local:

```bash
npm install --save-dev @netlify/vite-plugin-tanstack-start
# or...
pnpm add --save-dev @netlify/vite-plugin-tanstack-start
# or yarn, bun, etc.
```

```ts
// vite.config.ts
import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import netlify from "@netlify/vite-plugin-tanstack-start"; // ← add this
import viteReact from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    tanstackStart(),
    netlify(), // ← add this (anywhere in the array is fine)
    viteReact(),
  ],
});
```

Por fim, use o [Netlify CLI](https://developers.netlify.com/cli/) para fazer deploy do seu app:

```bash
npx netlify deploy
```

Se este for um novo projeto Netlify, voce sera solicitado a inicializa-lo e as configuracoes de build serao automaticamente configuradas para voce.

Para documentacao mais detalhada, confira a documentacao completa do [TanStack Start no Netlify](https://docs.netlify.com/build/frameworks/framework-setup-guides/tanstack-start/).

#### Configuracao manual

Alternativamente, se voce preferir configuracao manual, pode adicionar um arquivo `netlify.toml` na raiz do seu projeto:

```toml
[build]
  command = "vite build"
  publish = "dist/client"
[dev]
  command = "vite dev"
  port = 3000
```

Ou voce pode definir as configuracoes acima diretamente [no app do Netlify](https://docs.netlify.com/build/configure-builds/overview/#build-settings).

#### Outros metodos de deploy

O Netlify tambem suporta outros metodos de deploy, como [deploy continuo a partir de um repositorio git hospedado no GitHub, GitLab ou outros](https://docs.netlify.com/start/quickstarts/deploy-from-repository/), [comecar a partir de um template](https://docs.netlify.com/start/quickstarts/deploy-from-template/), [fazer deploy ou importar de uma ferramenta de geracao de codigo com IA](https://docs.netlify.com/start/quickstarts/deploy-from-ai-code-generation-tool/) e [mais](https://docs.netlify.com/deploy/create-deploys/).

### Railway ⭐ _Parceiro Oficial_

<a href="https://railway.com?utm_source=tanstack" alt="Railway Logo">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/tanstack/tanstack.com/main/src/images/railway-dark.svg" width="280">
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/tanstack/tanstack.com/main/src/images/railway-light.svg" width="280">
    <img alt="Railway logo" src="https://raw.githubusercontent.com/tanstack/tanstack.com/main/src/images/railway-light.svg" width="280">
  </picture>
</a>

O Railway fornece deploys instantaneos com zero configuracao. Siga as instrucoes de deploy do [`Nitro`](#nitro) e entao faca deploy no Railway:

1. Envie seu codigo para um repositorio no GitHub

2. Conecte seu repositorio ao Railway em [railway.com](https://railway.com?utm_source=tanstack)

3. O Railway ira automaticamente detectar suas configuracoes de build e fazer deploy da sua aplicacao

O Railway fornece automaticamente:

- **Deploys automaticos** a cada push para seu repositorio
- **Bancos de dados integrados** (Postgres, MySQL, Redis, MongoDB)
- **Ambientes de preview** para pull requests
- **HTTPS automatico** e dominios customizados

Para mais detalhes, veja a [documentacao do Railway](https://docs.railway.com).

### Nitro

[Nitro](https://v3.nitro.build/) e uma camada agnostica que permite fazer deploy de aplicacoes TanStack Start em [uma ampla variedade de hostings](https://v3.nitro.build/deploy).

**⚠️ O plugin [`nitro/vite`](https://v3.nitro.build/) integra nativamente com a Vite Environments API como a ferramenta de build subjacente para o TanStack Start. Ainda esta em desenvolvimento ativo e recebe atualizacoes regulares. Por favor, reporte qualquer problema que encontrar com reproducao para que possam ser investigados.**

Instale a versao nightly do nitro especificando o seguinte no seu package.json

```json
"nitro": "npm:nitro-nightly@latest"
```

```tsx
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { defineConfig } from "vite";
import { nitro } from "nitro/vite";
import viteReact from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [tanstackStart(), nitro(), viteReact()],
});
```

#### Dica de Performance: FastResponse

Se voce esta fazendo deploy no Node.js com Nitro (que usa [srvx](https://srvx.h3.dev/) internamente), pode obter uma melhoria de ~5% no throughput substituindo o construtor global `Response` pelo `FastResponse` otimizado do srvx.

Primeiro, instale o srvx:

```bash
npm install srvx
```

Entao adicione isso ao seu server entry point (`src/server.ts`):

```ts
import { FastResponse } from "srvx";
globalThis.Response = FastResponse;
```

Isso funciona porque o `FastResponse` do srvx inclui um caminho otimizado `_toNodeResponse()` que evita o overhead da conversao padrao de Web `Response` para Node.js. Esta otimizacao se aplica apenas a deploys Node.js usando Nitro/h3/srvx.

### Vercel

Siga as instrucoes de deploy do [`Nitro`](#nitro).
Faca deploy da sua aplicacao no Vercel usando o processo de deploy com um clique, e voce esta pronto!

### Node.js / Docker

Siga as instrucoes de deploy do [`Nitro`](#nitro). Use o comando `node` para iniciar sua aplicacao a partir do servidor usando os arquivos de saida do build.

Certifique-se de que os scripts npm `build` e `start` estejam presentes no seu arquivo `package.json`:

```json
    "build": "vite build",
    "start": "node .output/server/index.mjs"
```

Entao voce pode executar o seguinte comando para fazer build da sua aplicacao:

```sh
npm run build
```

Voce pode iniciar sua aplicacao executando:

```sh
npm run start
```

### Bun

> [!IMPORTANT]
> Atualmente, as diretrizes de deploy especificas do Bun so funcionam com React 19. Se voce esta usando React 18, por favor consulte as diretrizes de deploy do [Node.js](#nodejs--railway--docker).

Certifique-se de que seus pacotes `react` e `react-dom` estejam na versao 19.0.0 ou superior no seu arquivo `package.json`. Se nao, execute o seguinte comando para atualizar os pacotes:

```sh
bun install react@19 react-dom@19
```

Siga as instrucoes de deploy do [`Nitro`](#nitro).
Dependendo de como voce invoca o build, pode ser necessario definir o preset `'bun'` na configuracao do Nitro:

```ts
// vite.config.ts
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { defineConfig } from "vite";
import { nitro } from "nitro/vite";
import viteReact from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [tanstackStart(), nitro({ preset: "bun" }), viteReact()],
});
```

#### Servidor de Producao com Bun

Alternativamente, voce pode usar uma implementacao de servidor customizada que aproveita as APIs nativas do Bun.

Fornecemos uma implementacao de referencia que demonstra uma abordagem para construir um servidor Bun pronto para producao. Este exemplo usa funcoes nativas do Bun para performance otima e inclui recursos como preloading inteligente de assets e gerenciamento de memoria.

**Este e um ponto de partida - sinta-se a vontade para adapta-lo as suas necessidades ou simplifica-lo para seu caso de uso.**

**O que este exemplo demonstra:**

- Servir assets estaticos usando o manuseio nativo de arquivos do Bun
- Estrategia de carregamento hibrida (preload de arquivos pequenos, servir arquivos grandes sob demanda)
- Recursos opcionais como suporte a ETag e compressao Gzip
- Headers de cache prontos para producao

**Configuracao Rapida:**

1. Copie o arquivo [`server.ts`](https://github.com/tanstack/router/blob/main/examples/react/start-bun/server.ts) do repositorio de exemplo para a raiz do seu projeto (ou use-o como inspiracao para sua propria implementacao)

2. Faca build da sua aplicacao:

   ```sh
   bun run build
   ```

3. Inicie o servidor:

   ```sh
   bun run server.ts
   ```

**Configuracao (Opcional):**

A implementacao do servidor de referencia inclui varias opcoes de configuracao opcionais via variaveis de ambiente. Voce pode usa-las como estao, modifica-las ou remover recursos que nao precisa:

```sh
# Basic usage - just works out of the box
bun run server.ts

# Common configurations
PORT=8080 bun run server.ts  # Custom port
ASSET_PRELOAD_VERBOSE_LOGGING=true bun run server.ts  # See what's happening
```

**Variaveis de Ambiente Disponiveis:**

| Variavel                         | Descricao                                          | Padrao                                                                        |
| -------------------------------- | -------------------------------------------------- | ----------------------------------------------------------------------------- |
| `PORT`                           | Porta do servidor                                  | `3000`                                                                        |
| `ASSET_PRELOAD_MAX_SIZE`         | Tamanho maximo de arquivo para preload na memoria (bytes) | `5242880` (5MB)                                                               |
| `ASSET_PRELOAD_INCLUDE_PATTERNS` | Padroes glob separados por virgula para arquivos a incluir | Todos os arquivos                                                             |
| `ASSET_PRELOAD_EXCLUDE_PATTERNS` | Padroes glob separados por virgula para arquivos a excluir | Nenhum                                                                        |
| `ASSET_PRELOAD_VERBOSE_LOGGING`  | Habilitar logging detalhado                        | `false`                                                                       |
| `ASSET_PRELOAD_ENABLE_ETAG`      | Habilitar geracao de ETag                          | `true`                                                                        |
| `ASSET_PRELOAD_ENABLE_GZIP`      | Habilitar compressao Gzip                          | `true`                                                                        |
| `ASSET_PRELOAD_GZIP_MIN_SIZE`    | Tamanho minimo de arquivo para Gzip (bytes)        | `1024` (1KB)                                                                  |
| `ASSET_PRELOAD_GZIP_MIME_TYPES`  | Tipos MIME elegiveis para Gzip                     | `text/,application/javascript,application/json,application/xml,image/svg+xml` |

<details>
<summary>Exemplos de configuracao avancada</summary>

```sh
# Optimize for minimal memory usage
ASSET_PRELOAD_MAX_SIZE=1048576 bun run server.ts

# Preload only critical assets
ASSET_PRELOAD_INCLUDE_PATTERNS="*.js,*.css" \
ASSET_PRELOAD_EXCLUDE_PATTERNS="*.map,vendor-*" \
bun run server.ts

# Disable optional features
ASSET_PRELOAD_ENABLE_ETAG=false \
ASSET_PRELOAD_ENABLE_GZIP=false \
bun run server.ts

# Custom Gzip configuration
ASSET_PRELOAD_GZIP_MIN_SIZE=2048 \
ASSET_PRELOAD_GZIP_MIME_TYPES="text/,application/javascript,application/json" \
bun run server.ts
```

</details>

**Exemplo de Saida:**

```txt
📦 Loading static assets from ./dist/client...
   Max preload size: 5.00 MB

📁 Preloaded into memory:
   /assets/index-a1b2c3d4.js           45.23 kB │ gzip:  15.83 kB
   /assets/index-e5f6g7h8.css           12.45 kB │ gzip:   4.36 kB

💾 Served on-demand:
   /assets/vendor-i9j0k1l2.js          245.67 kB │ gzip:  86.98 kB

✅ Preloaded 2 files (57.68 KB) into memory
🚀 Server running at http://localhost:3000
```

Para um exemplo completo funcionando, confira o [exemplo TanStack Start + Bun](https://github.com/TanStack/router/tree/main/examples/react/start-bun) neste repositorio.

### Appwrite Sites

Ao fazer deploy no [Appwrite Sites](https://appwrite.io/products/sites), voce precisara completar alguns passos:

1. **Crie um app TanStack Start** (ou use um existente)

```bash
npm create @tanstack/start@latest
```

2. **Envie seu projeto para um repositorio no GitHub**

Crie um [repositorio no GitHub](https://github.com/new) e envie seu codigo.

3. **Crie um projeto Appwrite**

Va ate o [Appwrite Cloud](https://cloud.appwrite.io) e cadastre-se se ainda nao o fez, depois crie seu primeiro projeto.

4. **Faca deploy do seu site**

No seu projeto Appwrite, navegue ate a pagina **Sites** na barra lateral. Clique em **Create site**, selecione **Connect a repository**, conecte sua conta do GitHub e selecione seu repositorio.

1. Selecione o **branch de producao** e o **diretorio raiz**
2. Verifique se **TanStack Start** esta selecionado como framework
3. Confirme as configuracoes de build:
   - **Comando de instalacao:** `npm install`
   - **Comando de build:** `npm run build`
   - **Diretorio de saida:** `./dist` (se voce esta usando Nitro v2 ou v3, deve ser `./.output`)

4. Adicione quaisquer **variaveis de ambiente** necessarias
5. Clique em **Deploy**

Apos o deploy bem-sucedido, clique no botao **Visit site** para ver sua aplicacao implantada.
