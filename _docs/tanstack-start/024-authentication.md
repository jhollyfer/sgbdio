---
id: authentication
title: Authentication
---

Este guia cobre padroes de autenticacao e mostra como implementar seu proprio sistema de autenticacao com o TanStack Start.

> **📋 Antes de Comecar:** Confira nossa [Visao Geral de Autenticacao](./authentication-overview.md) para todas as opcoes disponiveis incluindo solucoes parceiras e servicos hospedados.

## Abordagens de Autenticacao

Voce tem varias opcoes de autenticacao na sua aplicacao TanStack Start:

**Solucoes Hospedadas:**

1. **[Clerk](https://clerk.dev)** - Plataforma completa de autenticacao com components de UI
2. **[WorkOS](https://workos.com)** - Focado em empresas com SSO e recursos de conformidade
3. **[Better Auth](https://www.better-auth.com/)** - Biblioteca TypeScript open-source
4. **[Auth.js](https://authjs.dev/)** - Biblioteca open-source suportando mais de 80 provedores OAuth

**Beneficios da Implementacao DIY:**

- **Controle Total**: Customizacao completa sobre o fluxo de autenticacao
- **Sem Vendor Lock-in**: Tenha controle da sua logica de autenticacao e dados de usuarios
- **Requisitos Customizados**: Implemente logica de negocios especifica ou necessidades de conformidade
- **Controle de Custos**: Sem precos por usuario ou limites de uso

A autenticacao envolve muitas consideracoes incluindo seguranca de senhas, gerenciamento de sessao, rate limiting, protecao CSRF e diversos vetores de ataque.

## Conceitos Fundamentais

### Autenticacao vs Autorizacao

- **Autenticacao**: Quem e este usuario? (Login/logout)
- **Autorizacao**: O que este usuario pode fazer? (Permissoes/roles)

O TanStack Start fornece as ferramentas para ambos atraves de server functions, sessoes e protecao de route.

## Blocos de Construcao Essenciais

### 1. Server Functions para Autenticacao

Server functions tratam a logica sensivel de autenticacao de forma segura no servidor:

```tsx
import { createServerFn } from "@tanstack/react-start";
import { redirect } from "@tanstack/react-router";

// Login server function
export const loginFn = createServerFn({ method: "POST" })
  .inputValidator((data: { email: string; password: string }) => data)
  .handler(async ({ data }) => {
    // Verify credentials (replace with your auth logic)
    const user = await authenticateUser(data.email, data.password);

    if (!user) {
      return { error: "Invalid credentials" };
    }

    // Create session
    const session = await useAppSession();
    await session.update({
      userId: user.id,
      email: user.email,
    });

    // Redirect to protected area
    throw redirect({ to: "/dashboard" });
  });

// Logout server function
export const logoutFn = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useAppSession();
  await session.clear();
  throw redirect({ to: "/" });
});

// Get current user
export const getCurrentUserFn = createServerFn({ method: "GET" }).handler(
  async () => {
    const session = await useAppSession();
    const userId = session.data.userId;

    if (!userId) {
      return null;
    }

    return await getUserById(userId);
  },
);
```

### 2. Gerenciamento de Sessao

O TanStack Start fornece sessoes seguras com cookies HTTP-only:

```tsx
// utils/session.ts
import { useSession } from "@tanstack/react-start/server";

type SessionData = {
  userId?: string;
  email?: string;
  role?: string;
};

export function useAppSession() {
  return useSession<SessionData>({
    // Session configuration
    name: "app-session",
    password: process.env.SESSION_SECRET!, // At least 32 characters
    // Optional: customize cookie settings
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      httpOnly: true,
    },
  });
}
```

### 3. Context de Autenticacao

Compartilhe o state de autenticacao pela sua aplicacao:

```tsx
// contexts/auth.tsx
import { createContext, useContext, ReactNode } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getCurrentUserFn } from "../server/auth";

type User = {
  id: string;
  email: string;
  role: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  refetch: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: user, isLoading, refetch } = useServerFn(getCurrentUserFn);

  return (
    <AuthContext.Provider value={{ user, isLoading, refetch }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
```

### 4. Protecao de Route

Proteja routes usando `beforeLoad`:

```tsx
// routes/_authed.tsx - Layout route for protected pages
import { createFileRoute, redirect } from "@tanstack/react-router";
import { getCurrentUserFn } from "../server/auth";

export const Route = createFileRoute("/_authed")({
  beforeLoad: async ({ location }) => {
    const user = await getCurrentUserFn();

    if (!user) {
      throw redirect({
        to: "/login",
        search: { redirect: location.href },
      });
    }

    // Pass user to child routes
    return { user };
  },
});
```

```tsx
// routes/_authed/dashboard.tsx - Protected route
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/dashboard")({
  component: DashboardComponent,
});

function DashboardComponent() {
  const { user } = Route.useRouteContext();

  return (
    <div>
      <h1>Welcome, {user.email}!</h1>
      {/* Dashboard content */}
    </div>
  );
}
```

## Padroes de Implementacao

### Autenticacao Basica por Email/Senha

```tsx
// server/auth.ts
import bcrypt from "bcryptjs";
import { createServerFn } from "@tanstack/react-start";

// User registration
export const registerFn = createServerFn({ method: "POST" })
  .inputValidator(
    (data: { email: string; password: string; name: string }) => data,
  )
  .handler(async ({ data }) => {
    // Check if user exists
    const existingUser = await getUserByEmail(data.email);
    if (existingUser) {
      return { error: "User already exists" };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Create user
    const user = await createUser({
      email: data.email,
      password: hashedPassword,
      name: data.name,
    });

    // Create session
    const session = await useAppSession();
    await session.update({ userId: user.id });

    return { success: true, user: { id: user.id, email: user.email } };
  });

async function authenticateUser(email: string, password: string) {
  const user = await getUserByEmail(email);
  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.password);
  return isValid ? user : null;
}
```

### Controle de Acesso Baseado em Roles (RBAC)

```tsx
// utils/auth.ts
export const roles = {
  USER: "user",
  ADMIN: "admin",
  MODERATOR: "moderator",
} as const;

type Role = (typeof roles)[keyof typeof roles];

export function hasPermission(userRole: Role, requiredRole: Role): boolean {
  const hierarchy = {
    [roles.USER]: 0,
    [roles.MODERATOR]: 1,
    [roles.ADMIN]: 2,
  };

  return hierarchy[userRole] >= hierarchy[requiredRole];
}

// Protected route with role check
export const Route = createFileRoute("/_authed/admin/")({
  beforeLoad: async ({ context }) => {
    if (!hasPermission(context.user.role, roles.ADMIN)) {
      throw redirect({ to: "/unauthorized" });
    }
  },
});
```

### Integracao de Autenticacao Social

```tsx
// Example with OAuth providers
export const authProviders = {
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID!,
    redirectUri: `${process.env.APP_URL}/auth/google/callback`,
  },
  github: {
    clientId: process.env.GITHUB_CLIENT_ID!,
    redirectUri: `${process.env.APP_URL}/auth/github/callback`,
  },
};

export const initiateOAuthFn = createServerFn({ method: "POST" })
  .inputValidator((data: { provider: "google" | "github" }) => data)
  .handler(async ({ data }) => {
    const provider = authProviders[data.provider];
    const state = generateRandomState();

    // Store state in session for CSRF protection
    const session = await useAppSession();
    await session.update({ oauthState: state });

    // Generate OAuth URL
    const authUrl = generateOAuthUrl(provider, state);

    throw redirect({ href: authUrl });
  });
```

### Fluxo de Redefinicao de Senha

```tsx
// Password reset request
export const requestPasswordResetFn = createServerFn({ method: "POST" })
  .inputValidator((data: { email: string }) => data)
  .handler(async ({ data }) => {
    const user = await getUserByEmail(data.email);
    if (!user) {
      // Don't reveal if email exists
      return { success: true };
    }

    const token = generateSecureToken();
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await savePasswordResetToken(user.id, token, expires);
    await sendPasswordResetEmail(user.email, token);

    return { success: true };
  });

// Password reset confirmation
export const resetPasswordFn = createServerFn({ method: "POST" })
  .inputValidator((data: { token: string; newPassword: string }) => data)
  .handler(async ({ data }) => {
    const resetToken = await getPasswordResetToken(data.token);

    if (!resetToken || resetToken.expires < new Date()) {
      return { error: "Invalid or expired token" };
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 12);
    await updateUserPassword(resetToken.userId, hashedPassword);
    await deletePasswordResetToken(data.token);

    return { success: true };
  });
```

## Melhores Praticas de Seguranca

### 1. Seguranca de Senhas

```tsx
// Use strong hashing (bcrypt, scrypt, or argon2)
import bcrypt from "bcryptjs";

const saltRounds = 12; // Adjust based on your security needs
const hashedPassword = await bcrypt.hash(password, saltRounds);
```

### 2. Seguranca de Sessao

```tsx
// Use secure session configuration
export function useAppSession() {
  return useSession({
    name: "app-session",
    password: process.env.SESSION_SECRET!, // 32+ characters
    cookie: {
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: "lax", // CSRF protection
      httpOnly: true, // XSS protection
      maxAge: 7 * 24 * 60 * 60, // 7 days
    },
  });
}
```

### 3. Rate Limiting

```tsx
// Simple in-memory rate limiting (use Redis in production)
const loginAttempts = new Map<string, { count: number; resetTime: number }>();

export const rateLimitLogin = (ip: string): boolean => {
  const now = Date.now();
  const attempts = loginAttempts.get(ip);

  if (!attempts || now > attempts.resetTime) {
    loginAttempts.set(ip, { count: 1, resetTime: now + 15 * 60 * 1000 }); // 15 min
    return true;
  }

  if (attempts.count >= 5) {
    return false; // Too many attempts
  }

  attempts.count++;
  return true;
};
```

### 4. Validacao de Entrada

```tsx
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(100),
});

export const loginFn = createServerFn({ method: "POST" })
  .inputValidator((data) => loginSchema.parse(data))
  .handler(async ({ data }) => {
    // data is now validated
  });
```

## Testando Autenticacao

### Testes Unitarios de Server Functions

```tsx
// __tests__/auth.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import { loginFn } from "../server/auth";

describe("Authentication", () => {
  beforeEach(async () => {
    await setupTestDatabase();
  });

  it("should login with valid credentials", async () => {
    const result = await loginFn({
      data: { email: "test@example.com", password: "password123" },
    });

    expect(result.error).toBeUndefined();
    expect(result.user).toBeDefined();
  });

  it("should reject invalid credentials", async () => {
    const result = await loginFn({
      data: { email: "test@example.com", password: "wrongpassword" },
    });

    expect(result.error).toBe("Invalid credentials");
  });
});
```

### Testes de Integracao

```tsx
// __tests__/auth-flow.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { RouterProvider, createMemoryHistory } from "@tanstack/react-router";
import { router } from "../router";

describe("Authentication Flow", () => {
  it("should redirect to login when accessing protected route", async () => {
    const history = createMemoryHistory();
    history.push("/dashboard"); // Protected route

    render(<RouterProvider router={router} history={history} />);

    await waitFor(() => {
      expect(screen.getByText("Login")).toBeInTheDocument();
    });
  });
});
```

## Padroes Comuns

### Estados de Carregamento

```tsx
function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const loginMutation = useServerFn(loginFn);

  const handleSubmit = async (data: LoginData) => {
    setIsLoading(true);
    try {
      await loginMutation.mutate(data);
    } catch (error) {
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button disabled={isLoading}>
        {isLoading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
```

### Funcionalidade Lembrar-me

```tsx
export const loginFn = createServerFn({ method: "POST" })
  .inputValidator(
    (data: { email: string; password: string; rememberMe?: boolean }) => data,
  )
  .handler(async ({ data }) => {
    const user = await authenticateUser(data.email, data.password);
    if (!user) return { error: "Invalid credentials" };

    const session = await useAppSession();
    await session.update(
      { userId: user.id },
      {
        // Extend session if remember me is checked
        maxAge: data.rememberMe ? 30 * 24 * 60 * 60 : undefined, // 30 days vs session
      },
    );

    return { success: true };
  });
```

## Exemplos Funcionais

Estude estas implementacoes para entender diferentes padroes de autenticacao:

- **[Autenticacao Basica com Prisma](https://github.com/TanStack/router/tree/main/examples/react/start-basic-auth)** - Implementacao DIY completa com banco de dados e sessoes
- **[Integracao com Supabase](https://github.com/TanStack/router/tree/main/examples/react/start-supabase-basic)** - Exemplo de integracao com servico de terceiros
- **[Autenticacao com Context no Cliente](https://github.com/TanStack/router/tree/main/examples/react/authenticated-routes)** - Padroes de autenticacao somente no cliente

## Migracao de Outras Solucoes

### De Autenticacao no Lado do Cliente

Se voce esta migrando de autenticacao no lado do cliente (localStorage, somente context):

1. Mova a logica de autenticacao para server functions
2. Substitua localStorage por sessoes do servidor
3. Atualize a protecao de route para usar `beforeLoad`
4. Adicione headers de seguranca adequados e protecao CSRF

### De Outros Frameworks

- **Next.js**: Substitua API routes por server functions, migre sessoes do NextAuth
- **Remix**: Converta loaders/actions para server functions, adapte padroes de sessao
- **SvelteKit**: Mova form actions para server functions, atualize a protecao de route

## Consideracoes para Producao

Ao escolher sua abordagem de autenticacao, considere estes fatores:

### Comparacao Hospedado vs DIY

**Solucoes Hospedadas (Clerk, WorkOS, Better Auth):**

- Medidas de seguranca pre-construidas e atualizacoes regulares
- Components de UI e recursos de gerenciamento de usuarios
- Certificacoes de conformidade e trilhas de auditoria
- Suporte e documentacao
- Precos por usuario ou por assinatura

**Implementacao DIY:**

- Controle completo sobre implementacao e dados
- Sem custos de assinatura recorrentes
- Logica de negocios e fluxos de trabalho customizados
- Responsabilidade por atualizacoes de seguranca e monitoramento
- Necessidade de lidar com casos extremos e vetores de ataque

### Consideracoes de Seguranca

Sistemas de autenticacao precisam lidar com varios aspectos de seguranca:

- Hashing de senhas e prevencao de ataques de timing
- Gerenciamento de sessao e protecao contra fixacao
- Protecao contra CSRF e XSS
- Rate limiting e prevencao de forca bruta
- Seguranca de fluxo OAuth
- Requisitos de conformidade (GDPR, CCPA, etc.)

## Proximos Passos

Ao implementar autenticacao, considere:

- **Revisao de Seguranca**: Revise sua implementacao para melhores praticas de seguranca
- **Performance**: Adicione caching para buscas de usuario e validacao de sessao
- **Monitoramento**: Adicione logging e monitoramento para eventos de autenticacao
- **Conformidade**: Garanta conformidade com regulamentacoes relevantes se estiver armazenando dados pessoais

Para outras abordagens de autenticacao, confira a [Visao Geral de Autenticacao](./authentication-overview.md). Para ajuda com integracao especifica, explore nossos [exemplos funcionais](https://github.com/TanStack/router/tree/main/examples/react).
