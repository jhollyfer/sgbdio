---
title: Menubar
description: Um menu visualmente persistente comum em aplicacoes desktop que fornece acesso rapido a um conjunto consistente de comandos.
base: radix
component: true
links:
  doc: https://www.radix-ui.com/docs/primitives/components/menubar
  api: https://www.radix-ui.com/docs/primitives/components/menubar#api-reference
---

```tsx
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";

export function MenubarDemo() {
  return (
    <Menubar className="w-72">
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarGroup>
            <MenubarItem>
              New Tab <MenubarShortcut>⌘T</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              New Window <MenubarShortcut>⌘N</MenubarShortcut>
            </MenubarItem>
            <MenubarItem disabled>New Incognito Window</MenubarItem>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarGroup>
            <MenubarSub>
              <MenubarSubTrigger>Share</MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarGroup>
                  <MenubarItem>Email link</MenubarItem>
                  <MenubarItem>Messages</MenubarItem>
                  <MenubarItem>Notes</MenubarItem>
                </MenubarGroup>
              </MenubarSubContent>
            </MenubarSub>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarGroup>
            <MenubarItem>
              Print... <MenubarShortcut>⌘P</MenubarShortcut>
            </MenubarItem>
          </MenubarGroup>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarGroup>
            <MenubarItem>
              Undo <MenubarShortcut>⌘Z</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
            </MenubarItem>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarGroup>
            <MenubarSub>
              <MenubarSubTrigger>Find</MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarGroup>
                  <MenubarItem>Search the web</MenubarItem>
                </MenubarGroup>
                <MenubarSeparator />
                <MenubarGroup>
                  <MenubarItem>Find...</MenubarItem>
                  <MenubarItem>Find Next</MenubarItem>
                  <MenubarItem>Find Previous</MenubarItem>
                </MenubarGroup>
              </MenubarSubContent>
            </MenubarSub>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarGroup>
            <MenubarItem>Cut</MenubarItem>
            <MenubarItem>Copy</MenubarItem>
            <MenubarItem>Paste</MenubarItem>
          </MenubarGroup>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent className="w-44">
          <MenubarGroup>
            <MenubarCheckboxItem>Bookmarks Bar</MenubarCheckboxItem>
            <MenubarCheckboxItem checked>Full URLs</MenubarCheckboxItem>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarGroup>
            <MenubarItem inset>
              Reload <MenubarShortcut>⌘R</MenubarShortcut>
            </MenubarItem>
            <MenubarItem disabled inset>
              Force Reload <MenubarShortcut>⇧⌘R</MenubarShortcut>
            </MenubarItem>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarGroup>
            <MenubarItem inset>Toggle Fullscreen</MenubarItem>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarGroup>
            <MenubarItem inset>Hide Sidebar</MenubarItem>
          </MenubarGroup>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Profiles</MenubarTrigger>
        <MenubarContent>
          <MenubarRadioGroup value="benoit">
            <MenubarRadioItem value="andy">Andy</MenubarRadioItem>
            <MenubarRadioItem value="benoit">Benoit</MenubarRadioItem>
            <MenubarRadioItem value="Luis">Luis</MenubarRadioItem>
          </MenubarRadioGroup>
          <MenubarSeparator />
          <MenubarGroup>
            <MenubarItem inset>Edit...</MenubarItem>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarGroup>
            <MenubarItem inset>Add Profile...</MenubarItem>
          </MenubarGroup>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
```

## Instalacao

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add menubar
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Instale as seguintes dependencias:</Step>

```bash
npm install radix-ui
```

<Step>Copie e cole o codigo a seguir no seu projeto.</Step>

<ComponentSource
  name="menubar"
  title="components/ui/menubar.tsx"
  styleName="radix-nova"
/>

<Step>Atualize os caminhos de importacao para corresponder a configuracao do seu projeto.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Uso

```tsx showLineNumbers
import {
  Menubar,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
```

```tsx showLineNumbers
<Menubar>
  <MenubarMenu>
    <MenubarTrigger>File</MenubarTrigger>
    <MenubarContent>
      <MenubarGroup>
        <MenubarItem>
          New Tab <MenubarShortcut>⌘T</MenubarShortcut>
        </MenubarItem>
        <MenubarItem>New Window</MenubarItem>
      </MenubarGroup>
      <MenubarSeparator />
      <MenubarGroup>
        <MenubarItem>Share</MenubarItem>
        <MenubarItem>Print</MenubarItem>
      </MenubarGroup>
    </MenubarContent>
  </MenubarMenu>
</Menubar>
```

## Exemplos

### Checkbox

Use `MenubarCheckboxItem` para opcoes alternavel.

```tsx
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";

export function MenubarCheckbox() {
  return (
    <Menubar className="w-72">
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent className="w-64">
          <MenubarCheckboxItem>Always Show Bookmarks Bar</MenubarCheckboxItem>
          <MenubarCheckboxItem checked>
            Always Show Full URLs
          </MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarItem inset>
            Reload <MenubarShortcut>⌘R</MenubarShortcut>
          </MenubarItem>
          <MenubarItem disabled inset>
            Force Reload <MenubarShortcut>⇧⌘R</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Format</MenubarTrigger>
        <MenubarContent>
          <MenubarCheckboxItem checked>Strikethrough</MenubarCheckboxItem>
          <MenubarCheckboxItem>Code</MenubarCheckboxItem>
          <MenubarCheckboxItem>Superscript</MenubarCheckboxItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
```

### Radio

Use `MenubarRadioGroup` e `MenubarRadioItem` para opcoes de selecao unica.

```tsx
"use client";

import * as React from "react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";

export function MenubarRadio() {
  const [user, setUser] = React.useState("benoit");
  const [theme, setTheme] = React.useState("system");

  return (
    <Menubar className="w-72">
      <MenubarMenu>
        <MenubarTrigger>Profiles</MenubarTrigger>
        <MenubarContent>
          <MenubarRadioGroup value={user} onValueChange={setUser}>
            <MenubarRadioItem value="andy">Andy</MenubarRadioItem>
            <MenubarRadioItem value="benoit">Benoit</MenubarRadioItem>
            <MenubarRadioItem value="luis">Luis</MenubarRadioItem>
          </MenubarRadioGroup>
          <MenubarSeparator />
          <MenubarItem inset>Edit...</MenubarItem>
          <MenubarItem inset>Add Profile...</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Theme</MenubarTrigger>
        <MenubarContent>
          <MenubarRadioGroup value={theme} onValueChange={setTheme}>
            <MenubarRadioItem value="light">Light</MenubarRadioItem>
            <MenubarRadioItem value="dark">Dark</MenubarRadioItem>
            <MenubarRadioItem value="system">System</MenubarRadioItem>
          </MenubarRadioGroup>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
```

### Submenu

Use `MenubarSub`, `MenubarSubTrigger` e `MenubarSubContent` para menus aninhados.

```tsx
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";

export function MenubarSubmenu() {
  return (
    <Menubar className="w-72">
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarSub>
            <MenubarSubTrigger>Share</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Email link</MenubarItem>
              <MenubarItem>Messages</MenubarItem>
              <MenubarItem>Notes</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>
            Print... <MenubarShortcut>⌘P</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            Undo <MenubarShortcut>⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Find</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Find...</MenubarItem>
              <MenubarItem>Find Next</MenubarItem>
              <MenubarItem>Find Previous</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>Cut</MenubarItem>
          <MenubarItem>Copy</MenubarItem>
          <MenubarItem>Paste</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
```

### Com Icones

```tsx
import {
  Menubar,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  FileIcon,
  FolderIcon,
  HelpCircleIcon,
  SaveIcon,
  SettingsIcon,
  TrashIcon,
} from "lucide-react";

export function MenubarIcons() {
  return (
    <Menubar className="w-72">
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <FileIcon />
            New File <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            <FolderIcon />
            Open Folder
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            <SaveIcon />
            Save <MenubarShortcut>⌘S</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>More</MenubarTrigger>
        <MenubarContent>
          <MenubarGroup>
            <MenubarItem>
              <SettingsIcon />
              Settings
            </MenubarItem>
            <MenubarItem>
              <HelpCircleIcon />
              Help
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem variant="destructive">
              <TrashIcon />
              Delete
            </MenubarItem>
          </MenubarGroup>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
```

## RTL

Para habilitar o suporte a RTL no shadcn/ui, consulte o [guia de configuracao RTL](/docs/rtl).

```tsx
"use client";

import * as React from "react";
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/examples/radix/ui-rtl/menubar";

import {
  useTranslation,
  type Translations,
} from "@/components/language-selector";

const translations: Translations = {
  en: {
    dir: "ltr",
    values: {
      file: "File",
      newTab: "New Tab",
      newWindow: "New Window",
      newIncognitoWindow: "New Incognito Window",
      share: "Share",
      emailLink: "Email link",
      messages: "Messages",
      notes: "Notes",
      print: "Print...",
      edit: "Edit",
      undo: "Undo",
      redo: "Redo",
      find: "Find",
      searchTheWeb: "Search the web",
      findItem: "Find...",
      findNext: "Find Next",
      findPrevious: "Find Previous",
      cut: "Cut",
      copy: "Copy",
      paste: "Paste",
      view: "View",
      bookmarksBar: "Bookmarks Bar",
      fullUrls: "Full URLs",
      reload: "Reload",
      forceReload: "Force Reload",
      toggleFullscreen: "Toggle Fullscreen",
      hideSidebar: "Hide Sidebar",
      profiles: "Profiles",
      andy: "Andy",
      benoit: "Benoit",
      luis: "Luis",
      editProfile: "Edit...",
      addProfile: "Add Profile...",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      file: "ملف",
      newTab: "علامة تبويب جديدة",
      newWindow: "نافذة جديدة",
      newIncognitoWindow: "نافذة التصفح المتخفي الجديدة",
      share: "مشاركة",
      emailLink: "رابط البريد الإلكتروني",
      messages: "الرسائل",
      notes: "الملاحظات",
      print: "طباعة...",
      edit: "تعديل",
      undo: "تراجع",
      redo: "إعادة",
      find: "بحث",
      searchTheWeb: "البحث على الويب",
      findItem: "بحث...",
      findNext: "البحث التالي",
      findPrevious: "البحث السابق",
      cut: "قص",
      copy: "نسخ",
      paste: "لصق",
      view: "عرض",
      bookmarksBar: "شريط الإشارات المرجعية",
      fullUrls: "عناوين URL الكاملة",
      reload: "إعادة تحميل",
      forceReload: "إعادة تحميل قسري",
      toggleFullscreen: "تبديل وضع ملء الشاشة",
      hideSidebar: "إخفاء الشريط الجانبي",
      profiles: "الملفات الشخصية",
      andy: "Andy",
      benoit: "Benoit",
      luis: "Luis",
      editProfile: "تعديل...",
      addProfile: "إضافة ملف شخصي...",
    },
  },
  he: {
    dir: "rtl",
    values: {
      file: "קובץ",
      newTab: "כרטיסייה חדשה",
      newWindow: "חלון חדש",
      newIncognitoWindow: "חלון גלישה בסתר חדש",
      share: "שתף",
      emailLink: "קישור אימייל",
      messages: "הודעות",
      notes: "הערות",
      print: "הדפס...",
      edit: "ערוך",
      undo: "בטל",
      redo: "בצע שוב",
      find: "מצא",
      searchTheWeb: "חפש באינטרנט",
      findItem: "מצא...",
      findNext: "מצא הבא",
      findPrevious: "מצא הקודם",
      cut: "גזור",
      copy: "העתק",
      paste: "הדבק",
      view: "תצוגה",
      bookmarksBar: "סרגל סימניות",
      fullUrls: "כתובות URL מלאות",
      reload: "רענן",
      forceReload: "רענן בכוח",
      toggleFullscreen: "החלף מסך מלא",
      hideSidebar: "הסתר סרגל צד",
      profiles: "פרופילים",
      andy: "Andy",
      benoit: "Benoit",
      luis: "Luis",
      editProfile: "ערוך...",
      addProfile: "הוסף פרופיל...",
    },
  },
};

export function MenubarRtl() {
  const { dir, t, language } = useTranslation(translations, "ar");
  const [profile, setProfile] = React.useState("benoit");

  return (
    <Menubar className="w-72" dir={dir}>
      <MenubarMenu>
        <MenubarTrigger>{t.file}</MenubarTrigger>
        <MenubarContent data-lang={dir === "rtl" ? language : undefined}>
          <MenubarGroup>
            <MenubarItem>
              {t.newTab} <MenubarShortcut>⌘T</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              {t.newWindow} <MenubarShortcut>⌘N</MenubarShortcut>
            </MenubarItem>
            <MenubarItem disabled>{t.newIncognitoWindow}</MenubarItem>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarGroup>
            <MenubarSub>
              <MenubarSubTrigger>{t.share}</MenubarSubTrigger>
              <MenubarSubContent
                data-lang={dir === "rtl" ? language : undefined}
              >
                <MenubarGroup>
                  <MenubarItem>{t.emailLink}</MenubarItem>
                  <MenubarItem>{t.messages}</MenubarItem>
                  <MenubarItem>{t.notes}</MenubarItem>
                </MenubarGroup>
              </MenubarSubContent>
            </MenubarSub>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarGroup>
            <MenubarItem>
              {t.print} <MenubarShortcut>⌘P</MenubarShortcut>
            </MenubarItem>
          </MenubarGroup>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>{t.edit}</MenubarTrigger>
        <MenubarContent data-lang={dir === "rtl" ? language : undefined}>
          <MenubarGroup>
            <MenubarItem>
              {t.undo} <MenubarShortcut>⌘Z</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              {t.redo} <MenubarShortcut>⇧⌘Z</MenubarShortcut>
            </MenubarItem>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarGroup>
            <MenubarSub>
              <MenubarSubTrigger>{t.find}</MenubarSubTrigger>
              <MenubarSubContent
                data-lang={dir === "rtl" ? language : undefined}
              >
                <MenubarGroup>
                  <MenubarItem>{t.searchTheWeb}</MenubarItem>
                </MenubarGroup>
                <MenubarSeparator />
                <MenubarGroup>
                  <MenubarItem>{t.findItem}</MenubarItem>
                  <MenubarItem>{t.findNext}</MenubarItem>
                  <MenubarItem>{t.findPrevious}</MenubarItem>
                </MenubarGroup>
              </MenubarSubContent>
            </MenubarSub>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarGroup>
            <MenubarItem>{t.cut}</MenubarItem>
            <MenubarItem>{t.copy}</MenubarItem>
            <MenubarItem>{t.paste}</MenubarItem>
          </MenubarGroup>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>{t.view}</MenubarTrigger>
        <MenubarContent
          className="w-44"
          data-lang={dir === "rtl" ? language : undefined}
        >
          <MenubarGroup>
            <MenubarCheckboxItem>{t.bookmarksBar}</MenubarCheckboxItem>
            <MenubarCheckboxItem checked>{t.fullUrls}</MenubarCheckboxItem>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarGroup>
            <MenubarItem inset>
              {t.reload} <MenubarShortcut>⌘R</MenubarShortcut>
            </MenubarItem>
            <MenubarItem disabled inset>
              {t.forceReload} <MenubarShortcut>⇧⌘R</MenubarShortcut>
            </MenubarItem>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarGroup>
            <MenubarItem inset>{t.toggleFullscreen}</MenubarItem>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarGroup>
            <MenubarItem inset>{t.hideSidebar}</MenubarItem>
          </MenubarGroup>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>{t.profiles}</MenubarTrigger>
        <MenubarContent data-lang={dir === "rtl" ? language : undefined}>
          <MenubarRadioGroup value={profile} onValueChange={setProfile}>
            <MenubarRadioItem value="andy">{t.andy}</MenubarRadioItem>
            <MenubarRadioItem value="benoit">{t.benoit}</MenubarRadioItem>
            <MenubarRadioItem value="Luis">{t.luis}</MenubarRadioItem>
          </MenubarRadioGroup>
          <MenubarSeparator />
          <MenubarGroup>
            <MenubarItem inset>{t.editProfile}</MenubarItem>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarGroup>
            <MenubarItem inset>{t.addProfile}</MenubarItem>
          </MenubarGroup>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
```

## Referencia da API

Consulte a documentacao do [Radix UI Menubar](https://www.radix-ui.com/docs/primitives/components/menubar#api-reference).
