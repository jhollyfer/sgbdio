---
id: quick-start
title: Quick Start
---

## Impaciente?

A maneira mais rápida de começar com o TanStack Router é criar um novo projeto. Basta executar:

[//]: # "createAppCommand"

```sh
npx create-tsrouter-app@latest
```

[//]: # "createAppCommand"

O CLI vai guiá-lo por uma curta série de perguntas para customizar sua configuração, incluindo opções para:

[//]: # "CLIPrompts"

- Configuração de route baseada em arquivo ou em código
- Suporte a TypeScript
- Integração com Tailwind CSS
- Configuração de toolchain
- Inicialização do Git

[//]: # "CLIPrompts"

Uma vez concluído, um novo projeto React será gerado com o TanStack Router instalado e pronto para uso:

```sh
cd your-project-name
npm run dev
```

> [!TIP]
> Para detalhes completos sobre opções e templates disponíveis, visite a [documentação do `create-tsrouter-app`](https://github.com/TanStack/create-tsrouter-app/tree/main/cli/create-tsrouter-app).

## Opções de Routing

O TanStack Router suporta tanto configurações de route baseadas em arquivo quanto baseadas em código. Você pode especificar sua preferência durante a configuração pelo CLI, ou usar estes comandos diretamente:

### Geração de Route Baseada em Arquivo

A abordagem baseada em arquivo é a opção recomendada para a maioria dos projetos. Ela cria routes automaticamente com base na estrutura dos seus arquivos, oferecendo a melhor combinação de performance, simplicidade e experiência de desenvolvedor.

[//]: # "createAppCommandFileBased"

```sh
npx create-tsrouter-app@latest my-app --template file-router
```

[//]: # "createAppCommandFileBased"

### Configuração de Route Baseada em Código

Se você prefere definir routes programaticamente, pode usar a configuração de route baseada em código. Essa abordagem dá a você controle total sobre a lógica de routing.

[//]: # "createAppCommandCodeBased"

```sh
npx create-tsrouter-app@latest my-app
```

[//]: # "createAppCommandCodeBased"

Com qualquer uma das abordagens, navegue até o diretório do seu projeto e inicie o servidor de desenvolvimento:

```sh
cd my-app
npm run dev
```

## Projeto Existente

Se você tem um projeto React existente e quer adicionar o TanStack Router a ele, pode instalá-lo manualmente.

### Requisitos

Antes de instalar o TanStack Router, certifique-se de que seu projeto atende aos seguintes requisitos:

[//]: # "Requirements"

- `react` v18 ou posterior com suporte a `createRoot`.
- `react-dom` v18 ou posterior.

[//]: # "Requirements"

> [!NOTE]
> Usar TypeScript (`v5.3.x ou superior`) é recomendado para a melhor experiência de desenvolvimento, embora não seja estritamente obrigatório. Nosso objetivo é suportar as últimas 5 versões minor do TypeScript, mas usar a versão mais recente ajudará a evitar problemas potenciais.

O TanStack Router atualmente é compatível apenas com React (com ReactDOM) e Solid. Se você tem interesse em contribuir para suportar outros frameworks, como React Native, Angular ou Vue, entre em contato conosco no [Discord](https://tlinz.com/discord).

### Instalação

Para instalar o TanStack Router no seu projeto, execute o seguinte comando usando seu gerenciador de pacotes preferido:

[//]: # "installCommand"

```sh
npm install @tanstack/react-router
# or
pnpm add @tanstack/react-router
#or
yarn add @tanstack/react-router
# or
bun add @tanstack/react-router
# or
deno add npm:@tanstack/react-router
```

[//]: # "installCommand"

Uma vez instalado, você pode verificar a instalação checando o arquivo `package.json` para a dependência.

[//]: # "packageJson"

```json
{
  "dependencies": {
    "@tanstack/react-router": "^x.x.x"
  }
}
```

[//]: # "packageJson"
