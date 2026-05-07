---
title: Data Mutations
---

Como o TanStack Router não armazena nem faz cache de dados, seu papel em mutations de dados é mínimo ou nenhum, além de reagir a possíveis efeitos colaterais na URL vindos de eventos de mutation externos. Dito isso, compilamos uma lista de funcionalidades relacionadas a mutations que você pode achar úteis e bibliotecas que as implementam.

Procure e use utilitários de mutation que suportem:

- Gerenciamento e cache do state de submissão
- Suporte a UI otimista tanto local quanto global
- Hooks integrados para conectar invalidação (ou suporte automático a ela)
- Gerenciamento de múltiplas mutations em andamento simultaneamente
- Organização do state de mutation como um recurso acessível globalmente
- Histórico de state de submissão e coleta de lixo

Algumas bibliotecas sugeridas:

- [TanStack Query](https://tanstack.com/query/latest/docs/react/guides/mutations)
- [SWR](https://swr.vercel.app/)
- [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)
- [urql](https://formidable.com/open-source/urql/)
- [Relay](https://relay.dev/)
- [Apollo](https://www.apollographql.com/docs/react/)

Ou, até mesmo...

- [Zustand](https://zustand-demo.pmnd.rs/)
- [Jotai](https://jotai.org/)
- [Recoil](https://recoiljs.org/)
- [Redux](https://redux.js.org/)

Assim como o data fetching, o state de mutation não é uma solução única para todos os casos, então você precisará escolher uma solução que atenda às suas necessidades e às da sua equipe. Recomendamos experimentar algumas soluções diferentes e ver o que funciona melhor para você.

> ⚠️ Ainda aqui? O state de submissão é um tópico interessante quando se trata de persistência. Você mantém cada mutation para sempre? Como saber quando se livrar dela? E se o usuário navegar para outra tela e depois voltar? Vamos investigar!

## Invalidando o TanStack Router após uma mutation

O TanStack Router vem com cache de curto prazo integrado. Então, mesmo que não estejamos armazenando nenhum dado após um route match ser desmontado, há uma alta probabilidade de que, se alguma mutation for feita relacionada aos dados armazenados no Router, os dados dos route matches atuais possam ficar stale.

Quando mutations relacionadas a dados do loader são feitas, podemos usar `router.invalidate` para forçar o router a recarregar todos os route matches atuais:

```tsx
const router = useRouter();

const addTodo = async (todo: Todo) => {
  try {
    await api.addTodo();
    router.invalidate();
  } catch {
    //
  }
};
```

A invalidação de todos os route matches atuais acontece em segundo plano, então os dados existentes continuarão sendo servidos até que os novos dados estejam prontos, como se você estivesse navegando para uma nova route.

Se você quiser aguardar a invalidação até que todos os loaders tenham terminado, passe `{sync: true}` em `router.invalidate`:

```tsx
const router = useRouter();

const addTodo = async (todo: Todo) => {
  try {
    await api.addTodo();
    await router.invalidate({ sync: true });
  } catch {
    //
  }
};
```

## State de Mutation de Longo Prazo

Independentemente da biblioteca de mutation usada, mutations frequentemente criam state relacionado à sua submissão. Embora a maioria das mutations sejam do tipo "dispare e esqueça", alguns states de mutation são mais duradouros, seja para suportar UI otimista ou para fornecer feedback ao usuário sobre o status de suas submissões. A maioria dos gerenciadores de state manterá corretamente esse state de submissão e o exporá para tornar possível mostrar elementos de UI como spinners de carregamento, mensagens de sucesso, mensagens de erro, etc.

Vamos considerar as seguintes interações:

- O usuário navega para a tela `/posts/123/edit` para editar um post
- O usuário edita o post `123` e, após o sucesso, vê uma mensagem de sucesso abaixo do editor informando que o post foi atualizado
- O usuário navega para a tela `/posts`
- O usuário navega de volta para a tela `/posts/123/edit` novamente

Sem notificar sua biblioteca de gerenciamento de mutations sobre a mudança de route, é possível que o state de submissão ainda esteja presente e o usuário ainda veja a mensagem **"Post updated successfully"** quando retornar à tela anterior. Isso não é ideal. Obviamente, nossa intenção não era manter esse state de mutation para sempre, certo?!

## Usando chaves de mutation

Esperançosamente e hipoteticamente, a maneira mais fácil é que sua biblioteca de mutation suporte um mecanismo de chaves que permita que o state das suas mutations seja resetado quando a chave mudar:

```tsx
const routeApi = getRouteApi("/room/$roomId/chat");

function ChatRoom() {
  const { roomId } = routeApi.useParams();

  const sendMessageMutation = useCoolMutation({
    fn: sendMessage,
    // Clear the mutation state when the roomId changes
    // including any submission state
    key: ["sendMessage", roomId],
  });

  // Fire off a bunch of messages
  const test = () => {
    sendMessageMutation.mutate({ roomId, message: "Hello!" });
    sendMessageMutation.mutate({ roomId, message: "How are you?" });
    sendMessageMutation.mutate({ roomId, message: "Goodbye!" });
  };

  return (
    <>
      {sendMessageMutation.submissions.map((submission) => {
        return (
          <div>
            <div>{submission.status}</div>
            <div>{submission.message}</div>
          </div>
        );
      })}
    </>
  );
}
```

## Usando o método `router.subscribe`

Para bibliotecas que não possuem um mecanismo de chaves, provavelmente precisaremos resetar manualmente o state de mutation quando o usuário navegar para fora da tela. Para resolver isso, podemos usar os métodos `invalidate` e `subscribe` do TanStack Router para limpar os states de mutation quando o usuário não precisar mais deles.

O método `router.subscribe` é uma função que inscreve um callback em vários eventos do router. O evento em particular que usaremos aqui é o evento `onResolved`. É importante entender que esse evento é disparado quando o caminho da localização é _alterado (não apenas recarregado) e finalmente resolvido_.

Este é um ótimo lugar para resetar seus states de mutation antigos. Aqui está um exemplo:

```tsx
const router = createRouter();
const coolMutationCache = createCoolMutationCache();

const unsubscribeFn = router.subscribe("onResolved", () => {
  // Reset mutation states when the route changes
  coolMutationCache.clear();
});
```
