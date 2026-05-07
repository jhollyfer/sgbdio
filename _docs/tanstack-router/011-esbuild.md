---
title: Installation with Esbuild
---

[//]: # "BundlerConfiguration"

Para usar roteamento baseado em arquivos com o **Esbuild**, você precisará instalar o pacote `@tanstack/router-plugin`.

```sh
npm install -D @tanstack/router-plugin
```

Uma vez instalado, você precisará adicionar o plugin à sua configuração.

```tsx
// esbuild.config.js
import { tanstackRouter } from "@tanstack/router-plugin/esbuild";

export default {
  // ...
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
  ],
};
```

Ou você pode clonar nosso [exemplo Quickstart com Esbuild](https://github.com/TanStack/router/tree/main/examples/react/quickstart-esbuild-file-based) e começar.

Agora que você adicionou o plugin à sua configuração do Esbuild, está tudo pronto para começar a usar roteamento baseado em arquivos com o TanStack Router.

[//]: # "BundlerConfiguration"

## Ignorando o arquivo da route tree gerada

Se o seu projeto está configurado para usar um linter e/ou formatter, você pode querer ignorar o arquivo da route tree gerada. Este arquivo é gerenciado pelo TanStack Router e, portanto, não deve ser alterado pelo seu linter ou formatter.

Aqui estão alguns recursos para ajudar você a ignorar o arquivo da route tree gerada:

- Prettier - [https://prettier.io/docs/en/ignore.html#ignoring-files-prettierignore](https://prettier.io/docs/en/ignore.html#ignoring-files-prettierignore)
- ESLint - [https://eslint.org/docs/latest/use/configure/ignore#ignoring-files](https://eslint.org/docs/latest/use/configure/ignore#ignoring-files)
- Biome - [https://biomejs.dev/reference/configuration/#filesignore](https://biomejs.dev/reference/configuration/#filesignore)

> [!WARNING]
> Se você está usando o VSCode, pode experienciar o arquivo da route tree abrindo inesperadamente (com erros) após renomear uma route.

Você pode evitar isso nas configurações do VSCode marcando o arquivo como somente leitura. Nossa recomendação é também excluí-lo dos resultados de busca e do observador de arquivos com as seguintes configurações:

```json
{
  "files.readonlyInclude": {
    "**/routeTree.gen.ts": true
  },
  "files.watcherExclude": {
    "**/routeTree.gen.ts": true
  },
  "search.exclude": {
    "**/routeTree.gen.ts": true
  }
}
```

Você pode usar essas configurações no nível do usuário ou apenas para um workspace específico criando o arquivo `.vscode/settings.json` na raiz do seu projeto.

## Configuração

Ao usar o Plugin do TanStack Router com Esbuild para roteamento baseado em arquivos, ele vem com alguns padrões sensatos que devem funcionar para a maioria dos projetos:

```json
{
  "routesDirectory": "./src/routes",
  "generatedRouteTree": "./src/routeTree.gen.ts",
  "routeFileIgnorePrefix": "-",
  "quoteStyle": "single"
}
```

Se esses padrões funcionam para o seu projeto, você não precisa configurar nada! No entanto, se precisar personalizar a configuração, pode fazê-lo editando o objeto de configuração passado para a função `tanstackRouter`.

Você pode encontrar todas as opções de configuração disponíveis na [Referência da API de Roteamento Baseado em Arquivos](../../../api/file-based-routing.md).
