---
id: debugging
title: Debugging React Usage
---

Aqui está uma lista de erros comuns que você pode ver no console e como corrigi-los.

## Alterando um input não controlado para controlado

Se você vir este erro no console:

```
Warning: A component is changing an uncontrolled input to be controlled. This is likely caused by the value changing from undefined to a defined value, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://reactjs.org/link/controlled-components
```

É provável que você tenha esquecido o `defaultValues` no seu hook `useForm` ou no uso do component `form.Field`. Isso ocorre
porque o input está sendo renderizado antes que o valor do form seja inicializado e, portanto, está mudando de `undefined` para `""` quando uma entrada de texto é feita.

## O valor do field é do tipo `unknown`

Se você está usando `form.Field` e, ao inspecionar o valor de `field.state.value`, vê que o valor de um field é do tipo `unknown`, é provável que o tipo do seu form era grande demais para avaliarmos com segurança.

Isso geralmente é um sinal de que você deveria dividir seu form em forms menores ou usar um tipo mais específico para o seu form.

Uma solução alternativa para esse problema é fazer cast de `field.state.value` usando a palavra-chave `as` do TypeScript:

```tsx
const value = field.state.value as string;
```

## `Type instantiation is excessively deep and possibly infinite`

Se você vir este erro no console ao executar `tsc`:

```
Type instantiation is excessively deep and possibly infinite
```

Você encontrou um bug que não detectamos nas nossas definições de tipos. Embora tenhamos feito o nosso melhor para garantir que nossos tipos sejam os mais precisos possíveis, existem alguns casos extremos em que o TypeScript teve dificuldades com a complexidade dos nossos tipos.

Por favor, [reporte esse problema para nós no GitHub](https://github.com/TanStack/form/issues) para que possamos corrigi-lo. Apenas certifique-se de incluir uma reprodução mínima para que possamos ajudá-lo a depurar.

> Tenha em mente que esse erro é um erro do TypeScript e não um erro em tempo de execução. Isso significa que seu código ainda vai funcionar na máquina do usuário como esperado.
