---
title: Data Table
description: Tabelas e datagrids poderosos construídos com TanStack Table.
base: base
component: true
links:
  doc: https://tanstack.com/table/v8/docs/introduction
---

```tsx
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

const data: Payment[] = [
  {
    id: "m5gr84i9",
    amount: 316,
    status: "success",
    email: "ken99@example.com",
  },
  {
    id: "3u1reuv4",
    amount: 242,
    status: "success",
    email: "Abe45@example.com",
  },
  {
    id: "derv1ws0",
    amount: 837,
    status: "processing",
    email: "Monserrat44@example.com",
  },
  {
    id: "5kma53ae",
    amount: 874,
    status: "success",
    email: "Silas22@example.com",
  },
  {
    id: "bhqecj4p",
    amount: 721,
    status: "failed",
    email: "carmella@example.com",
  },
];

export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

export const columns: ColumnDef<Payment>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));

      // Format the amount as a dollar amount.
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-xs">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(payment.id)}
              >
                Copy payment ID
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuGroup>
              <DropdownMenuItem>View customer</DropdownMenuItem>
              <DropdownMenuItem>View payment details</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function DataTableDemo() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter emails..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
```

## Introdução

Cada data table ou datagrid que criei foi único. Todos se comportam de maneira diferente, possuem requisitos específicos de ordenação e filtragem, e trabalham com diferentes fontes de dados.

Não faz sentido combinar todas essas variações em um único component. Se fizermos isso, perderemos a flexibilidade que a [headless UI](https://tanstack.com/table/v8/docs/introduction#what-is-headless-ui) oferece.

Então, em vez de um component data-table, achei que seria mais útil fornecer um guia sobre como construir o seu próprio.

Vamos começar com o component básico `<Table />` e construir uma data table complexa do zero.

<Callout className="mt-4">

**Dica:** Se você usar a mesma tabela em vários lugares do seu app, sempre pode extraí-la em um component reutilizável.

</Callout>

## Índice

Este guia mostrará como usar o [TanStack Table](https://tanstack.com/table) e o component `<Table />` para construir sua própria data table personalizada. Abordaremos os seguintes tópicos:

- [Tabela Básica](#tabela-básica)
- [Ações de Linha](#ações-de-linha)
- [Paginação](#paginação)
- [Ordenação](#ordenação)
- [Filtragem](#filtragem)
- [Visibilidade](#visibilidade)
- [Seleção de Linhas](#seleção-de-linhas)
- [Components Reutilizáveis](#components-reutilizáveis)

## Instalação

1. Adicione o component `<Table />` ao seu projeto:

```bash
npx shadcn@latest add table
```

2. Adicione a dependência `tanstack/react-table`:

```bash
npm install @tanstack/react-table
```

## Pré-requisitos

Vamos construir uma tabela para exibir pagamentos recentes. Veja como nossos dados se parecem:

```tsx showLineNumbers
type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

export const payments: Payment[] = [
  {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "m@example.com",
  },
  {
    id: "489e1d42",
    amount: 125,
    status: "processing",
    email: "example@gmail.com",
  },
  // ...
];
```

## Estrutura do Projeto

Comece criando a seguinte estrutura de arquivos:

```txt
app
└── payments
    ├── columns.tsx
    ├── data-table.tsx
    └── page.tsx
```

Estou usando um exemplo Next.js aqui, mas isso funciona para qualquer outro framework React.

- `columns.tsx` (client component) conterá nossas definições de colunas.
- `data-table.tsx` (client component) conterá nosso component `<DataTable />`.
- `page.tsx` (server component) é onde buscaremos os dados e renderizaremos nossa tabela.

## Tabela Básica

Vamos começar construindo uma tabela básica.

<Steps className="mb-0 pt-2">

### Definições de Colunas

Primeiro, vamos definir nossas colunas.

```tsx showLineNumbers title="app/payments/columns.tsx" {3,14-27}
"use client";

import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
];
```

<Callout className="mt-4">

**Nota:** As colunas são onde você define o núcleo da aparência da sua tabela. Elas definem os dados que serão exibidos, como serão formatados, ordenados e filtrados.

</Callout>

### Component `<DataTable />`

Em seguida, vamos criar um component `<DataTable />` para renderizar nossa tabela.

```tsx showLineNumbers title="app/payments/data-table.tsx"
"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
```

<Callout>

**Dica**: Se você usar `<DataTable />` em vários lugares, este é o component que você poderia tornar reutilizável extraindo-o para `components/ui/data-table.tsx`.

`<DataTable columns={columns} data={data} />`

</Callout>

### Renderizar a tabela

Por fim, vamos renderizar nossa tabela no component de página.

```tsx showLineNumbers title="app/payments/page.tsx" {22}
import { columns, Payment } from "./columns";
import { DataTable } from "./data-table";

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    // ...
  ];
}

export default async function DemoPage() {
  const data = await getData();

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
```

</Steps>

## Formatação de Células

Vamos formatar a célula de valor para exibir o valor em dólares. Também vamos alinhar a célula à direita.

<Steps className="mb-0 pt-2">

### Atualizar definições de colunas

Atualize as definições de `header` e `cell` para amount da seguinte forma:

```tsx showLineNumbers title="app/payments/columns.tsx" {4-15}
export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
];
```

Você pode usar a mesma abordagem para formatar outras células e cabeçalhos.

</Steps>

## Ações de Linha

Vamos adicionar ações de linha à nossa tabela. Usaremos um component `<Dropdown />` para isso.

<Steps className="mb-0 pt-2">

### Atualizar definições de colunas

Atualize nossas definições de colunas para adicionar uma nova coluna `actions`. A célula `actions` retorna um component `<Dropdown />`.

```tsx showLineNumbers title="app/payments/columns.tsx" {4,6-14,18-45}
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const columns: ColumnDef<Payment>[] = [
  // ...
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
  // ...
];
```

Você pode acessar os dados da linha usando `row.original` na função `cell`. Use isso para lidar com ações para sua linha, por exemplo, use o `id` para fazer uma chamada DELETE à sua API.

</Steps>

## Paginação

Em seguida, vamos adicionar paginação à nossa tabela.

<Steps className="mb-0 pt-2">

### Atualizar `<DataTable>`

```tsx showLineNumbers title="app/payments/data-table.tsx" {5,17}
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // ...
}
```

Isso paginará automaticamente suas linhas em páginas de 10. Consulte a [documentação de paginação](https://tanstack.com/table/v8/docs/api/features/pagination) para mais informações sobre como personalizar o tamanho da página e implementar paginação manual.

### Adicionar controles de paginação

Podemos adicionar controles de paginação à nossa tabela usando o component `<Button />` e os métodos da API `table.previousPage()`, `table.nextPage()`.

```tsx showLineNumbers title="app/payments/data-table.tsx" {1,15,21-39}
import { Button } from "@/components/ui/button"

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          { // .... }
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
```

Consulte a seção [Components Reutilizáveis](#components-reutilizáveis) para um component de paginação mais avançado.

</Steps>

## Ordenação

Vamos tornar a coluna de email ordenável.

<Steps className="mb-0 pt-2">

### Atualizar `<DataTable>`

```tsx showLineNumbers title="app/payments/data-table.tsx" showLineNumbers {3,6,10,18,25-28}
"use client"

import * as React from "react"
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  })

  return (
    <div>
      <div className="overflow-hidden rounded-md border">
        <Table>{ ... }</Table>
      </div>
    </div>
  )
}
```

### Tornar a célula do cabeçalho ordenável

Agora podemos atualizar a célula do cabeçalho `email` para adicionar controles de ordenação.

```tsx showLineNumbers title="app/payments/columns.tsx" {4,9-19}
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
];
```

Isso ordenará automaticamente a tabela (ascendente e descendente) quando o usuário clicar na célula do cabeçalho.

</Steps>

## Filtragem

Vamos adicionar um campo de busca para filtrar emails na nossa tabela.

<Steps className="mb-0 pt-2">

### Atualizar `<DataTable>`

```tsx showLineNumbers title="app/payments/data-table.tsx" {6,10,17,24-26,35-36,39,45-54}
"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter emails..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>{ ... }</Table>
      </div>
    </div>
  )
}
```

A filtragem agora está habilitada para a coluna `email`. Você também pode adicionar filtros a outras colunas. Consulte a [documentação de filtragem](https://tanstack.com/table/v8/docs/guide/filters) para mais informações sobre como personalizar filtros.

</Steps>

## Visibilidade

Adicionar visibilidade de colunas é bastante simples usando a API de visibilidade do `@tanstack/react-table`.

<Steps className="mb-0 pt-2">

### Atualizar `<DataTable>`

```tsx showLineNumbers title="app/payments/data-table.tsx" {8,18-23,33-34,45,49,64-91}
"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  })

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter emails..."
          value={table.getColumn("email")?.getFilterValue() as string}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter(
                (column) => column.getCanHide()
              )
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>{ ... }</Table>
      </div>
    </div>
  )
}
```

Isso adiciona um menu dropdown que você pode usar para alternar a visibilidade das colunas.

</Steps>

## Seleção de Linhas

Em seguida, vamos adicionar seleção de linhas à nossa tabela.

<Steps className="mb-0 pt-2">

### Atualizar definições de colunas

```tsx showLineNumbers title="app/payments/columns.tsx" {6,9-27}
"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

export const columns: ColumnDef<Payment>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
];
```

### Atualizar `<DataTable>`

```tsx showLineNumbers title="app/payments/data-table.tsx" {11,23,28}
export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div>
      <div className="overflow-hidden rounded-md border">
        <Table />
      </div>
    </div>
  );
}
```

Isso adiciona um checkbox a cada linha e um checkbox no cabeçalho para selecionar todas as linhas.

### Exibir linhas selecionadas

Você pode exibir o número de linhas selecionadas usando a API `table.getFilteredSelectedRowModel()`.

```tsx
<div className="text-muted-foreground flex-1 text-sm">
  {table.getFilteredSelectedRowModel().rows.length} of{" "}
  {table.getFilteredRowModel().rows.length} row(s) selected.
</div>
```

</Steps>

## Components Reutilizáveis

Aqui estão alguns components que você pode usar para construir suas data tables. Isso é da demo de [Tarefas](/examples/tasks).

### Cabeçalho de coluna

Torne qualquer cabeçalho de coluna ordenável e ocultável.

<ComponentSource
  src="/app/(app)/examples/tasks/components/data-table-column-header.tsx"
  title="components/data-table-column-header.tsx"
/>

```tsx showLineNumbers {5}
export const columns = [
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
];
```

### Paginação

Adicione controles de paginação à sua tabela incluindo tamanho de página e contagem de seleção.

<ComponentSource
  src="/app/(app)/examples/tasks/components/data-table-pagination.tsx"
  styleName="radix-nova"
/>

```tsx
<DataTablePagination table={table} />
```

### Alternância de colunas

Um component para alternar a visibilidade das colunas.

<ComponentSource
  src="/app/(app)/examples/tasks/components/data-table-view-options.tsx"
  styleName="radix-nova"
/>

```tsx
<DataTableViewOptions table={table} />
```

## RTL

Para habilitar o suporte RTL no shadcn/ui, consulte o [guia de configuração RTL](/docs/rtl).

```tsx
"use client";

import * as React from "react";
import { Button } from "@/examples/radix/ui-rtl/button";
import { Checkbox } from "@/examples/radix/ui-rtl/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/examples/radix/ui-rtl/dropdown-menu";
import { Input } from "@/examples/radix/ui-rtl/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/examples/radix/ui-rtl/table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import {
  useTranslation,
  type Translations,
} from "@/components/language-selector";

const translations: Translations = {
  en: {
    dir: "ltr",
    values: {
      filterEmails: "Filter emails...",
      columns: "Columns",
      status: "Status",
      email: "Email",
      amount: "Amount",
      actions: "Actions",
      copyPaymentId: "Copy payment ID",
      viewCustomer: "View customer",
      viewPaymentDetails: "View payment details",
      selectAll: "Select all",
      selectRow: "Select row",
      openMenu: "Open menu",
      noResults: "No results.",
      rowsSelected: "of",
      rowsSelectedSuffix: "row(s) selected.",
      previous: "Previous",
      next: "Next",
      success: "Success",
      processing: "Processing",
      failed: "Failed",
      pending: "Pending",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      filterEmails: "تصفية البريد الإلكتروني...",
      columns: "الأعمدة",
      status: "الحالة",
      email: "البريد الإلكتروني",
      amount: "المبلغ",
      actions: "الإجراءات",
      copyPaymentId: "نسخ معرف الدفع",
      viewCustomer: "عرض العميل",
      viewPaymentDetails: "عرض تفاصيل الدفع",
      selectAll: "تحديد الكل",
      selectRow: "تحديد الصف",
      openMenu: "فتح القائمة",
      noResults: "لا توجد نتائج.",
      rowsSelected: "من",
      rowsSelectedSuffix: "صف(وف) محدد.",
      previous: "السابق",
      next: "التالي",
      success: "ناجح",
      processing: "قيد المعالجة",
      failed: "فشل",
      pending: "قيد الانتظار",
    },
  },
  he: {
    dir: "rtl",
    values: {
      filterEmails: "סנן אימיילים...",
      columns: "עמודות",
      status: "סטטוס",
      email: "אימייל",
      amount: "סכום",
      actions: "פעולות",
      copyPaymentId: "העתק מזהה תשלום",
      viewCustomer: "צפה בלקוח",
      viewPaymentDetails: "צפה בפרטי תשלום",
      selectAll: "בחר הכל",
      selectRow: "בחר שורה",
      openMenu: "פתח תפריט",
      noResults: "אין תוצאות.",
      rowsSelected: "מתוך",
      rowsSelectedSuffix: "שורות נבחרו.",
      previous: "הקודם",
      next: "הבא",
      success: "הצליח",
      processing: "מעבד",
      failed: "נכשל",
      pending: "ממתין",
    },
  },
};

type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

const data: Payment[] = [
  {
    id: "m5gr84i9",
    amount: 316,
    status: "success",
    email: "ken99@example.com",
  },
  {
    id: "3u1reuv4",
    amount: 242,
    status: "success",
    email: "Abe45@example.com",
  },
  {
    id: "derv1ws0",
    amount: 837,
    status: "processing",
    email: "Monserrat44@example.com",
  },
  {
    id: "5kma53ae",
    amount: 874,
    status: "success",
    email: "Silas22@example.com",
  },
  {
    id: "bhqecj4p",
    amount: 721,
    status: "failed",
    email: "carmella@example.com",
  },
];

export function DataTableRtl() {
  const { t, dir, language } = useTranslation(translations, "ar");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const columns: ColumnDef<Payment>[] = React.useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() ? true : false)
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label={t.selectAll}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label={t.selectRow}
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "status",
        header: t.status,
        cell: ({ row }) => {
          const status = row.getValue("status") as string;
          const statusMap: Record<string, string> = {
            success: t.success,
            processing: t.processing,
            failed: t.failed,
            pending: t.pending,
          };
          return <div className="capitalize">{statusMap[status]}</div>;
        },
      },
      {
        accessorKey: "email",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              {t.email}
              <ArrowUpDown />
            </Button>
          );
        },
        cell: ({ row }) => (
          <div className="lowercase">{row.getValue("email")}</div>
        ),
      },
      {
        accessorKey: "amount",
        header: () => <div className="text-start">{t.amount}</div>,
        cell: ({ row }) => {
          const amount = parseFloat(row.getValue("amount"));
          const formatted = new Intl.NumberFormat(
            dir === "rtl" ? "ar-SA" : "en-US",
            {
              style: "currency",
              currency: "USD",
            },
          ).format(amount);

          return <div className="text-start font-medium">{formatted}</div>;
        },
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const payment = row.original;

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-xs">
                  <span className="sr-only">{t.openMenu}</span>
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-40"
                data-lang={dir === "rtl" ? language : undefined}
              >
                <DropdownMenuGroup>
                  <DropdownMenuLabel>{t.actions}</DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={() => navigator.clipboard.writeText(payment.id)}
                  >
                    {t.copyPaymentId}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>{t.viewCustomer}</DropdownMenuItem>
                  <DropdownMenuItem>{t.viewPaymentDetails}</DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [t, dir, language],
  );

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 py-4">
        <Input
          placeholder={t.filterEmails}
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ms-auto">
              {t.columns} <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align={dir === "rtl" ? "start" : "end"}
            data-lang={dir === "rtl" ? language : undefined}
          >
            <DropdownMenuGroup>
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {t.noResults}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end gap-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} {t.rowsSelected}{" "}
          {table.getFilteredRowModel().rows.length} {t.rowsSelectedSuffix}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {t.previous}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {t.next}
          </Button>
        </div>
      </div>
    </div>
  );
}
```
