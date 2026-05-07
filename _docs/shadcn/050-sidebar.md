---
title: Sidebar
description: Um component de sidebar composável, temático e customizável.
base: radix
component: true
---

import { ExternalLinkIcon } from "lucide-react"

<figure className="flex flex-col gap-4">
  ```tsx
"use client"

import \* as React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
Collapsible,
CollapsibleContent,
CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
DropdownMenu,
DropdownMenuContent,
DropdownMenuGroup,
DropdownMenuItem,
DropdownMenuLabel,
DropdownMenuSeparator,
DropdownMenuShortcut,
DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
Sidebar,
SidebarContent,
SidebarFooter,
SidebarGroup,
SidebarGroupLabel,
SidebarHeader,
SidebarInset,
SidebarMenu,
SidebarMenuAction,
SidebarMenuButton,
SidebarMenuItem,
SidebarMenuSub,
SidebarMenuSubButton,
SidebarMenuSubItem,
SidebarProvider,
SidebarRail,
SidebarTrigger,
useSidebar,
} from "@/components/ui/sidebar"
import {
AudioWaveform,
BadgeCheck,
Bell,
BookOpen,
Bot,
ChevronRight,
ChevronsUpDown,
Command,
CreditCard,
Folder,
Forward,
Frame,
GalleryVerticalEnd,
LogOut,
Map,
MoreHorizontal,
PieChart,
Plus,
Settings2,
Sparkles,
SquareTerminal,
Trash2,
} from "lucide-react"

// This is sample data.
const data = {
user: {
name: "shadcn",
email: "m@example.com",
avatar: "/avatars/shadcn.jpg",
},
teams: [
{
name: "Acme Inc",
logo: GalleryVerticalEnd,
plan: "Enterprise",
},
{
name: "Acme Corp.",
logo: AudioWaveform,
plan: "Startup",
},
{
name: "Evil Corp.",
logo: Command,
plan: "Free",
},
],
navMain: [
{
title: "Playground",
url: "#",
icon: SquareTerminal,
isActive: true,
items: [
{
title: "History",
url: "#",
},
{
title: "Starred",
url: "#",
},
{
title: "Settings",
url: "#",
},
],
},
{
title: "Models",
url: "#",
icon: Bot,
items: [
{
title: "Genesis",
url: "#",
},
{
title: "Explorer",
url: "#",
},
{
title: "Quantum",
url: "#",
},
],
},
{
title: "Documentation",
url: "#",
icon: BookOpen,
items: [
{
title: "Introduction",
url: "#",
},
{
title: "Get Started",
url: "#",
},
{
title: "Tutorials",
url: "#",
},
{
title: "Changelog",
url: "#",
},
],
},
{
title: "Settings",
url: "#",
icon: Settings2,
items: [
{
title: "General",
url: "#",
},
{
title: "Team",
url: "#",
},
{
title: "Billing",
url: "#",
},
{
title: "Limits",
url: "#",
},
],
},
],
projects: [
{
name: "Design Engineering",
url: "#",
icon: Frame,
},
{
name: "Sales & Marketing",
url: "#",
icon: PieChart,
},
{
name: "Travel",
url: "#",
icon: Map,
},
],
}

function TeamSwitcher({
teams,
}: {
teams: {
name: string
logo: React.ElementType
plan: string
}[]
}) {
const { isMobile } = useSidebar()
const [activeTeam, setActiveTeam] = React.useState(teams[0])

if (!activeTeam) {
return null
}

return (
<SidebarMenu>
<SidebarMenuItem>
<DropdownMenu>
<DropdownMenuTrigger asChild>
<SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >

<div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
<activeTeam.logo className="size-4" />
</div>
<div className="grid flex-1 text-left text-sm leading-tight">
<span className="truncate font-medium">{activeTeam.name}</span>
<span className="truncate text-xs">{activeTeam.plan}</span>
</div>
<ChevronsUpDown className="ml-auto" />
</SidebarMenuButton>
</DropdownMenuTrigger>
<DropdownMenuContent
className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
align="start"
side={isMobile ? "bottom" : "right"}
sideOffset={4} >
<DropdownMenuGroup>
<DropdownMenuLabel className="text-muted-foreground text-xs">
Teams
</DropdownMenuLabel>
{teams.map((team, index) => (
<DropdownMenuItem
key={team.name}
onClick={() => setActiveTeam(team)}
className="gap-2 p-2" >
<div className="flex size-6 items-center justify-center rounded-md border">
<team.logo className="size-3.5 shrink-0" />
</div>
{team.name}
<DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
</DropdownMenuItem>
))}
</DropdownMenuGroup>
<DropdownMenuSeparator />
<DropdownMenuGroup>
<DropdownMenuItem className="gap-2 p-2">
<div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
<Plus className="size-4" />
</div>
<div className="text-muted-foreground font-medium">
Add team
</div>
</DropdownMenuItem>
</DropdownMenuGroup>
</DropdownMenuContent>
</DropdownMenu>
</SidebarMenuItem>
</SidebarMenu>
)
}

function NavMain({
items,
}: {
items: {
title: string
url: string
icon?: React.ElementType
isActive?: boolean
items?: {
title: string
url: string
}[]
}[]
}) {
return (
<SidebarGroup>
<SidebarGroupLabel>Platform</SidebarGroupLabel>
<SidebarMenu>
{items.map((item) => (
<Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
<SidebarMenuItem>
<CollapsibleTrigger asChild>
<SidebarMenuButton tooltip={item.title}>
{item.icon && <item.icon />}
<span>{item.title}</span>
<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
</SidebarMenuButton>
</CollapsibleTrigger>
<CollapsibleContent>
<SidebarMenuSub>
{item.items?.map((subItem) => (
<SidebarMenuSubItem key={subItem.title}>
<SidebarMenuSubButton asChild>
<a href={subItem.url}>
<span>{subItem.title}</span>
</a>
</SidebarMenuSubButton>
</SidebarMenuSubItem>
))}
</SidebarMenuSub>
</CollapsibleContent>
</SidebarMenuItem>
</Collapsible>
))}
</SidebarMenu>
</SidebarGroup>
)
}

function NavProjects({
projects,
}: {
projects: {
name: string
url: string
icon: React.ElementType
}[]
}) {
const { isMobile } = useSidebar()

return (
<SidebarGroup className="group-data-[collapsible=icon]:hidden">
<SidebarGroupLabel>Projects</SidebarGroupLabel>
<SidebarMenu>
{projects.map((item) => (
<SidebarMenuItem key={item.name}>
<SidebarMenuButton asChild>
<a href={item.url}>
<item.icon />
<span>{item.name}</span>
</a>
</SidebarMenuButton>
<DropdownMenu>
<DropdownMenuTrigger asChild>
<SidebarMenuAction showOnHover>
<MoreHorizontal />
<span className="sr-only">More</span>
</SidebarMenuAction>
</DropdownMenuTrigger>
<DropdownMenuContent
className="w-48 rounded-lg"
side={isMobile ? "bottom" : "right"}
align={isMobile ? "end" : "start"} >
<DropdownMenuGroup>
<DropdownMenuItem>
<Folder className="text-muted-foreground" />
<span>View Project</span>
</DropdownMenuItem>
<DropdownMenuItem>
<Forward className="text-muted-foreground" />
<span>Share Project</span>
</DropdownMenuItem>
</DropdownMenuGroup>
<DropdownMenuSeparator />
<DropdownMenuGroup>
<DropdownMenuItem>
<Trash2 className="text-muted-foreground" />
<span>Delete Project</span>
</DropdownMenuItem>
</DropdownMenuGroup>
</DropdownMenuContent>
</DropdownMenu>
</SidebarMenuItem>
))}
<SidebarMenuItem>
<SidebarMenuButton className="text-sidebar-foreground/70">
<MoreHorizontal className="text-sidebar-foreground/70" />
<span>More</span>
</SidebarMenuButton>
</SidebarMenuItem>
</SidebarMenu>
</SidebarGroup>
)
}

function NavUser({
user,
}: {
user: {
name: string
email: string
avatar: string
}
}) {
const { isMobile } = useSidebar()

return (
<SidebarMenu>
<SidebarMenuItem>
<DropdownMenu>
<DropdownMenuTrigger asChild>
<SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
<Avatar className="h-8 w-8 rounded-lg">
<AvatarImage src={user.avatar} alt={user.name} />
<AvatarFallback className="rounded-lg">CN</AvatarFallback>
</Avatar>

<div className="grid flex-1 text-left text-sm leading-tight">
<span className="truncate font-medium">{user.name}</span>
<span className="truncate text-xs">{user.email}</span>
</div>
<ChevronsUpDown className="ml-auto size-4" />
</SidebarMenuButton>
</DropdownMenuTrigger>
<DropdownMenuContent
className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
side={isMobile ? "bottom" : "right"}
align="end"
sideOffset={4} >
<DropdownMenuGroup>
<DropdownMenuLabel className="p-0 font-normal">
<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
<Avatar className="h-8 w-8 rounded-lg">
<AvatarImage src={user.avatar} alt={user.name} />
<AvatarFallback className="rounded-lg">CN</AvatarFallback>
</Avatar>
<div className="grid flex-1 text-left text-sm leading-tight">
<span className="truncate font-medium">{user.name}</span>
<span className="truncate text-xs">{user.email}</span>
</div>
</div>
</DropdownMenuLabel>
</DropdownMenuGroup>
<DropdownMenuSeparator />
<DropdownMenuGroup>
<DropdownMenuItem>
<Sparkles />
Upgrade to Pro
</DropdownMenuItem>
</DropdownMenuGroup>
<DropdownMenuSeparator />
<DropdownMenuGroup>
<DropdownMenuItem>
<BadgeCheck />
Account
</DropdownMenuItem>
<DropdownMenuItem>
<CreditCard />
Billing
</DropdownMenuItem>
<DropdownMenuItem>
<Bell />
Notifications
</DropdownMenuItem>
</DropdownMenuGroup>
<DropdownMenuSeparator />
<DropdownMenuGroup>
<DropdownMenuItem>
<LogOut />
Log out
</DropdownMenuItem>
</DropdownMenuGroup>
</DropdownMenuContent>
</DropdownMenu>
</SidebarMenuItem>
</SidebarMenu>
)
}

export function AppSidebar({
...props
}: React.ComponentProps<typeof Sidebar>) {
return (
<SidebarProvider>
<Sidebar collapsible="icon" {...props}>
<SidebarHeader>
<TeamSwitcher teams={data.teams} />
</SidebarHeader>
<SidebarContent>
<NavMain items={data.navMain} />
<NavProjects projects={data.projects} />
</SidebarContent>
<SidebarFooter>
<NavUser user={data.user} />
</SidebarFooter>
<SidebarRail />
</Sidebar>
<SidebarInset>

<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
<div className="flex items-center gap-2 px-4">
<SidebarTrigger className="-ml-1" />
</div>
</header>
</SidebarInset>
</SidebarProvider>
)
}

````
  <figcaption className="text-center text-sm text-gray-500">
    Uma sidebar que colapsa para ícones.
  </figcaption>
</figure>

Sidebars são um dos components mais complexos de construir. Elas são centrais
para qualquer aplicação e frequentemente contêm muitas partes móveis.

Agora temos uma base sólida para construir sobre ela. Composável. Temática.
Customizável.

[Navegue pela Biblioteca de Blocks](/blocks).

## Instalação

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Comando</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add sidebar
````

</TabsContent>

<TabsContent value="manual">

<ComponentSource
  name="sidebar"
  title="components/ui/sidebar.tsx"
  styleName="radix-nova"
/>

</TabsContent>

</CodeTabs>

## Estrutura

Um component `Sidebar` é composto pelas seguintes partes:

- `SidebarProvider` - Gerencia o state de colapso.
- `Sidebar` - O container da sidebar.
- `SidebarHeader` e `SidebarFooter` - Fixos no topo e no rodapé da sidebar.
- `SidebarContent` - Conteúdo com scroll.
- `SidebarGroup` - Seção dentro do `SidebarContent`.
- `SidebarTrigger` - Trigger para o `Sidebar`.

<Image
  src="/images/sidebar-structure.png"
  width="716"
  height="420"
  alt="Sidebar Structure"
  className="mt-6 w-full overflow-hidden rounded-lg border dark:hidden"
/>
<Image
  src="/images/sidebar-structure-dark.png"
  width="716"
  height="420"
  alt="Sidebar Structure"
  className="mt-6 hidden w-full overflow-hidden rounded-lg border dark:block"
/>

## Uso

```tsx showLineNumbers title="app/layout.tsx"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
```

```tsx showLineNumbers title="components/app-sidebar.tsx"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
```

## SidebarProvider

O component `SidebarProvider` é usado para fornecer o contexto da sidebar para o component `Sidebar`. Você deve sempre envolver sua aplicação em um component `SidebarProvider`.

### Props

| Nome           | Tipo                      | Descrição                                           |
| -------------- | ------------------------- | --------------------------------------------------- |
| `defaultOpen`  | `boolean`                 | State padrão de abertura da sidebar.                |
| `open`         | `boolean`                 | State de abertura da sidebar (controlado).          |
| `onOpenChange` | `(open: boolean) => void` | Define o state de abertura da sidebar (controlado). |

### Largura

Se você tem uma única sidebar na sua aplicação, pode usar as variáveis `SIDEBAR_WIDTH` e `SIDEBAR_WIDTH_MOBILE` em `sidebar.tsx` para definir a largura da sidebar.

```tsx showLineNumbers title="components/ui/sidebar.tsx"
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
```

Para múltiplas sidebars na sua aplicação, você pode usar as variáveis CSS `--sidebar-width` e `--sidebar-width-mobile` na prop `style`.

```tsx showLineNumbers
<SidebarProvider
  style={{
    "--sidebar-width": "20rem",
    "--sidebar-width-mobile": "20rem",
  }}
>
  <Sidebar />
</SidebarProvider>
```

### Atalho de Teclado

Para acionar a sidebar, use o atalho de teclado `cmd+b` no Mac e `ctrl+b` no Windows.

```tsx showLineNumbers title="components/ui/sidebar.tsx"
const SIDEBAR_KEYBOARD_SHORTCUT = "b";
```

## Sidebar

O component principal `Sidebar` usado para renderizar uma sidebar colapsável.

### Props

| Propriedade   | Tipo                              | Descrição                        |
| ------------- | --------------------------------- | -------------------------------- |
| `side`        | `left` ou `right`                 | O lado da sidebar.               |
| `variant`     | `sidebar`, `floating` ou `inset`  | A variante da sidebar.           |
| `collapsible` | `offcanvas`, `icon` ou `none`     | State colapsável da sidebar.     |

| Prop        | Descrição                                                        |
| ----------- | ---------------------------------------------------------------- |
| `offcanvas` | Uma sidebar colapsável que desliza da esquerda ou direita.       |
| `icon`      | Uma sidebar que colapsa para ícones.                             |
| `none`      | Uma sidebar não colapsável.                                      |

<Callout>
  **Nota:** Se você usar a variante `inset`, lembre-se de envolver seu conteúdo
  principal em um component `SidebarInset`.
</Callout>

```tsx showLineNumbers
<SidebarProvider>
  <Sidebar variant="inset" />
  <SidebarInset>
    <main>{children}</main>
  </SidebarInset>
</SidebarProvider>
```

## useSidebar

O hook `useSidebar` é usado para controlar a sidebar.

```tsx showLineNumbers
import { useSidebar } from "@/components/ui/sidebar";

export function AppSidebar() {
  const {
    state,
    open,
    setOpen,
    openMobile,
    setOpenMobile,
    isMobile,
    toggleSidebar,
  } = useSidebar();
}
```

| Propriedade     | Tipo                      | Descrição                                           |
| --------------- | ------------------------- | --------------------------------------------------- |
| `state`         | `expanded` ou `collapsed` | O state atual da sidebar.                           |
| `open`          | `boolean`                 | Se a sidebar está aberta.                           |
| `setOpen`       | `(open: boolean) => void` | Define o state de abertura da sidebar.              |
| `openMobile`    | `boolean`                 | Se a sidebar está aberta no mobile.                 |
| `setOpenMobile` | `(open: boolean) => void` | Define o state de abertura da sidebar no mobile.    |
| `isMobile`      | `boolean`                 | Se a sidebar está no mobile.                        |
| `toggleSidebar` | `() => void`              | Alterna a sidebar. Desktop e mobile.                |

## SidebarHeader

Use o component `SidebarHeader` para adicionar um header fixo à sidebar.

```tsx showLineNumbers title="components/app-sidebar.tsx"
<Sidebar>
  <SidebarHeader>
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton>
              Select Workspace
              <ChevronDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
            <DropdownMenuItem>
              <span>Acme Inc</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarHeader>
</Sidebar>
```

## SidebarFooter

Use o component `SidebarFooter` para adicionar um footer fixo à sidebar.

```tsx showLineNumbers
<Sidebar>
  <SidebarFooter>
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton>
          <User2 /> Username
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarFooter>
</Sidebar>
```

## SidebarContent

O component `SidebarContent` é usado para envolver o conteúdo da sidebar. É aqui que você adiciona seus components `SidebarGroup`. Ele possui scroll.

```tsx showLineNumbers
<Sidebar>
  <SidebarContent>
    <SidebarGroup />
    <SidebarGroup />
  </SidebarContent>
</Sidebar>
```

## SidebarGroup

Use o component `SidebarGroup` para criar uma seção dentro da sidebar.

Um `SidebarGroup` possui um `SidebarGroupLabel`, um `SidebarGroupContent` e um `SidebarGroupAction` opcional.

```tsx showLineNumbers
<SidebarGroup>
  <SidebarGroupLabel>Application</SidebarGroupLabel>
  <SidebarGroupAction>
    <Plus /> <span className="sr-only">Add Project</span>
  </SidebarGroupAction>
  <SidebarGroupContent></SidebarGroupContent>
</SidebarGroup>
```

Para tornar um `SidebarGroup` colapsável, envolva-o em um `Collapsible`.

```tsx showLineNumbers
<Collapsible defaultOpen className="group/collapsible">
  <SidebarGroup>
    <SidebarGroupLabel asChild>
      <CollapsibleTrigger>
        Help
        <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
      </CollapsibleTrigger>
    </SidebarGroupLabel>
    <CollapsibleContent>
      <SidebarGroupContent />
    </CollapsibleContent>
  </SidebarGroup>
</Collapsible>
```

## SidebarMenu

O component `SidebarMenu` é usado para construir um menu dentro de um `SidebarGroup`.

<Image
  src="/images/sidebar-menu.png"
  width="716"
  height="420"
  alt="Sidebar Menu"
  className="mt-6 w-full overflow-hidden rounded-lg border dark:hidden"
/>
<Image
  src="/images/sidebar-menu-dark.png"
  width="716"
  height="420"
  alt="Sidebar Menu"
  className="mt-6 hidden w-full overflow-hidden rounded-lg border dark:block"
/>

```tsx showLineNumbers
<SidebarMenu>
  {projects.map((project) => (
    <SidebarMenuItem key={project.name}>
      <SidebarMenuButton asChild>
        <a href={project.url}>
          <project.icon />
          <span>{project.name}</span>
        </a>
      </SidebarMenuButton>
    </SidebarMenuItem>
  ))}
</SidebarMenu>
```

## SidebarMenuButton

O component `SidebarMenuButton` é usado para renderizar um botão de menu dentro de um `SidebarMenuItem`.

Por padrão, o `SidebarMenuButton` renderiza um botão, mas você pode usar a prop `asChild` para renderizar um component diferente como um `Link` ou uma tag `a`.

Use a prop `isActive` para marcar um item de menu como ativo.

```tsx showLineNumbers
<SidebarMenuButton asChild isActive>
  <a href="#">Home</a>
</SidebarMenuButton>
```

## SidebarMenuAction

O component `SidebarMenuAction` é usado para renderizar uma ação de menu dentro de um `SidebarMenuItem`.

```tsx showLineNumbers
<SidebarMenuItem>
  <SidebarMenuButton asChild>
    <a href="#">
      <Home />
      <span>Home</span>
    </a>
  </SidebarMenuButton>
  <SidebarMenuAction>
    <Plus /> <span className="sr-only">Add Project</span>
  </SidebarMenuAction>
</SidebarMenuItem>
```

## SidebarMenuSub

O component `SidebarMenuSub` é usado para renderizar um submenu dentro de um `SidebarMenu`.

```tsx showLineNumbers
<SidebarMenuItem>
  <SidebarMenuButton />
  <SidebarMenuSub>
    <SidebarMenuSubItem>
      <SidebarMenuSubButton />
    </SidebarMenuSubItem>
  </SidebarMenuSub>
</SidebarMenuItem>
```

## SidebarMenuBadge

O component `SidebarMenuBadge` é usado para renderizar um badge dentro de um `SidebarMenuItem`.

```tsx showLineNumbers
<SidebarMenuItem>
  <SidebarMenuButton />
  <SidebarMenuBadge>24</SidebarMenuBadge>
</SidebarMenuItem>
```

## SidebarMenuSkeleton

O component `SidebarMenuSkeleton` é usado para renderizar um skeleton para um `SidebarMenu`.

```tsx showLineNumbers
<SidebarMenu>
  {Array.from({ length: 5 }).map((_, index) => (
    <SidebarMenuItem key={index}>
      <SidebarMenuSkeleton />
    </SidebarMenuItem>
  ))}
</SidebarMenu>
```

## SidebarTrigger

Use o component `SidebarTrigger` para renderizar um botão que alterna a sidebar.

```tsx showLineNumbers
import { useSidebar } from "@/components/ui/sidebar";

export function CustomTrigger() {
  const { toggleSidebar } = useSidebar();

  return <button onClick={toggleSidebar}>Toggle Sidebar</button>;
}
```

## SidebarRail

O component `SidebarRail` é usado para renderizar um trilho dentro de um `Sidebar`. Este trilho pode ser usado para alternar a sidebar.

```tsx showLineNumbers
<Sidebar>
  <SidebarHeader />
  <SidebarContent>
    <SidebarGroup />
  </SidebarContent>
  <SidebarFooter />
  <SidebarRail />
</Sidebar>
```

## Sidebar Controlada

Use as props `open` e `onOpenChange` para controlar a sidebar.

```tsx showLineNumbers
export function AppSidebar() {
  const [open, setOpen] = React.useState(false);

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <Sidebar />
    </SidebarProvider>
  );
}
```

## Tematização

Usamos as seguintes variáveis CSS para tematizar a sidebar.

```css
@layer base {
  :root {
    --sidebar-background: 0 0% 98%;
    --sidebar-foreground: 240 5.3% 26.1%;
    --sidebar-primary: 240 5.9% 10%;
    --sidebar-primary-foreground: 0 0% 98%;
    --sidebar-accent: 240 4.8% 95.9%;
    --sidebar-accent-foreground: 240 5.9% 10%;
    --sidebar-border: 220 13% 91%;
    --sidebar-ring: 217.2 91.2% 59.8%;
  }

  .dark {
    --sidebar-background: 240 5.9% 10%;
    --sidebar-foreground: 240 4.8% 95.9%;
    --sidebar-primary: 0 0% 98%;
    --sidebar-primary-foreground: 240 5.9% 10%;
    --sidebar-accent: 240 3.7% 15.9%;
    --sidebar-accent-foreground: 240 4.8% 95.9%;
    --sidebar-border: 240 3.7% 15.9%;
    --sidebar-ring: 217.2 91.2% 59.8%;
  }
}
```

## Estilização

Aqui estão algumas dicas para estilizar a sidebar com base em diferentes states.

```tsx
<Sidebar collapsible="icon">
  <SidebarContent>
    <SidebarGroup className="group-data-[collapsible=icon]:hidden" />
  </SidebarContent>
</Sidebar>
```

```tsx
<SidebarMenuItem>
  <SidebarMenuButton />
  <SidebarMenuAction className="peer-data-[active=true]/menu-button:opacity-100" />
</SidebarMenuItem>
```

## RTL

Para habilitar o suporte a RTL no shadcn/ui, consulte o [guia de configuração RTL](/docs/rtl).

{/_ prettier-ignore _/}
<Button asChild size="sm" className="mt-6">
<a href="/view/radix-nova/sidebar-rtl" target="_blank">Ver Sidebar RTL <ExternalLinkIcon /></a>
</Button>

## Changelog

### Suporte a RTL

Se você está atualizando de uma versão anterior do component `Sidebar`, precisará aplicar as seguintes atualizações para adicionar suporte a RTL:

<Steps>

<Step>Adicione a prop `dir` ao component Sidebar.</Step>

Adicione `dir` às props desestruturadas e passe-a para o `SheetContent` no mobile:

```diff
  function Sidebar({
    side = "left",
    variant = "sidebar",
    collapsible = "offcanvas",
    className,
    children,
+   dir,
    ...props
  }: React.ComponentProps<"div"> & {
    side?: "left" | "right"
    variant?: "sidebar" | "floating" | "inset"
    collapsible?: "offcanvas" | "icon" | "none"
  }) {
```

Em seguida, passe-a para o `SheetContent` na visualização mobile:

```diff
  <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
    <SheetContent
+     dir={dir}
      data-sidebar="sidebar"
      data-slot="sidebar"
      data-mobile="true"
```

<Step>Adicione o atributo `data-side` ao container da sidebar.</Step>

Adicione `data-side={side}` ao elemento container da sidebar:

```diff
  <div
    data-slot="sidebar-container"
+   data-side={side}
    className={cn(
```

<Step>Atualize as classes de posicionamento do container da sidebar.</Step>

Substitua as classes condicionais JavaScript ternárias por seletores de atributos de dados CSS:

```diff
  className={cn(
-   "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex",
-   side === "left"
-     ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
-     : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
+   "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex data-[side=left]:left-0 data-[side=right]:right-0 data-[side=left]:group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)] data-[side=right]:group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
```

<Step>Atualize as classes de posicionamento do SidebarRail.</Step>

Atualize o component `SidebarRail` para usar posicionamento físico para o trilho:

```diff
  className={cn(
-   "hover:after:bg-sidebar-border absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear group-data-[side=left]:-end-4 group-data-[side=right]:start-0 after:absolute after:inset-y-0 after:start-1/2 after:w-[2px] sm:flex",
+   "hover:after:bg-sidebar-border absolute inset-y-0 z-20 hidden w-4 ltr:-translate-x-1/2 rtl:-translate-x-1/2 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:start-1/2 after:w-[2px] sm:flex",
```

<Step>Adicione inversão RTL ao ícone do SidebarTrigger.</Step>

Adicione `className="rtl:rotate-180"` ao ícone no `SidebarTrigger` para invertê-lo no modo RTL:

```diff
  <Button ...>
-   <PanelLeftIcon />
+   <PanelLeftIcon className="rtl:rotate-180" />
    <span className="sr-only">Toggle Sidebar</span>
  </Button>
```

</Steps>

Após aplicar essas alterações, você pode usar a prop `dir` para definir a direção:

```tsx
<Sidebar dir="rtl" side="right">
  {/* ... */}
</Sidebar>
```

A sidebar se posicionará corretamente e gerenciará as interações em ambos os layouts LTR e RTL.
