---
title: Route Trees
---

O TanStack Router usa uma árvore de routes aninhada para corresponder a URL com a árvore de components correta a ser renderizada.

Para construir uma árvore de routes, o TanStack Router suporta:

- [Roteamento Baseado em Arquivos](./file-based-routing.md)
- [Roteamento Baseado em Código](./code-based-routing.md)

Ambos os métodos suportam exatamente os mesmos recursos e funcionalidades principais, mas **o roteamento baseado em arquivos requer menos código para os mesmos ou melhores resultados**. Por essa razão, **o roteamento baseado em arquivos é a forma preferida e recomendada** de configurar o TanStack Router. A maior parte da documentação é escrita da perspectiva do roteamento baseado em arquivos.

## Árvores de Routes

Roteamento aninhado é um conceito poderoso que permite usar uma URL para renderizar uma árvore de components aninhada. Por exemplo, dada a URL `/blog/posts/123`, você poderia criar uma hierarquia de routes que se parece com isso:

```tsx
├── blog
│   ├── posts
│   │   ├── $postId
```

E renderizar uma árvore de components que se parece com isso:

```tsx
<Blog>
  <Posts>
    <Post postId="123" />
  </Posts>
</Blog>
```

Vamos pegar esse conceito e expandir para uma estrutura de site maior, mas agora com nomes de arquivos:

```
/routes
├── __root.tsx
├── index.tsx
├── about.tsx
├── posts/
│   ├── index.tsx
│   ├── $postId.tsx
├── posts.$postId.edit.tsx
├── settings/
│   ├── profile.tsx
│   ├── notifications.tsx
├── _pathlessLayout/
│   ├── route-a.tsx
├── ├── route-b.tsx
├── files/
│   ├── $.tsx
```

O exemplo acima é uma configuração válida de árvore de routes que pode ser usada com o TanStack Router! Há muito poder e convenção para desempacotar com roteamento baseado em arquivos, então vamos detalhar um pouco.

## Configuração da Árvore de Routes

Árvores de routes podem ser configuradas usando algumas formas diferentes:

- [Routes Flat](./file-based-routing.md#flat-routes)
- [Diretórios](./file-based-routing.md#directory-routes)
- [Routes Flat e Diretórios Misturados](./file-based-routing.md#mixed-flat-and-directory-routes)
- [Virtual File Routes](./virtual-file-routes.md)
- [Routes Baseadas em Código](./code-based-routing.md)

Certifique-se de conferir os links completos da documentação acima para cada tipo de árvore de routes, ou simplesmente prossiga para a próxima seção para começar com roteamento baseado em arquivos.
