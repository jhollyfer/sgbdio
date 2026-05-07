---
title: Link Options
---

Você pode querer reutilizar opções que se destinam a serem passadas para `Link`, `redirect` ou `navigate`. Nesse caso, você pode decidir que um objeto literal é uma boa forma de representar opções passadas para `Link`.

```tsx
const dashboardLinkOptions = {
  to: "/dashboard",
  search: { search: "" },
};

function DashboardComponent() {
  return <Link {...dashboardLinkOptions} />;
}
```

Existem alguns problemas aqui. `dashboardLinkOptions.to` é inferido como `string`, que por padrão resolverá para todas as routes quando passado para `Link`, `navigate` ou `redirect` (esse problema específico poderia ser resolvido com `as const`). O outro problema aqui é que não sabemos se `dashboardLinkOptions` sequer passa no verificador de tipos até que seja espalhado no `Link`. Poderíamos facilmente criar opções de navegação incorretas e somente quando as opções são espalhadas no `Link` é que sabemos que existe um erro de tipo.

### Usando a função `linkOptions` para criar opções reutilizáveis

`linkOptions` é uma função que verifica os tipos de um objeto literal e retorna a entrada inferida como está. Isso fornece segurança de tipos nas opções exatamente como o `Link` antes de ser usado, permitindo manutenção e reutilização mais fáceis. Nosso exemplo acima usando `linkOptions` fica assim:

```tsx
const dashboardLinkOptions = linkOptions({
  to: "/dashboard",
  search: { search: "" },
});

function DashboardComponent() {
  return <Link {...dashboardLinkOptions} />;
}
```

Isso permite verificação de tipos antecipada de `dashboardLinkOptions`, que pode então ser reutilizado em qualquer lugar

```tsx
const dashboardLinkOptions = linkOptions({
  to: "/dashboard",
  search: { search: "" },
});

export const Route = createFileRoute("/dashboard")({
  component: DashboardComponent,
  validateSearch: (input) => ({ search: input.search }),
  beforeLoad: () => {
    // can used in redirect
    throw redirect(dashboardLinkOptions);
  },
});

function DashboardComponent() {
  const navigate = useNavigate();

  return (
    <div>
      {/** can be used in navigate */}
      <button onClick={() => navigate(dashboardLinkOptions)} />

      {/** can be used in Link */}
      <Link {...dashboardLinkOptions} />
    </div>
  );
}
```

### Um array de `linkOptions`

Ao criar navegação, você pode iterar sobre um array para construir uma barra de navegação. Nesse caso, `linkOptions` pode ser usado para verificar os tipos de um array de objetos literais que são destinados para props do `Link`

```tsx
const options = linkOptions([
  {
    to: "/dashboard",
    label: "Summary",
    activeOptions: { exact: true },
  },
  {
    to: "/dashboard/invoices",
    label: "Invoices",
  },
  {
    to: "/dashboard/users",
    label: "Users",
  },
]);

function DashboardComponent() {
  return (
    <>
      <div className="flex items-center border-b">
        <h2 className="text-xl p-2">Dashboard</h2>
      </div>

      <div className="flex flex-wrap divide-x">
        {options.map((option) => {
          return (
            <Link
              {...option}
              key={option.to}
              activeProps={{ className: `font-bold` }}
              className="p-2"
            >
              {option.label}
            </Link>
          );
        })}
      </div>
      <hr />

      <Outlet />
    </>
  );
}
```

A entrada de `linkOptions` é inferida e retornada, como mostrado com o uso de `label`, pois isso não existe nas props do `Link`
