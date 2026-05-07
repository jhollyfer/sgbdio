---
id: llm-assistance
title: LLM Assistance Support
---

A documentação do TanStack Router está integrada ao seu módulo NPM, tornando-a disponível para instalar como regras de assistência LLM. Essas regras podem ser integradas a vários editores para fornecer ajuda com reconhecimento de contexto usando [`vibe-rules`](https://www.npmjs.com/package/vibe-rules).

## Instalação

Para usar o `vibe-rules`, instale-o globalmente usando o gerenciador de pacotes de sua preferência. Por exemplo, com `pnpm`:

```bash
pnpm add -g vibe-rules
```

Uma vez instalado, você pode executá-lo no editor de sua escolha. Por exemplo, para integrar com o Cursor:

```bash
vibe-rules install cursor
```

## Editores Suportados

O `vibe-rules` suporta uma variedade de editores, incluindo `windsurf`, `claude-code` e mais. Para mais informações sobre editores suportados e como configurá-los, consulte a [documentação do `vibe-rules`](https://github.com/FutureExcited/vibe-rules).

> [!IMPORTANT]
> Se você está usando [Yarn Workspaces](https://yarnpkg.com/features/workspaces), precisará adicionar a seguinte configuração ao arquivo `.yarnrc.yaml` da sua aplicação que usa o TanStack Router:

> ```yaml
> pnpFallbackMode: all
> pnpMode: loose
> ```
