---
id: graphql
title: GraphQL
---

Como os mecanismos de fetching do React Query são construídos de forma agnóstica sobre Promises, você pode usar o React Query com literalmente qualquer client de fetching de dados assíncrono, incluindo GraphQL!

> Tenha em mente que o React Query não suporta cache normalizado. Embora a grande maioria dos usuários não precise realmente de um cache normalizado ou sequer se beneficie dele tanto quanto acreditam, pode haver circunstâncias muito raras que justifiquem seu uso, então certifique-se de verificar conosco primeiro para ter certeza de que é realmente algo que você precisa!

[//]: # "Codegen"

## Type-Safety e Geração de Código

O React Query, usado em combinação com `graphql-request^5` e o [GraphQL Code Generator](https://graphql-code-generator.com/), fornece operações GraphQL totalmente tipadas:

```tsx
import request from "graphql-request";
import { useQuery } from "@tanstack/react-query";

import { graphql } from "./gql/gql";

const allFilmsWithVariablesQueryDocument = graphql(/* GraphQL */ `
  query allFilmsWithVariablesQuery($first: Int!) {
    allFilms(first: $first) {
      edges {
        node {
          id
          title
        }
      }
    }
  }
`);

function App() {
  // `data` is fully typed!
  const { data } = useQuery({
    queryKey: ["films"],
    queryFn: async () =>
      request(
        "https://swapi-graphql.netlify.app/.netlify/functions/index",
        allFilmsWithVariablesQueryDocument,
        // variables are type-checked too!
        { first: 10 },
      ),
  });
  // ...
}
```

_Você pode encontrar um [exemplo completo no repositório](https://github.com/dotansimha/graphql-code-generator/tree/7c25c4eeb77f88677fd79da557b7b5326e3f3950/examples/front-end/react/tanstack-react-query)_

Comece com o [guia dedicado na documentação do GraphQL Code Generator](https://www.the-guild.dev/graphql/codegen/docs/guides/react-vue).

[//]: # "Codegen"
