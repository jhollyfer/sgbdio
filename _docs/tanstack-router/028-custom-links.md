---
title: Custom Link
---

Embora se repetir possa ser aceitável em muitas situações, você pode perceber que faz isso com muita frequência. Às vezes, você pode querer criar components transversais com comportamento ou estilos adicionais. Você também pode considerar usar bibliotecas de terceiros em combinação com a segurança de tipos do TanStack Router.

## `createLink` para preocupações transversais

`createLink` cria um component `Link` personalizado com os mesmos parâmetros de tipo que `Link`. Isso significa que você pode criar seu próprio component que fornece a mesma segurança de tipos e desempenho de TypeScript que o `Link`.

### Exemplo básico

Se você quer criar um component de link personalizado básico, pode fazer isso da seguinte forma:

[//]: # "BasicExampleImplementation"

```tsx
import * as React from "react";
import { createLink, LinkComponent } from "@tanstack/react-router";

interface BasicLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  // Add any additional props you want to pass to the anchor element
}

const BasicLinkComponent = React.forwardRef<HTMLAnchorElement, BasicLinkProps>(
  (props, ref) => {
    return (
      <a ref={ref} {...props} className={"block px-3 py-2 text-blue-700"} />
    );
  },
);

const CreatedLinkComponent = createLink(BasicLinkComponent);

export const CustomLink: LinkComponent<typeof BasicLinkComponent> = (props) => {
  return <CreatedLinkComponent preload={"intent"} {...props} />;
};
```

[//]: # "BasicExampleImplementation"

Você pode então usar seu component `Link` recém-criado como qualquer outro `Link`

```tsx
<CustomLink to={"/dashboard/invoices/$invoiceId"} params={{ invoiceId: 0 }} />
```

[//]: # "ExamplesUsingThirdPartyLibs"

## `createLink` com bibliotecas de terceiros

Aqui estão alguns exemplos de como você pode usar `createLink` com bibliotecas de terceiros.

### Exemplo com React Aria Components

React Aria Components v1.11.0 e posteriores funcionam com a prop `preload (intent)` do TanStack Router. Use `createLink` para envolver cada component React Aria que você usa como link.

```tsx
import { createLink } from "@tanstack/react-router";
import { Link as RACLink, MenuItem } from "react-aria-components";

export const Link = createLink(RACLink);
export const MenuItemLink = createLink(MenuItem);
```

Para usar as render props do React Aria, incluindo as funções `className`, `style` e `children`, crie um component wrapper e passe-o para `createLink`.

```tsx
import { createLink } from "@tanstack/react-router";
import { Link as RACLink, type LinkProps } from "react-aria-components";

interface MyLinkProps extends LinkProps {
  // your props
}

function MyLink(props: MyLinkProps) {
  return (
    <RACLink
      {...props}
      style={({ isHovered }) => ({
        color: isHovered ? "red" : "blue",
      })}
    />
  );
}

export const Link = createLink(MyLink);
```

### Exemplo com Chakra UI

```tsx
import * as React from "react";
import { createLink, LinkComponent } from "@tanstack/react-router";
import { Link } from "@chakra-ui/react";

interface ChakraLinkProps extends Omit<
  React.ComponentPropsWithoutRef<typeof Link>,
  "href"
> {
  // Add any additional props you want to pass to the link
}

const ChakraLinkComponent = React.forwardRef<
  HTMLAnchorElement,
  ChakraLinkProps
>((props, ref) => {
  return <Link ref={ref} {...props} />;
});

const CreatedLinkComponent = createLink(ChakraLinkComponent);

export const CustomLink: LinkComponent<typeof ChakraLinkComponent> = (
  props,
) => {
  return (
    <CreatedLinkComponent
      textDecoration={"underline"}
      _hover={{ textDecoration: "none" }}
      _focus={{ textDecoration: "none" }}
      preload={"intent"}
      {...props}
    />
  );
};
```

### Exemplo com MUI

Há um [exemplo](https://github.com/TanStack/router/tree/main/examples/react/start-material-ui) disponível que usa esses padrões.

#### `Link`

Se o `Link` do MUI deve simplesmente se comportar como o `Link` do router, ele pode ser envolvido diretamente com `createLink`:

```tsx
import { createLink } from "@tanstack/react-router";
import { Link } from "@mui/material";

export const CustomLink = createLink(Link);
```

Se o `Link` deve ser personalizado, essa abordagem pode ser usada:

```tsx
import React from "react";
import { createLink } from "@tanstack/react-router";
import { Link } from "@mui/material";
import type { LinkProps } from "@mui/material";
import type { LinkComponent } from "@tanstack/react-router";

interface MUILinkProps extends LinkProps {
  // Add any additional props you want to pass to the Link
}

const MUILinkComponent = React.forwardRef<HTMLAnchorElement, MUILinkProps>(
  (props, ref) => <Link ref={ref} {...props} />,
);

const CreatedLinkComponent = createLink(MUILinkComponent);

export const CustomLink: LinkComponent<typeof MUILinkComponent> = (props) => {
  return <CreatedLinkComponent preload={"intent"} {...props} />;
};

// Can also be styled
```

#### `Button`

Se um `Button` deve ser usado como um `Link` do router, o `component` deve ser definido como `a`:

```tsx
import React from "react";
import { createLink } from "@tanstack/react-router";
import { Button } from "@mui/material";
import type { ButtonProps } from "@mui/material";
import type { LinkComponent } from "@tanstack/react-router";

interface MUIButtonLinkProps extends ButtonProps<"a"> {
  // Add any additional props you want to pass to the Button
}

const MUIButtonLinkComponent = React.forwardRef<
  HTMLAnchorElement,
  MUIButtonLinkProps
>((props, ref) => <Button ref={ref} component="a" {...props} />);

const CreatedButtonLinkComponent = createLink(MUIButtonLinkComponent);

export const CustomButtonLink: LinkComponent<typeof MUIButtonLinkComponent> = (
  props,
) => {
  return <CreatedButtonLinkComponent preload={"intent"} {...props} />;
};
```

#### Uso com `styled`

Qualquer uma dessas abordagens do MUI pode então ser usada com `styled`:

```tsx
import { css, styled } from "@mui/material";
import { CustomLink } from "./CustomLink";

const StyledCustomLink = styled(CustomLink)(
  ({ theme }) => css`
    color: ${theme.palette.common.white};
  `,
);
```

### Exemplo com Mantine

```tsx
import * as React from "react";
import { createLink, LinkComponent } from "@tanstack/react-router";
import { Anchor, AnchorProps } from "@mantine/core";

interface MantineAnchorProps extends Omit<AnchorProps, "href"> {
  // Add any additional props you want to pass to the anchor
}

const MantineLinkComponent = React.forwardRef<
  HTMLAnchorElement,
  MantineAnchorProps
>((props, ref) => {
  return <Anchor ref={ref} {...props} />;
});

const CreatedLinkComponent = createLink(MantineLinkComponent);

export const CustomLink: LinkComponent<typeof MantineLinkComponent> = (
  props,
) => {
  return <CreatedLinkComponent preload="intent" {...props} />;
};
```

[//]: # "ExamplesUsingThirdPartyLibs"
