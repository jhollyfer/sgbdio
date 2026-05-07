---
id: path-aliases
title: Path Aliases
---

Path aliases são um recurso útil do TypeScript que permite definir um atalho para um caminho que pode estar distante na estrutura de diretórios do seu projeto. Isso pode ajudar você a evitar imports relativos longos no seu código e facilitar a refatoração da estrutura do seu projeto. É especialmente útil para evitar imports relativos extensos no seu código.

Por padrão, o TanStack Start não inclui path aliases. No entanto, você pode adicioná-los facilmente ao seu projeto atualizando o arquivo `tsconfig.json` na raiz do projeto e adicionando a seguinte configuração:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "~/*": ["./src/*"]
    }
  }
}
```

Neste exemplo, definimos o path alias `~/*` que mapeia para o diretório `./src/*`. Isso significa que agora você pode importar arquivos do diretório `src` usando o prefixo `~`.

Após atualizar seu arquivo `tsconfig.json`, você precisará instalar o plugin `vite-tsconfig-paths` para habilitar os path aliases no seu projeto TanStack Start. Você pode fazer isso executando o seguinte comando:

```sh
npm install -D vite-tsconfig-paths
```

Agora, você precisará atualizar seu arquivo `vite.config.ts` para incluir o seguinte:

```ts
// vite.config.ts
import { defineConfig } from "vite";
import viteTsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  vite: {
    plugins: [
      // this is the plugin that enables path aliases
      viteTsConfigPaths({
        projects: ["./tsconfig.json"],
      }),
    ],
  },
});
```

Uma vez que essa configuração estiver concluída, você poderá importar arquivos usando o path alias assim:

```ts
// app/routes/posts/$postId/edit.tsx
import { Input } from "~/components/ui/input";

// instead of

import { Input } from "../../../components/ui/input";
```
