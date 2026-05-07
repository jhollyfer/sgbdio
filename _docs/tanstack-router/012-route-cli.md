---
title: Installation with Router CLI
---

> [!WARNING]
> Você só deve usar o TanStack Router CLI se não estiver usando um bundler suportado. O CLI suporta apenas a geração do arquivo da route tree e não fornece nenhum outro recurso.

Para usar roteamento baseado em arquivos com o TanStack Router CLI, você precisará instalar o pacote `@tanstack/router-cli`.

```sh
npm install -D @tanstack/router-cli
```

Uma vez instalado, você precisará alterar seus scripts no `package.json` para o CLI fazer `watch` e `generate` dos arquivos.

```json
{
  "scripts": {
    "generate-routes": "tsr generate",
    "watch-routes": "tsr watch",
    "build": "npm run generate-routes && ...",
    "dev": "npm run watch-routes && ..."
  }
}
```

[//]: # "AfterScripts"
[//]: # "AfterScripts"

Você não deve esquecer de _ignorar_ o arquivo da route tree gerada. Vá para a seção [Ignorando o arquivo da route tree gerada](#ignorando-o-arquivo-da-route-tree-gerada) para saber mais.

Com o CLI instalado, os seguintes comandos ficam disponíveis através do comando `tsr`

## Usando o comando `generate`

Gera as routes para um projeto com base na configuração fornecida.

```sh
tsr generate
```

## Usando o comando `watch`

Observa continuamente os diretórios especificados e regenera as routes conforme necessário.

**Uso:**

```sh
tsr watch
```

Com o roteamento baseado em arquivos habilitado, sempre que você iniciar sua aplicação em modo de desenvolvimento, o TanStack Router observará o `routesDirectory` configurado e gerará sua route tree sempre que um arquivo for adicionado, removido ou alterado.

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

Ao usar o TanStack Router CLI para roteamento baseado em arquivos, ele vem com alguns padrões sensatos que devem funcionar para a maioria dos projetos:

```json
{
  "routesDirectory": "./src/routes",
  "generatedRouteTree": "./src/routeTree.gen.ts",
  "routeFileIgnorePrefix": "-",
  "quoteStyle": "single"
}
```

Se esses padrões funcionam para o seu projeto, você não precisa configurar nada! No entanto, se precisar personalizar a configuração, pode fazê-lo criando um arquivo `tsr.config.json` na raiz do diretório do seu projeto.

[//]: # "TargetConfiguration"
[//]: # "TargetConfiguration"

Você pode encontrar todas as opções de configuração disponíveis na [Referência da API de Roteamento Baseado em Arquivos](../../../api/file-based-routing.md).
