---
id: spa-mode
title: SPA mode
---

## O que diabos e modo SPA?

Para aplicacoes que nao requerem SSR por motivos de SEO, crawlers ou performance, pode ser desejavel enviar HTML estatico aos seus usuarios contendo o "shell" da sua aplicacao (ou ate HTML pre-renderizado para routes especificas) que contenha as tags `html`, `head` e `body` necessarias para inicializar sua aplicacao apenas no cliente.

## Por que usar o Start sem SSR?

**Sem SSR nao significa abrir mao de recursos do lado do servidor!** Os modos SPA na verdade combinam muito bem com recursos do lado do servidor como server functions e/ou server routes ou ate outras APIs externas. Isso **simplesmente significa que o documento inicial nao contera o HTML completamente renderizado da sua aplicacao ate que ele tenha sido renderizado no cliente usando JavaScript**.

## Beneficios do modo SPA

- **Mais facil de fazer deploy** - Um CDN que possa servir assets estaticos e tudo que voce precisa.
- **Mais barato** para hospedar - CDNs sao baratos comparados a funcoes Lambda ou processos de longa duracao.
- **Apenas lado do cliente e mais simples** - Sem SSR significa menos coisas para dar errado com hydration, rendering e roteamento.

## Ressalvas do modo SPA

- **Tempo maior ate o conteudo completo** - O tempo ate o conteudo completo e maior, ja que todo o JS precisa ser baixado e executado antes que qualquer coisa abaixo do shell possa ser renderizada.
- **Menos amigavel para SEO** - Robos, crawlers e unfurlers de links _podem_ ter mais dificuldade em indexar sua aplicacao, a menos que estejam configurados para executar JS e sua aplicacao consiga renderizar em um tempo razoavel.

## Como funciona?

Apos habilitar o modo SPA, executar um build do Start tera uma etapa adicional de pre-renderizacao logo depois para gerar o shell. Isso e feito por:

- **Pre-renderizacao** apenas da **route raiz** da sua aplicacao
- Onde sua aplicacao normalmente renderizaria as routes correspondentes, o **component de fallback pendente configurado do router e renderizado no lugar**.
- O HTML resultante e armazenado em uma pagina HTML estatica chamada `/_shell.html` (configuravel)
- Rewrites padrao sao configurados para redirecionar todas as requisicoes 404 para o shell do modo SPA

> [!NOTE]
> Outras routes tambem podem ser pre-renderizadas e e recomendado pre-renderizar o maximo possivel no modo SPA, mas isso nao e obrigatorio para o modo SPA funcionar.

## Configurando o modo SPA

Para configurar o modo SPA, existem algumas opcoes que voce pode adicionar as opcoes do plugin do Start:

```tsx
// vite.config.ts
export default defineConfig({
  plugins: [
    tanstackStart({
      spa: {
        enabled: true,
      },
    }),
  ],
});
```

## Use os Redirecionamentos Necessarios

Fazer deploy de uma SPA puramente no lado do cliente em um host ou CDN frequentemente requer o uso de redirecionamentos para garantir que as URLs sejam corretamente reescritas para o shell da SPA. O objetivo de qualquer deploy deve incluir essas prioridades nesta ordem:

1. Garantir que assets estaticos sempre sejam servidos se existirem, ex.: /about.html. Este e geralmente o comportamento padrao da maioria dos CDNs
2. (Opcional) Permitir subcaminhos especificos para serem roteados para quaisquer handlers de servidor dinamicos, ex.: /api/\*\* (Mais sobre isso abaixo)
3. Garantir que todas as requisicoes 404 sejam reescritas para o shell da SPA, ex.: um redirecionamento catch-all para /\_shell.html (ou se voce configurou o caminho de saida do shell para algo personalizado, use esse em vez disso)

## Exemplo Basico de Redirecionamentos

Vamos usar o arquivo `_redirects` do Netlify para reescrever todas as requisicoes 404 para o shell da SPA.

```
# Catch all other 404 requests and rewrite them to the SPA shell
/* /_shell.html 200
```

## Permitindo Server Functions e Server Routes

Novamente, usando o arquivo `_redirects` do Netlify, podemos permitir subcaminhos especificos para serem roteados para o servidor.

```
# Allow requests to /_serverFn/* to be routed through to the server (If you have configured your server function base path to be something other than /_serverFn, use that instead)
/_serverFn/* /_serverFn/:splat 200

# Allow any requests to /api/* to be routed through to the server (Server routes can be created at any path, so you must ensure that any server routes you want to use are under this path, or simply add additional redirects for each server route base you want to expose)
/api/* /api/:splat 200

# Catch all other 404 requests and rewrite them to the SPA shell
/* /_shell.html 200
```

## Caminho de Mascara do Shell

O pathname padrao usado para gerar o shell da SPA e `/`. Chamamos isso de **caminho de mascara do shell**. Como as routes correspondentes nao sao incluidas, o pathname usado para gerar o shell e praticamente irrelevante, mas ainda e configuravel.

> [!NOTE]
> E recomendado manter o valor padrao de `/` como caminho de mascara do shell.

```tsx
// vite.config.ts
export default defineConfig({
  plugins: [
    tanstackStart({
      spa: {
        maskPath: "/app",
      },
    }),
  ],
});
```

## Opcoes de Pre-renderizacao

A opcao de pre-renderizacao e usada para configurar o comportamento de pre-renderizacao do shell da SPA, e aceita as mesmas opcoes de pre-renderizacao encontradas no nosso guia de pre-renderizacao.

**Por padrao, as seguintes opcoes de `prerender` sao definidas:**

- `outputPath`: `/_shell.html`
- `crawlLinks`: `false`
- `retryCount`: `0`

Isso significa que, por padrao, o shell nao sera rastreado em busca de links para seguir para pre-renderizacao adicional, e nao vai tentar novamente em caso de falha na pre-renderizacao.

Voce sempre pode sobrescrever essas opcoes fornecendo suas proprias opcoes de pre-renderizacao:

```tsx
// vite.config.ts
export default defineConfig({
  plugins: [
    tanstackStart({
      spa: {
        prerender: {
          outputPath: "/custom-shell",
          crawlLinks: true,
          retryCount: 3,
        },
      },
    }),
  ],
});
```

## Renderizacao personalizada no modo SPA

Personalizar a saida HTML do shell da SPA pode ser util se voce quiser:

- Fornecer tags head genericas para routes SPA
- Fornecer um component de fallback pendente personalizado
- Alterar literalmente qualquer coisa sobre o HTML, CSS e JS do shell

Para simplificar esse processo, uma funcao `isShell()` pode ser encontrada na instancia do `router`:

```tsx
// src/routes/root.tsx
export default function Root() {
  const isShell = useRouter().isShell();

  if (isShell) console.log("Rendering the shell!");
}
```

Voce pode usar esse booleano para renderizar condicionalmente UI diferente com base em se a route atual e um shell ou nao, mas tenha em mente que apos hidratar o shell, o router navegara imediatamente para a primeira route e `isShell()` retornara `false`. **Isso poderia produzir flashes de conteudo sem estilo se nao for tratado adequadamente.**

## Dados Dinamicos no seu Shell

Como o shell e pre-renderizado usando o build SSR da sua aplicacao, quaisquer `loader`s ou funcionalidades especificas do servidor definidas na sua **Route Raiz** serao executados durante o processo de pre-renderizacao e os dados serao incluidos no shell.

Isso significa que voce pode usar dados dinamicos no seu shell usando um `loader` ou funcionalidade especifica do servidor.

```tsx
// src/routes/__root.tsx

export const RootRoute = createRootRoute({
  loader: async () => {
    return {
      name: "Tanner",
    };
  },
  component: Root,
});

export default function Root() {
  const { name } = useLoaderData();

  return (
    <html>
      <body>
        <h1>Hello, {name}!</h1>
        <Outlet />
      </body>
    </html>
  );
}
```
