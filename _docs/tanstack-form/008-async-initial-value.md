---
id: async-initial-values
title: Async Initial Values
---

Digamos que você queira buscar alguns dados de uma API e usá-los como o valor inicial de um form.

Embora esse problema pareça simples na superfície, existem complexidades ocultas nas quais você pode não ter pensado até agora.

Por exemplo, você pode querer exibir um spinner de carregamento enquanto os dados estão sendo buscados, ou pode querer lidar com erros de forma elegante.
Da mesma forma, você também pode estar procurando uma maneira de fazer cache dos dados para não precisar buscá-los toda vez que o form for renderizado.

Embora pudéssemos implementar muitas dessas funcionalidades do zero, o resultado acabaria se parecendo muito com outro projeto que mantemos: [TanStack Query](https://tanstack.com/query).

Sendo assim, este guia mostra como você pode combinar o TanStack Form com o TanStack Query para alcançar o comportamento desejado.

## Uso Básico

```tsx
import { useForm } from '@tanstack/react-form'
import { useQuery } from '@tanstack/react-query'

export default function App() {
  const {data, isLoading} = useQuery({
    queryKey: ['data'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return {firstName: 'FirstName', lastName: "LastName"}
    }
  })

  const form = useForm({
    defaultValues: {
      firstName: data?.firstName ?? '',
      lastName: data?.lastName ?? '',
    },
    onSubmit: async ({ value }) => {
      // Do something with form data
      console.log(value)
    },
  })

  if (isLoading) return <p>Loading...</p>

  return (
    // ...
  )
}
```

Isso exibirá um spinner de carregamento até que os dados sejam buscados, e então renderizará o form com os dados obtidos como valores iniciais.
