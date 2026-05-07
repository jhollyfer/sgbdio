---
title: Checkbox
description: Um controle que permite ao usuário alternar entre marcado e não marcado.
base: radix
component: true
links:
  doc: https://www.radix-ui.com/docs/primitives/components/checkbox
  api: https://www.radix-ui.com/docs/primitives/components/checkbox#api-reference
---

```tsx
"use client";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { Label } from "@/components/ui/label";

export function CheckboxDemo() {
  return (
    <FieldGroup className="max-w-sm">
      <Field orientation="horizontal">
        <Checkbox id="terms-checkbox" name="terms-checkbox" />
        <Label htmlFor="terms-checkbox">Accept terms and conditions</Label>
      </Field>
      <Field orientation="horizontal">
        <Checkbox
          id="terms-checkbox-2"
          name="terms-checkbox-2"
          defaultChecked
        />
        <FieldContent>
          <FieldLabel htmlFor="terms-checkbox-2">
            Accept terms and conditions
          </FieldLabel>
          <FieldDescription>
            By clicking this checkbox, you agree to the terms.
          </FieldDescription>
        </FieldContent>
      </Field>
      <Field orientation="horizontal" data-disabled>
        <Checkbox id="toggle-checkbox" name="toggle-checkbox" disabled />
        <FieldLabel htmlFor="toggle-checkbox">Enable notifications</FieldLabel>
      </Field>
      <FieldLabel>
        <Field orientation="horizontal">
          <Checkbox id="toggle-checkbox-2" name="toggle-checkbox-2" />
          <FieldContent>
            <FieldTitle>Enable notifications</FieldTitle>
            <FieldDescription>
              You can enable or disable notifications at any time.
            </FieldDescription>
          </FieldContent>
        </Field>
      </FieldLabel>
    </FieldGroup>
  );
}
```

## Instalacao

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Comando</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add checkbox
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Instale as seguintes dependencias:</Step>

```bash
npm install radix-ui
```

<Step>Copie e cole o seguinte codigo no seu projeto.</Step>

<ComponentSource
  name="checkbox"
  title="components/ui/checkbox.tsx"
  styleName="radix-nova"
/>

<Step>Atualize os caminhos de importacao para corresponder a configuracao do seu projeto.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Uso

```tsx
import { Checkbox } from "@/components/ui/checkbox";
```

```tsx
<Checkbox />
```

## Estado Marcado

Use `defaultChecked` para checkboxes nao controlados, ou `checked` e
`onCheckedChange` para controlar o state.

```tsx showLineNumbers
import * as React from "react";

export function Example() {
  const [checked, setChecked] = React.useState(false);

  return <Checkbox checked={checked} onCheckedChange={setChecked} />;
}
```

## Estado Invalido

Defina `aria-invalid` no checkbox e `data-invalid` no wrapper do field para
exibir os estilos de invalido.

```tsx
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";

export function CheckboxInvalid() {
  return (
    <FieldGroup className="mx-auto w-56">
      <Field orientation="horizontal" data-invalid>
        <Checkbox
          id="terms-checkbox-invalid"
          name="terms-checkbox-invalid"
          aria-invalid
        />
        <FieldLabel htmlFor="terms-checkbox-invalid">
          Accept terms and conditions
        </FieldLabel>
      </Field>
    </FieldGroup>
  );
}
```

## Exemplos

### Basico

Combine o checkbox com `Field` e `FieldLabel` para layout e rotulagem adequados.

```tsx
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";

export function CheckboxBasic() {
  return (
    <FieldGroup className="mx-auto w-56">
      <Field orientation="horizontal">
        <Checkbox id="terms-checkbox-basic" name="terms-checkbox-basic" />
        <FieldLabel htmlFor="terms-checkbox-basic">
          Accept terms and conditions
        </FieldLabel>
      </Field>
    </FieldGroup>
  );
}
```

### Descricao

Use `FieldContent` e `FieldDescription` para texto auxiliar.

```tsx
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

export function CheckboxDescription() {
  return (
    <FieldGroup className="mx-auto w-72">
      <Field orientation="horizontal">
        <Checkbox
          id="terms-checkbox-desc"
          name="terms-checkbox-desc"
          defaultChecked
        />
        <FieldContent>
          <FieldLabel htmlFor="terms-checkbox-desc">
            Accept terms and conditions
          </FieldLabel>
          <FieldDescription>
            By clicking this checkbox, you agree to the terms and conditions.
          </FieldDescription>
        </FieldContent>
      </Field>
    </FieldGroup>
  );
}
```

### Desabilitado

Use a prop `disabled` para impedir a interacao e adicione o atributo `data-disabled` ao component `<Field>` para estilos de desabilitado.

```tsx
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";

export function CheckboxDisabled() {
  return (
    <FieldGroup className="mx-auto w-56">
      <Field orientation="horizontal" data-disabled>
        <Checkbox
          id="toggle-checkbox-disabled"
          name="toggle-checkbox-disabled"
          disabled
        />
        <FieldLabel htmlFor="toggle-checkbox-disabled">
          Enable notifications
        </FieldLabel>
      </Field>
    </FieldGroup>
  );
}
```

### Grupo

Use multiplos fields para criar uma lista de checkboxes.

```tsx
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";

export function CheckboxGroup() {
  return (
    <FieldSet>
      <FieldLegend variant="label">
        Show these items on the desktop:
      </FieldLegend>
      <FieldDescription>
        Select the items you want to show on the desktop.
      </FieldDescription>
      <FieldGroup className="gap-3">
        <Field orientation="horizontal">
          <Checkbox
            id="finder-pref-9k2-hard-disks-ljj-checkbox"
            name="finder-pref-9k2-hard-disks-ljj-checkbox"
            defaultChecked
          />
          <FieldLabel
            htmlFor="finder-pref-9k2-hard-disks-ljj-checkbox"
            className="font-normal"
          >
            Hard disks
          </FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <Checkbox
            id="finder-pref-9k2-external-disks-1yg-checkbox"
            name="finder-pref-9k2-external-disks-1yg-checkbox"
            defaultChecked
          />
          <FieldLabel
            htmlFor="finder-pref-9k2-external-disks-1yg-checkbox"
            className="font-normal"
          >
            External disks
          </FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <Checkbox
            id="finder-pref-9k2-cds-dvds-fzt-checkbox"
            name="finder-pref-9k2-cds-dvds-fzt-checkbox"
          />
          <FieldLabel
            htmlFor="finder-pref-9k2-cds-dvds-fzt-checkbox"
            className="font-normal"
          >
            CDs, DVDs, and iPods
          </FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <Checkbox
            id="finder-pref-9k2-connected-servers-6l2-checkbox"
            name="finder-pref-9k2-connected-servers-6l2-checkbox"
          />
          <FieldLabel
            htmlFor="finder-pref-9k2-connected-servers-6l2-checkbox"
            className="font-normal"
          >
            Connected servers
          </FieldLabel>
        </Field>
      </FieldGroup>
    </FieldSet>
  );
}
```

### Tabela

```tsx
"use client";

import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const tableData = [
  {
    id: "1",
    name: "Sarah Chen",
    email: "sarah.chen@example.com",
    role: "Admin",
  },
  {
    id: "2",
    name: "Marcus Rodriguez",
    email: "marcus.rodriguez@example.com",
    role: "User",
  },
  {
    id: "3",
    name: "Priya Patel",
    email: "priya.patel@example.com",
    role: "User",
  },
  {
    id: "4",
    name: "David Kim",
    email: "david.kim@example.com",
    role: "Editor",
  },
];

export function CheckboxInTable() {
  const [selectedRows, setSelectedRows] = React.useState<Set<string>>(
    new Set(["1"]),
  );

  const selectAll = selectedRows.size === tableData.length;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(tableData.map((row) => row.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedRows(newSelected);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-8">
            <Checkbox
              id="select-all-checkbox"
              name="select-all-checkbox"
              checked={selectAll}
              onCheckedChange={handleSelectAll}
            />
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tableData.map((row) => (
          <TableRow
            key={row.id}
            data-state={selectedRows.has(row.id) ? "selected" : undefined}
          >
            <TableCell>
              <Checkbox
                id={`row-${row.id}-checkbox`}
                name={`row-${row.id}-checkbox`}
                checked={selectedRows.has(row.id)}
                onCheckedChange={(checked) =>
                  handleSelectRow(row.id, checked === true)
                }
              />
            </TableCell>
            <TableCell className="font-medium">{row.name}</TableCell>
            <TableCell>{row.email}</TableCell>
            <TableCell>{row.role}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

## RTL

Para habilitar o suporte RTL no shadcn/ui, consulte o [guia de configuracao RTL](/docs/rtl).

```tsx
"use client";

import * as React from "react";
import { Checkbox } from "@/examples/radix/ui-rtl/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/examples/radix/ui-rtl/field";
import { Label } from "@/examples/radix/ui-rtl/label";

import {
  useTranslation,
  type Translations,
} from "@/components/language-selector";

const translations: Translations = {
  en: {
    dir: "ltr",
    values: {
      acceptTerms: "Accept terms and conditions",
      acceptTermsDescription:
        "By clicking this checkbox, you agree to the terms.",
      enableNotifications: "Enable notifications",
      enableNotificationsDescription:
        "You can enable or disable notifications at any time.",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      acceptTerms: "قبول الشروط والأحكام",
      acceptTermsDescription: "بالنقر على هذا المربع، فإنك توافق على الشروط.",
      enableNotifications: "تفعيل الإشعارات",
      enableNotificationsDescription:
        "يمكنك تفعيل أو إلغاء تفعيل الإشعارات في أي وقت.",
    },
  },
  he: {
    dir: "rtl",
    values: {
      acceptTerms: "קבל תנאים והגבלות",
      acceptTermsDescription:
        "על ידי לחיצה על תיבת הסימון הזו, אתה מסכים לתנאים.",
      enableNotifications: "הפעל התראות",
      enableNotificationsDescription:
        "אתה יכול להפעיל או להשבית התראות בכל עת.",
    },
  },
};

export function CheckboxRtl() {
  const { dir, t } = useTranslation(translations, "ar");

  return (
    <FieldGroup className="max-w-sm" dir={dir}>
      <Field orientation="horizontal">
        <Checkbox id="terms-checkbox-rtl" name="terms-checkbox" />
        <Label htmlFor="terms-checkbox-rtl">{t.acceptTerms}</Label>
      </Field>
      <Field orientation="horizontal">
        <Checkbox
          id="terms-checkbox-2-rtl"
          name="terms-checkbox-2"
          defaultChecked
        />
        <FieldContent>
          <FieldLabel htmlFor="terms-checkbox-2-rtl">
            {t.acceptTerms}
          </FieldLabel>
          <FieldDescription>{t.acceptTermsDescription}</FieldDescription>
        </FieldContent>
      </Field>
      <Field orientation="horizontal" data-disabled>
        <Checkbox id="toggle-checkbox-rtl" name="toggle-checkbox" disabled />
        <FieldLabel htmlFor="toggle-checkbox-rtl">
          {t.enableNotifications}
        </FieldLabel>
      </Field>
      <FieldLabel>
        <Field orientation="horizontal">
          <Checkbox id="toggle-checkbox-2" name="toggle-checkbox-2" />
          <FieldContent>
            <FieldTitle>{t.enableNotifications}</FieldTitle>
            <FieldDescription>
              {t.enableNotificationsDescription}
            </FieldDescription>
          </FieldContent>
        </Field>
      </FieldLabel>
    </FieldGroup>
  );
}
```

## Referencia da API

Consulte a documentacao do [Radix UI](https://www.radix-ui.com/docs/primitives/components/checkbox#api-reference) para mais informacoes.
