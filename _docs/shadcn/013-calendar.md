---
title: Calendar
description: Um component de calendario que permite aos usuarios selecionar uma data ou um intervalo de datas.
base: radix
component: true
links:
  doc: https://react-day-picker.js.org
---

```tsx
"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";

export function CalendarDemo() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-lg border"
      captionLayout="dropdown"
    />
  );
}
```

## Blocks

Construimos uma colecao de mais de 30 blocks de calendario que voce pode usar para construir seus proprios components de calendario.

Veja todos os blocks de calendario na pagina [Biblioteca de Blocks](/blocks/calendar).

## Instalacao

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Comando</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add calendar
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Instale as seguintes dependencias:</Step>

```bash
npm install react-day-picker date-fns
```

<Step>Adicione o component `Button` ao seu projeto.</Step>

O component `Calendar` usa o component `Button`. Certifique-se de que ele esta instalado no seu projeto.

<Step>Copie e cole o codigo a seguir no seu projeto.</Step>

<ComponentSource
  name="calendar"
  title="components/ui/calendar.tsx"
  styleName="radix-nova"
/>

<Step>Atualize os caminhos de importacao para corresponder a configuracao do seu projeto.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Uso

```tsx showLineNumbers
import { Calendar } from "@/components/ui/calendar";
```

```tsx showLineNumbers
const [date, setDate] = React.useState<Date | undefined>(new Date());

return (
  <Calendar
    mode="single"
    selected={date}
    onSelect={setDate}
    className="rounded-lg border"
  />
);
```

Consulte a documentacao do [React DayPicker](https://react-day-picker.js.org) para mais informacoes.

## Sobre

O component `Calendar` e construido sobre o [React DayPicker](https://react-day-picker.js.org).

## Date Picker

Voce pode usar o component `<Calendar>` para construir um date picker. Consulte a pagina [Date Picker](/docs/components/radix/date-picker) para mais informacoes.

## Calendario Persa / Hijri / Jalali

Para usar o calendario persa, edite `components/ui/calendar.tsx` e substitua `react-day-picker` por `react-day-picker/persian`.

```diff
- import { DayPicker } from "react-day-picker"
+ import { DayPicker } from "react-day-picker/persian"
```

```tsx
"use client";

import * as React from "react";
import { Vazirmatn } from "next/font/google";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { getDefaultClassNames, type DayButton } from "react-day-picker";
import { DayPicker } from "react-day-picker/persian";

import { cn } from "@/lib/utils";

const vazirmatn = Vazirmatn({ subsets: ["arabic"] });

export function CalendarHijri() {
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(2025, 5, 12),
  );

  return (
    <div className={vazirmatn.className}>
      <Calendar
        mode="single"
        defaultMonth={date}
        selected={date}
        onSelect={setDate}
        className="rounded-lg border"
      />
    </div>
  );
}

// ----------------------------------------------------------------------------
// The code below is for this example only.
// For your own calendar, you would edit the calendar.tsx component directly.
// ----------------------------------------------------------------------------
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"];
}) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "bg-background group/calendar p-3 [--cell-size:--spacing(8)] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className,
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "flex gap-4 flex-col md:flex-row relative",
          defaultClassNames.months,
        ),
        month: cn("flex flex-col w-full gap-4", defaultClassNames.month),
        nav: cn(
          "flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between",
          defaultClassNames.nav,
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) aria-disabled:opacity-50 p-0 select-none",
          defaultClassNames.button_previous,
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) aria-disabled:opacity-50 p-0 select-none",
          defaultClassNames.button_next,
        ),
        month_caption: cn(
          "flex items-center justify-center h-(--cell-size) w-full px-(--cell-size)",
          defaultClassNames.month_caption,
        ),
        dropdowns: cn(
          "w-full flex items-center text-sm font-medium justify-center h-(--cell-size) gap-1.5",
          defaultClassNames.dropdowns,
        ),
        dropdown_root: cn(
          "relative has-focus:border-ring border border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] rounded-md",
          defaultClassNames.dropdown_root,
        ),
        dropdown: cn("absolute inset-0 opacity-0", defaultClassNames.dropdown),
        caption_label: cn(
          "select-none font-medium",
          captionLayout === "label"
            ? "text-sm"
            : "rounded-md pl-2 pr-1 flex items-center gap-1 text-sm h-8 [&>svg]:text-muted-foreground [&>svg]:size-3.5",
          defaultClassNames.caption_label,
        ),
        table: "w-full border-collapse",
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "text-muted-foreground rounded-md flex-1 font-normal text-[0.8rem] select-none",
          defaultClassNames.weekday,
        ),
        week: cn("flex w-full mt-2", defaultClassNames.week),
        week_number_header: cn(
          "select-none w-(--cell-size)",
          defaultClassNames.week_number_header,
        ),
        week_number: cn(
          "text-[0.8rem] select-none text-muted-foreground",
          defaultClassNames.week_number,
        ),
        day: cn(
          "relative w-full h-full p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md group/day aspect-square select-none",
          defaultClassNames.day,
        ),
        range_start: cn(
          "rounded-l-md bg-accent",
          defaultClassNames.range_start,
        ),
        range_middle: cn("rounded-none", defaultClassNames.range_middle),
        range_end: cn("rounded-r-md bg-accent", defaultClassNames.range_end),
        today: cn(
          "bg-accent text-accent-foreground rounded-md data-[selected=true]:rounded-none",
          defaultClassNames.today,
        ),
        outside: cn(
          "text-muted-foreground aria-selected:text-muted-foreground",
          defaultClassNames.outside,
        ),
        disabled: cn(
          "text-muted-foreground opacity-50",
          defaultClassNames.disabled,
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          );
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (
              <ChevronLeftIcon className={cn("size-4", className)} {...props} />
            );
          }

          if (orientation === "right") {
            return (
              <ChevronRightIcon
                className={cn("size-4", className)}
                {...props}
              />
            );
          }

          return (
            <ChevronDownIcon className={cn("size-4", className)} {...props} />
          );
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-(--cell-size) items-center justify-center text-center">
                {children}
              </div>
            </td>
          );
        },
        ...components,
      }}
      {...props}
    />
  );
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames();

  const ref = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 dark:hover:text-accent-foreground flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 leading-none font-normal group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] data-[range-end=true]:rounded-md data-[range-end=true]:rounded-r-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md data-[range-start=true]:rounded-l-md [&>span]:text-xs [&>span]:opacity-70",
        defaultClassNames.day,
        className,
      )}
      {...props}
    />
  );
}
```

## Data Selecionada (Com Fuso Horario)

O component Calendar aceita uma prop `timeZone` para garantir que as datas sejam exibidas e selecionadas no fuso horario local do usuario.

```tsx showLineNumbers
export function CalendarWithTimezone() {
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [timeZone, setTimeZone] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      timeZone={timeZone}
    />
  );
}
```

**Nota:** Se voce notar um deslocamento na data selecionada (por exemplo, selecionar o dia 20 destaca o dia 19), certifique-se de que a prop `timeZone` esta definida com o fuso horario local do usuario.

**Por que no lado do cliente?** O fuso horario e detectado usando `Intl.DateTimeFormat().resolvedOptions().timeZone` dentro de um `useEffect` para garantir compatibilidade com renderizacao no lado do servidor. Detectar o fuso horario durante a renderizacao causaria erros de hidratacao, pois o servidor e o cliente podem estar em fusos horarios diferentes.

## Exemplos

### Basico

Um component de calendario basico. Usamos `className="rounded-lg border"` para estilizar o calendario.

```tsx
"use client";

import { Calendar } from "@/components/ui/calendar";

export function CalendarBasic() {
  return <Calendar mode="single" className="rounded-lg border" />;
}
```

### Calendario de Intervalo

Use a prop `mode="range"` para habilitar a selecao de intervalo.

```tsx
"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { addDays } from "date-fns";
import { type DateRange } from "react-day-picker";

export function CalendarRange() {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 0, 12),
    to: addDays(new Date(new Date().getFullYear(), 0, 12), 30),
  });

  return (
    <Card className="mx-auto w-fit p-0">
      <CardContent className="p-0">
        <Calendar
          mode="range"
          defaultMonth={dateRange?.from}
          selected={dateRange}
          onSelect={setDateRange}
          numberOfMonths={2}
          disabled={(date) =>
            date > new Date() || date < new Date("1900-01-01")
          }
        />
      </CardContent>
    </Card>
  );
}
```

### Seletor de Mes e Ano

Use `captionLayout="dropdown"` para exibir dropdowns de mes e ano.

```tsx
"use client";

import { Calendar } from "@/components/ui/calendar";

export function CalendarCaption() {
  return (
    <Calendar
      mode="single"
      captionLayout="dropdown"
      className="rounded-lg border"
    />
  );
}
```

### Predefinicoes

```tsx
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { addDays } from "date-fns";

export function CalendarWithPresets() {
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(new Date().getFullYear(), 1, 12),
  );
  const [currentMonth, setCurrentMonth] = React.useState<Date>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );

  return (
    <Card className="mx-auto w-fit max-w-[300px]" size="sm">
      <CardContent>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          month={currentMonth}
          onMonthChange={setCurrentMonth}
          fixedWeeks
          className="p-0 [--cell-size:--spacing(9.5)]"
        />
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 border-t">
        {[
          { label: "Today", value: 0 },
          { label: "Tomorrow", value: 1 },
          { label: "In 3 days", value: 3 },
          { label: "In a week", value: 7 },
          { label: "In 2 weeks", value: 14 },
        ].map((preset) => (
          <Button
            key={preset.value}
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => {
              const newDate = addDays(new Date(), preset.value);
              setDate(newDate);
              setCurrentMonth(
                new Date(newDate.getFullYear(), newDate.getMonth(), 1),
              );
            }}
          >
            {preset.label}
          </Button>
        ))}
      </CardFooter>
    </Card>
  );
}
```

### Seletor de Data e Hora

```tsx
"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Clock2Icon } from "lucide-react";

export function CalendarWithTime() {
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 12),
  );

  return (
    <Card size="sm" className="mx-auto w-fit">
      <CardContent>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="p-0"
        />
      </CardContent>
      <CardFooter className="bg-card border-t">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="time-from">Start Time</FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="time-from"
                type="time"
                step="1"
                defaultValue="10:30:00"
                className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
              <InputGroupAddon>
                <Clock2Icon className="text-muted-foreground" />
              </InputGroupAddon>
            </InputGroup>
          </Field>
          <Field>
            <FieldLabel htmlFor="time-to">End Time</FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="time-to"
                type="time"
                step="1"
                defaultValue="12:30:00"
                className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
              <InputGroupAddon>
                <Clock2Icon className="text-muted-foreground" />
              </InputGroupAddon>
            </InputGroup>
          </Field>
        </FieldGroup>
      </CardFooter>
    </Card>
  );
}
```

### Datas reservadas

```tsx
"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { es } from "react-day-picker/locale";

export function CalendarBookedDates() {
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(new Date().getFullYear(), 1, 3),
  );
  const bookedDates = Array.from(
    { length: 15 },
    (_, i) => new Date(new Date().getFullYear(), 1, 12 + i),
  );

  return (
    <Card className="mx-auto w-fit p-0">
      <CardContent className="p-0">
        <Calendar
          mode="single"
          defaultMonth={date}
          selected={date}
          onSelect={setDate}
          disabled={bookedDates}
          modifiers={{
            booked: bookedDates,
          }}
          modifiersClassNames={{
            booked: "[&>button]:line-through opacity-100",
          }}
        />
      </CardContent>
    </Card>
  );
}
```

### Tamanho de Celula Personalizado

```tsx
"use client";

import * as React from "react";
import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { addDays } from "date-fns";
import { type DateRange } from "react-day-picker";

export function CalendarCustomDays() {
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 11, 8),
    to: addDays(new Date(new Date().getFullYear(), 11, 8), 10),
  });

  return (
    <Card className="mx-auto w-fit p-0">
      <CardContent className="p-0">
        <Calendar
          mode="range"
          defaultMonth={range?.from}
          selected={range}
          onSelect={setRange}
          numberOfMonths={1}
          captionLayout="dropdown"
          className="[--cell-size:--spacing(10)] md:[--cell-size:--spacing(12)]"
          formatters={{
            formatMonthDropdown: (date) => {
              return date.toLocaleString("default", { month: "long" });
            },
          }}
          components={{
            DayButton: ({ children, modifiers, day, ...props }) => {
              const isWeekend =
                day.date.getDay() === 0 || day.date.getDay() === 6;

              return (
                <CalendarDayButton day={day} modifiers={modifiers} {...props}>
                  {children}
                  {!modifiers.outside && (
                    <span>{isWeekend ? "$120" : "$100"}</span>
                  )}
                </CalendarDayButton>
              );
            },
          }}
        />
      </CardContent>
    </Card>
  );
}
```

Voce pode personalizar o tamanho das celulas do calendario usando a variavel CSS `--cell-size`. Voce tambem pode torna-lo responsivo usando valores especificos de breakpoint:

```tsx showLineNumbers
<Calendar
  mode="single"
  selected={date}
  onSelect={setDate}
  className="rounded-lg border [--cell-size:--spacing(11)] md:[--cell-size:--spacing(12)]"
/>
```

Ou use valores fixos:

```tsx showLineNumbers
<Calendar
  mode="single"
  selected={date}
  onSelect={setDate}
  className="rounded-lg border [--cell-size:2.75rem] md:[--cell-size:3rem]"
/>
```

### Numeros de Semana

Use `showWeekNumber` para exibir numeros de semana.

```tsx
"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";

export function CalendarWeekNumbers() {
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(new Date().getFullYear(), 1, 3),
  );

  return (
    <Card className="mx-auto w-fit p-0">
      <CardContent className="p-0">
        <Calendar
          mode="single"
          defaultMonth={date}
          selected={date}
          onSelect={setDate}
          showWeekNumber
        />
      </CardContent>
    </Card>
  );
}
```

## RTL

Para habilitar o suporte RTL no shadcn/ui, consulte o [guia de configuracao RTL](/docs/rtl).

Veja tambem o [Guia Hijri](#calendario-persa--hijri--jalali) para habilitar o calendario Persa / Hijri / Jalali.

```tsx
"use client";

import * as React from "react";
import { Calendar } from "@/examples/radix/ui-rtl/calendar";
import { arSA, he } from "react-day-picker/locale";

import {
  useTranslation,
  type Translations,
} from "@/components/language-selector";

const translations: Translations = {
  en: {
    dir: "ltr",
    values: {},
  },
  ar: {
    dir: "rtl",
    values: {},
  },
  he: {
    dir: "rtl",
    values: {},
  },
};

const locales = {
  ar: arSA,
  he: he,
} as const;

export function CalendarRtl() {
  const { dir, language } = useTranslation(translations, "ar");
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-lg border [--cell-size:--spacing(9)]"
      captionLayout="dropdown"
      dir={dir}
      locale={
        dir === "rtl" ? locales[language as keyof typeof locales] : undefined
      }
    />
  );
}
```

Ao usar RTL, importe o locale de `react-day-picker/locale` e passe tanto as props `locale` quanto `dir` para o component Calendar:

```tsx showLineNumbers
import { arSA } from "react-day-picker/locale";
<Calendar
  mode="single"
  selected={date}
  onSelect={setDate}
  locale={arSA}
  dir="rtl"
/>;
```

## Referencia da API

Consulte a documentacao do [React DayPicker](https://react-day-picker.js.org) para mais informacoes sobre o component `Calendar`.

## Changelog

### Suporte RTL

Se voce esta atualizando de uma versao anterior do component `Calendar`, sera necessario aplicar as seguintes atualizacoes para adicionar suporte a locale:

<Steps>

<Step>Importe o tipo `Locale`.</Step>

Adicione `Locale` as suas importacoes de `react-day-picker`:

```diff
  import {
    DayPicker,
    getDefaultClassNames,
    type DayButton,
+   type Locale,
  } from "react-day-picker"
```

<Step>Adicione a prop `locale` ao component Calendar.</Step>

Adicione a prop `locale` as props do component:

```diff
  function Calendar({
    className,
    classNames,
    showOutsideDays = true,
    captionLayout = "label",
    buttonVariant = "ghost",
+   locale,
    formatters,
    components,
    ...props
  }: React.ComponentProps<typeof DayPicker> & {
    buttonVariant?: React.ComponentProps<typeof Button>["variant"]
  }) {
```

<Step>Passe `locale` para o DayPicker.</Step>

Passe a prop `locale` para o component `DayPicker`:

```diff
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(...)}
      captionLayout={captionLayout}
+     locale={locale}
      formatters={{
        formatMonthDropdown: (date) =>
-         date.toLocaleString("default", { month: "short" }),
+         date.toLocaleString(locale?.code, { month: "short" }),
        ...formatters,
      }}
```

<Step>Atualize o CalendarDayButton para aceitar locale.</Step>

Atualize a assinatura do component `CalendarDayButton` e passe `locale`:

```diff
  function CalendarDayButton({
    className,
    day,
    modifiers,
+   locale,
    ...props
- }: React.ComponentProps<typeof DayButton>) {
+ }: React.ComponentProps<typeof DayButton> & { locale?: Partial<Locale> }) {
```

<Step>Atualize a formatacao de data no CalendarDayButton.</Step>

Use `locale?.code` na formatacao de data:

```diff
    <Button
      variant="ghost"
      size="icon"
-     data-day={day.date.toLocaleDateString()}
+     data-day={day.date.toLocaleDateString(locale?.code)}
      ...
    />
```

<Step>Passe locale para o component DayButton.</Step>

Atualize o uso do component `DayButton` para passar a prop `locale`:

```diff
      components={{
        ...
-       DayButton: CalendarDayButton,
+       DayButton: ({ ...props }) => (
+         <CalendarDayButton locale={locale} {...props} />
+       ),
        ...
      }}
```

<Step>Atualize as classes CSS com suporte a RTL.</Step>

Substitua classes direcionais por propriedades logicas para melhor suporte RTL:

```diff
  // In the day classNames:
- [&:last-child[data-selected=true]_button]:rounded-r-(--cell-radius)
+ [&:last-child[data-selected=true]_button]:rounded-e-(--cell-radius)
- [&:nth-child(2)[data-selected=true]_button]:rounded-l-(--cell-radius)
+ [&:nth-child(2)[data-selected=true]_button]:rounded-s-(--cell-radius)
- [&:first-child[data-selected=true]_button]:rounded-l-(--cell-radius)
+ [&:first-child[data-selected=true]_button]:rounded-s-(--cell-radius)

  // In range_start classNames:
- rounded-l-(--cell-radius) ... after:right-0
+ rounded-s-(--cell-radius) ... after:end-0

  // In range_end classNames:
- rounded-r-(--cell-radius) ... after:left-0
+ rounded-e-(--cell-radius) ... after:start-0

  // In CalendarDayButton className:
- data-[range-end=true]:rounded-r-(--cell-radius)
+ data-[range-end=true]:rounded-e-(--cell-radius)
- data-[range-start=true]:rounded-l-(--cell-radius)
+ data-[range-start=true]:rounded-s-(--cell-radius)
```

</Steps>

Apos aplicar essas alteracoes, voce pode usar a prop `locale` para fornecer formatacao especifica do locale:

```tsx
import { enUS } from "react-day-picker/locale";
<Calendar mode="single" selected={date} onSelect={setDate} locale={enUS} />;
```
