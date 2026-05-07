---
title: Route Matching
---

A correspondência de routes segue um padrão consistente e previsível. Este guia explicará como árvores de routes são correspondidas.

Quando o TanStack Router processa sua árvore de routes, todas as suas routes são automaticamente ordenadas para corresponder às routes mais específicas primeiro. Isso significa que independentemente da ordem em que sua árvore de routes é definida, as routes sempre serão ordenadas nesta ordem:

- Index Route
- Routes Estáticas (da mais específica para a menos específica)
- Routes Dinâmicas (da mais longa para a mais curta)
- Routes Splat/Wildcard

Considere a seguinte pseudo árvore de routes:

```
Root
  - blog
    - $postId
    - /
    - new
  - /
  - *
  - about
  - about/us
```

Após a ordenação, essa árvore de routes se tornará:

```
Root
  - /
  - about/us
  - about
  - blog
    - /
    - new
    - $postId
  - *
```

Essa ordem final representa a ordem em que as routes serão correspondidas com base na especificidade.

Usando essa árvore de routes, vamos seguir o processo de correspondência para algumas URLs diferentes:

- `/blog`
  ```
  Root
    ❌ /
    ❌ about/us
    ❌ about
    ⏩ blog
      ✅ /
      - new
      - $postId
    - *
  ```
- `/blog/my-post`
  ```
  Root
    ❌ /
    ❌ about/us
    ❌ about
    ⏩ blog
      ❌ /
      ❌ new
      ✅ $postId
    - *
  ```
- `/`
  ```
  Root
    ✅ /
    - about/us
    - about
    - blog
      - /
      - new
      - $postId
    - *
  ```
- `/not-a-route`
  ```
  Root
    ❌ /
    ❌ about/us
    ❌ about
    ❌ blog
      - /
      - new
      - $postId
    ✅ *
  ```
