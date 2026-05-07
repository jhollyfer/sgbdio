---
id: philosophy
title: Philosophy
---

Todo projeto bem estabelecido deve ter uma filosofia que guie seu desenvolvimento. Sem uma filosofia central, o desenvolvimento pode se perder em decisões intermináveis e resultar em APIs mais fracas.

Este documento descreve os princípios fundamentais que impulsionam o desenvolvimento e o conjunto de funcionalidades do TanStack Form.

## Aprimorando APIs unificadas

APIs vêm com trade-offs. Por isso, pode ser tentador disponibilizar cada conjunto de trade-offs ao usuário através de APIs diferentes. No entanto, isso pode levar a uma API fragmentada que é mais difícil de aprender e usar.

Embora isso possa significar uma curva de aprendizado mais íngreme, significa que você não precisa questionar qual API usar internamente nem ter maior sobrecarga cognitiva ao alternar entre APIs.

## Forms precisam de flexibilidade

O TanStack Form foi projetado para ser flexível e personalizável. Embora muitos forms possam seguir padrões semelhantes, sempre existem exceções; especialmente quando forms são um component central da sua aplicação.

Por isso, o TanStack Form suporta múltiplos métodos de validação:

- **Personalização de tempo**: Você pode validar no blur, change, submit, ou até no mount.
- **Estratégias de validação**: Você pode validar fields individuais, o form inteiro ou um subconjunto de fields.
- **Lógica de validação personalizada**: Você pode escrever sua própria lógica de validação ou usar uma biblioteca como [Zod](https://zod.dev/) ou [Valibot](https://valibot.dev/).
- **Mensagens de erro personalizadas**: Você pode personalizar as mensagens de erro para cada field retornando qualquer objeto de um validator.
- **Validação assíncrona**: Você pode validar fields de forma assíncrona e ter utilitários comuns como debouncing e cancelamento tratados automaticamente.

## Controlado é Legal

Em um mundo onde inputs controlados vs. não controlados são um tema quente, o TanStack Form está firmemente no campo dos controlados.

Isso traz diversas vantagens:

- **Previsível**: Você pode prever o state do seu form em qualquer momento.
- **Testes mais fáceis**: Você pode testar seus forms facilmente passando valores e verificando a saída.
- **Suporte fora do DOM**: Você pode usar o TanStack Form com React Native, adaptadores de framework Three.js, ou qualquer outro renderer de framework.
- **Lógica condicional aprimorada**: Você pode facilmente exibir/ocultar fields condicionalmente com base no state do form.
- **Depuração**: Você pode facilmente logar o state do form no console para depurar problemas.

## Generics são sombrios

Você nunca deveria precisar passar um generic ou usar um tipo interno ao utilizar o TanStack Form. Isso porque projetamos a biblioteca para inferir tudo a partir dos valores padrão em tempo de execução.

Ao escrever código TanStack Form suficientemente correto, você não deveria conseguir distinguir entre o uso em JavaScript e TypeScript, com exceção de quaisquer type casts que você faça em valores de tempo de execução.

Em vez de:

```ts
useForm<MyForm>();
```

Você deve fazer:

```ts
interface Person {
  name: string;
  age: number;
}

const defaultPerson: Person = { name: "Bill Luo", age: 24 };

useForm({
  defaultValues: defaultPerson,
});
```

## Bibliotecas são libertadoras

Um dos principais objetivos do TanStack Form é que você deveria encapsulá-lo no seu próprio sistema de components ou design system.

Para dar suporte a isso, temos diversos utilitários que facilitam a construção dos seus próprios components e hooks personalizados:

```ts
// Exported from your own library with pre-bound components for your forms.
export const { useAppForm, withForm } = createFormHook(/* options */);
```

Sem fazer isso, você estará adicionando substancialmente mais boilerplate às suas aplicações e tornando seus forms menos consistentes e amigáveis ao usuário.
