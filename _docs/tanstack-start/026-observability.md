---
id: observability
title: Observability
---

Observabilidade é um aspecto crítico do desenvolvimento web moderno, permitindo que você monitore, rastreie e depure o desempenho e os erros da sua aplicação. O TanStack Start oferece padrões integrados de observabilidade e se integra perfeitamente com ferramentas externas para fornecer insights abrangentes sobre sua aplicação.

## Solução Parceira: Sentry

<a href="https://sentry.io?utm_source=tanstack" alt='Sentry Logo'>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/tanstack/tanstack.com/main/src/images/sentry-wordmark-light.svg" width="280">
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/tanstack/tanstack.com/main/src/images/sentry-wordmark-dark.svg" width="280">
    <img alt="Sentry logo" src="https://raw.githubusercontent.com/tanstack/tanstack.com/main/src/images/sentry-wordmark-light.svg" width="280">
  </picture>
</a>

Para observabilidade abrangente, recomendamos o [Sentry](https://sentry.io?utm_source=tanstack) - nosso parceiro de confiança para rastreamento de erros e monitoramento de desempenho. O Sentry oferece:

- **Rastreamento de Erros em Tempo Real** - Capture e depure erros em toda a sua stack
- **Monitoramento de Desempenho** - Rastreie transações lentas e otimize gargalos
- **Saúde de Releases** - Monitore deploys e acompanhe taxas de erro ao longo do tempo
- **Análise de Impacto no Usuário** - Entenda como os erros afetam seus usuários
- **Integração com TanStack Start** - Funciona perfeitamente com server functions e código do cliente

**Configuração Rápida:**

```tsx
// Client-side (app.tsx)
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.NODE_ENV,
});

// Server functions
import * as Sentry from "@sentry/node";

const serverFn = createServerFn().handler(async () => {
  try {
    return await riskyOperation();
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
});
```

[Comece com o Sentry →](https://sentry.io/signup?utm_source=tanstack) | [Veja o exemplo de integração →](https://github.com/TanStack/router/tree/main/e2e/react-router/sentry-integration)

## Padrões de Observabilidade Integrados

A arquitetura do TanStack Start oferece diversas oportunidades de observabilidade integrada sem dependências externas:

### Logging de Server Functions

Adicione logging às suas server functions para rastrear execução, desempenho e erros:

```tsx
import { createServerFn } from "@tanstack/react-start";

const getUser = createServerFn({ method: "GET" })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    const startTime = Date.now();

    try {
      console.log(`[SERVER] Fetching user ${id}`);

      const user = await db.users.findUnique({ where: { id } });

      if (!user) {
        console.log(`[SERVER] User ${id} not found`);
        throw new Error("User not found");
      }

      const duration = Date.now() - startTime;
      console.log(`[SERVER] User ${id} fetched in ${duration}ms`);

      return user;
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(
        `[SERVER] Error fetching user ${id} after ${duration}ms:`,
        error,
      );
      throw error;
    }
  });
```

### Middleware de Request/Response

Crie middleware para registrar todas as requisições e respostas:

```tsx
import { createMiddleware } from "@tanstack/react-start";

const requestLogger = createMiddleware().server(async ({ request, next }) => {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();

  console.log(`[${timestamp}] ${request.method} ${request.url} - Starting`);

  try {
    const result = await next();
    const duration = Date.now() - startTime;

    console.log(
      `[${timestamp}] ${request.method} ${request.url} - ${result.response.status} (${duration}ms)`,
    );

    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(
      `[${timestamp}] ${request.method} ${request.url} - Error (${duration}ms):`,
      error,
    );
    throw error;
  }
});

// Apply to all server routes
export const Route = createFileRoute("/api/users")({
  server: {
    middleware: [requestLogger],
    handlers: {
      GET: async () => {
        return Response.json({ users: await getUsers() });
      },
    },
  },
});
```

### Monitoramento de Desempenho de Routes

Acompanhe o desempenho de carregamento de routes tanto no cliente quanto no servidor:

```tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
  loader: async ({ context }) => {
    const startTime = Date.now();

    try {
      const data = await loadDashboardData();
      const duration = Date.now() - startTime;

      // Log server-side performance
      if (typeof window === "undefined") {
        console.log(`[SSR] Dashboard loaded in ${duration}ms`);
      }

      return data;
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`[LOADER] Dashboard error after ${duration}ms:`, error);
      throw error;
    }
  },
  component: Dashboard,
});

function Dashboard() {
  const data = Route.useLoaderData();

  // Track client-side render time
  React.useEffect(() => {
    const renderTime = performance.now();
    console.log(`[CLIENT] Dashboard rendered in ${renderTime}ms`);
  }, []);

  return <div>Dashboard content</div>;
}
```

### Endpoints de Health Check

Crie server routes para monitoramento de saúde:

```tsx
// routes/health.ts
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/health")({
  server: {
    handlers: {
      GET: async () => {
        const checks = {
          status: "healthy",
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          database: await checkDatabase(),
          version: process.env.npm_package_version,
        };

        return Response.json(checks);
      },
    },
  },
});

async function checkDatabase() {
  try {
    await db.raw("SELECT 1");
    return { status: "connected", latency: 0 };
  } catch (error) {
    return { status: "error", error: error.message };
  }
}
```

### Error Boundaries

Implemente tratamento de erros abrangente:

```tsx
// Client-side error boundary
import { ErrorBoundary } from "react-error-boundary";

function ErrorFallback({ error, resetErrorBoundary }: any) {
  // Log client errors
  console.error("[CLIENT ERROR]:", error);

  // Could also send to external service
  // sendErrorToService(error)

  return (
    <div role="alert">
      <h2>Something went wrong</h2>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

export function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Router />
    </ErrorBoundary>
  );
}

// Server function error handling
const riskyOperation = createServerFn().handler(async () => {
  try {
    return await performOperation();
  } catch (error) {
    // Log server errors with context
    console.error("[SERVER ERROR]:", {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      // Add request context if available
    });

    // Return user-friendly error
    throw new Error("Operation failed. Please try again.");
  }
});
```

### Coleta de Métricas de Desempenho

Colete e exponha métricas básicas de desempenho:

```tsx
// utils/metrics.ts
class MetricsCollector {
  private metrics = new Map<string, number[]>();

  recordTiming(name: string, duration: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(duration);
  }

  getStats(name: string) {
    const timings = this.metrics.get(name) || [];
    if (timings.length === 0) return null;

    const sorted = timings.sort((a, b) => a - b);
    return {
      count: timings.length,
      avg: timings.reduce((a, b) => a + b, 0) / timings.length,
      p50: sorted[Math.floor(sorted.length * 0.5)],
      p95: sorted[Math.floor(sorted.length * 0.95)],
      min: sorted[0],
      max: sorted[sorted.length - 1],
    };
  }

  getAllStats() {
    const stats: Record<string, any> = {};
    for (const [name] of this.metrics) {
      stats[name] = this.getStats(name);
    }
    return stats;
  }
}

export const metrics = new MetricsCollector();

// Metrics endpoint
// routes/metrics.ts
export const Route = createFileRoute("/metrics")({
  server: {
    handlers: {
      GET: async () => {
        return Response.json({
          system: {
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            timestamp: new Date().toISOString(),
          },
          application: metrics.getAllStats(),
        });
      },
    },
  },
});
```

### Headers de Debug para Desenvolvimento

Adicione informações úteis de debug às respostas:

```tsx
import { createMiddleware } from "@tanstack/react-start";

const debugMiddleware = createMiddleware().server(async ({ next }) => {
  const result = await next();

  if (process.env.NODE_ENV === "development") {
    result.response.headers.set("X-Debug-Timestamp", new Date().toISOString());
    result.response.headers.set("X-Debug-Node-Version", process.version);
    result.response.headers.set("X-Debug-Uptime", process.uptime().toString());
  }

  return result;
});
```

### Logging Específico por Ambiente

Configure estratégias de logging diferentes para desenvolvimento vs produção:

```tsx
// utils/logger.ts
import { createIsomorphicFn } from "@tanstack/react-start";

type LogLevel = "debug" | "info" | "warn" | "error";

const logger = createIsomorphicFn()
  .server((level: LogLevel, message: string, data?: any) => {
    const timestamp = new Date().toISOString();

    if (process.env.NODE_ENV === "development") {
      // Development: Detailed console logging
      console[level](`[${timestamp}] [${level.toUpperCase()}]`, message, data);
    } else {
      // Production: Structured JSON logging
      console.log(
        JSON.stringify({
          timestamp,
          level,
          message,
          data,
          service: "tanstack-start",
          environment: process.env.NODE_ENV,
        }),
      );
    }
  })
  .client((level: LogLevel, message: string, data?: any) => {
    if (process.env.NODE_ENV === "development") {
      console[level](`[CLIENT] [${level.toUpperCase()}]`, message, data);
    } else {
      // Production: Send to analytics service
      // analytics.track('client_log', { level, message, data })
    }
  });

// Usage anywhere in your app
export { logger };

// Example usage
const fetchUserData = createServerFn().handler(async ({ data: userId }) => {
  logger("info", "Fetching user data", { userId });

  try {
    const user = await db.users.findUnique({ where: { id: userId } });
    logger("info", "User data fetched successfully", { userId });
    return user;
  } catch (error) {
    logger("error", "Failed to fetch user data", {
      userId,
      error: error.message,
    });
    throw error;
  }
});
```

### Relatório de Erros Simples

Relatório básico de erros sem dependências externas:

```tsx
// utils/error-reporter.ts
const errorStore = new Map<
  string,
  { count: number; lastSeen: Date; error: any }
>();

export function reportError(error: Error, context?: any) {
  const key = `${error.name}:${error.message}`;
  const existing = errorStore.get(key);

  if (existing) {
    existing.count++;
    existing.lastSeen = new Date();
  } else {
    errorStore.set(key, {
      count: 1,
      lastSeen: new Date(),
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
        context,
      },
    });
  }

  // Log immediately
  console.error("[ERROR REPORTED]:", {
    error: error.message,
    count: existing ? existing.count : 1,
    context,
  });
}

// Error reporting endpoint
// routes/errors.ts
export const Route = createFileRoute("/admin/errors")({
  server: {
    handlers: {
      GET: async () => {
        const errors = Array.from(errorStore.entries()).map(([key, data]) => ({
          id: key,
          ...data,
        }));

        return Response.json({ errors });
      },
    },
  },
});
```

## Ferramentas Externas de Observabilidade

Embora o TanStack Start ofereça padrões de observabilidade integrados, ferramentas externas proporcionam um monitoramento mais abrangente:

### Outras Ferramentas Populares

**Monitoramento de Desempenho de Aplicação:**

- **[DataDog](https://www.datadoghq.com/)** - Monitoramento full-stack com APM
- **[New Relic](https://newrelic.com/)** - Monitoramento de desempenho e alertas
- **[Honeycomb](https://honeycomb.io/)** - Observabilidade para sistemas complexos

**Rastreamento de Erros:**

- **[Bugsnag](https://bugsnag.com/)** - Monitoramento de erros com rastreamento de deploy
- **[Rollbar](https://rollbar.com/)** - Alertas de erros em tempo real

**Analytics e Comportamento do Usuário:**

- **[PostHog](https://posthog.com/)** - Analytics de produto com rastreamento de erros
- **[Mixpanel](https://mixpanel.com/)** - Rastreamento de eventos e analytics de usuários

### Integração com New Relic

O [New Relic](https://newrelic.com/) é uma ferramenta popular de monitoramento de desempenho de aplicações. Veja como integrá-lo com o TanStack Start.

#### SSR

Para habilitar o New Relic para server-side rendering, você precisará fazer o seguinte:

Crie uma nova integração no New Relic do tipo `Node`. Você receberá uma chave de licença que usaremos abaixo.

```js
// newrelic.js - New Relic agent configuration
exports.config = {
  app_name: ["YourTanStackApp"], // Your application name in New Relic
  license_key: "YOUR_NEW_RELIC_LICENSE_KEY", // Your New Relic license key
  agent_enabled: true,
  distributed_tracing: { enabled: true },
  span_events: { enabled: true },
  transaction_events: { enabled: true },
  // Additional default settings
};
```

```tsx
// server.tsx
import newrelic from "newrelic"; // Make sure this is the first import
import {
  createStartHandler,
  defaultStreamHandler,
  defineHandlerCallback,
} from "@tanstack/react-start/server";
import type { ServerEntry } from "@tanstack/react-start/server-entry";

const customHandler = defineHandlerCallback(async (ctx) => {
  // We do this so that transactions are grouped under the route ID instead of unique URLs
  const matches = ctx.router?.state?.matches ?? [];
  const leaf = matches[matches.length - 1];
  const routeId = leaf?.routeId ?? new URL(ctx.request.url).pathname;

  newrelic.setControllerName(routeId, ctx.request.method ?? "GET");
  newrelic.addCustomAttributes({
    "route.id": routeId,
    "http.method": ctx.request.method,
    "http.path": new URL(ctx.request.url).pathname,
    // Any other custom attributes you want to add
  });

  return defaultStreamHandler(ctx);
});

export default {
  fetch(request) {
    const handler = createStartHandler(customHandler);
    return handler(request);
  },
} satisfies ServerEntry;
```

```bash
node -r newrelic .output/server/index.mjs
```

#### Server Functions e Server Routes

Se você quiser adicionar monitoramento para server functions e server routes, precisará seguir os passos acima e então adicionar o seguinte:

```ts
// newrelic-middleware.ts
import newrelic from "newrelic";
import { createMiddleware } from "@tanstack/react-start";

export const nrTransactionMiddleware = createMiddleware().server(
  async ({ request, next }) => {
    const reqPath = new URL(request.url).pathname;
    newrelic.setControllerName(reqPath, request.method ?? "GET");
    return await next();
  },
);
```

```ts
// start.ts
import { createStart } from "@tanstack/react-start";
import { nrTransactionMiddleware } from "./newrelic-middleware";

export const startInstance = createStart(() => {
  return {
    requestMiddleware: [nrTransactionMiddleware],
  };
});
```

#### SPA e Browser

Crie uma nova integração no New Relic do tipo `React`.

Depois de configurá-la, você precisará adicionar o script de integração que o New Relic fornece à sua route raiz.

```tsx
// __root.tsx
export const Route = createRootRoute({
  head: () => ({
    scripts: [
      {
        id: "new-relic",

        // either copy/paste your New Relic integration script here
        children: `...`,

        // or you can create it in your public folder and then reference it here
        src: "/newrelic.js",
      },
    ],
  }),
});
```

### Integração com OpenTelemetry (Experimental)

O [OpenTelemetry](https://opentelemetry.io/) é o padrão da indústria para observabilidade. Aqui está uma abordagem experimental para integrá-lo com o TanStack Start:

```tsx
// instrumentation.ts - Initialize before your app
import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { Resource } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";

const sdk = new NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: "tanstack-start-app",
    [SemanticResourceAttributes.SERVICE_VERSION]: "1.0.0",
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

// Initialize BEFORE importing your app
sdk.start();
```

```tsx
// Server function tracing
import { trace, SpanStatusCode } from "@opentelemetry/api";

const tracer = trace.getTracer("tanstack-start");

const getUserWithTracing = createServerFn({ method: "GET" })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    return tracer.startActiveSpan("get-user", async (span) => {
      span.setAttributes({
        "user.id": id,
        operation: "database.query",
      });

      try {
        const user = await db.users.findUnique({ where: { id } });
        span.setStatus({ code: SpanStatusCode.OK });
        return user;
      } catch (error) {
        span.recordException(error);
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: error.message,
        });
        throw error;
      } finally {
        span.end();
      }
    });
  });
```

```tsx
// Middleware for automatic tracing
import { createMiddleware } from "@tanstack/react-start";
import { trace, SpanStatusCode } from "@opentelemetry/api";

const tracer = trace.getTracer("tanstack-start");

const tracingMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    const url = new URL(request.url);

    return tracer.startActiveSpan(
      `${request.method} ${url.pathname}`,
      async (span) => {
        span.setAttributes({
          "http.method": request.method,
          "http.url": request.url,
          "http.route": url.pathname,
        });

        try {
          const result = await next();
          span.setAttribute("http.status_code", result.response.status);
          span.setStatus({ code: SpanStatusCode.OK });
          return result;
        } catch (error) {
          span.recordException(error);
          span.setStatus({
            code: SpanStatusCode.ERROR,
            message: error.message,
          });
          throw error;
        } finally {
          span.end();
        }
      },
    );
  },
);
```

> **Nota**: A integração com OpenTelemetry acima é experimental e requer configuração manual. Estamos explorando suporte de primeira classe ao OpenTelemetry que forneceria instrumentação automática para server functions, middleware e route loaders.

### Padrão de Integração Rápida

A maioria das ferramentas de observabilidade segue um padrão de integração semelhante com o TanStack Start:

```tsx
// Initialize in app entry point
import { initObservabilityTool } from "your-tool";

initObservabilityTool({
  dsn: import.meta.env.VITE_TOOL_DSN,
  environment: import.meta.env.NODE_ENV,
});

// Server function middleware
const observabilityMiddleware = createMiddleware().handler(async ({ next }) => {
  return yourTool.withTracing("server-function", async () => {
    try {
      return await next();
    } catch (error) {
      yourTool.captureException(error);
      throw error;
    }
  });
});
```

## Boas Práticas

### Desenvolvimento vs Produção

```tsx
// Different strategies per environment
const observabilityConfig = {
  development: {
    logLevel: "debug",
    enableTracing: true,
    enableMetrics: false, // Too noisy in dev
  },
  production: {
    logLevel: "warn",
    enableTracing: true,
    enableMetrics: true,
    enableAlerting: true,
  },
};
```

### Checklist de Monitoramento de Desempenho

- [ ] **Desempenho de Server Functions**: Rastreie tempos de execução
- [ ] **Tempos de Carregamento de Routes**: Monitore o desempenho dos loaders
- [ ] **Desempenho de Queries no Banco de Dados**: Registre queries lentas
- [ ] **Latência de APIs Externas**: Monitore chamadas a serviços de terceiros
- [ ] **Uso de Memória**: Acompanhe padrões de consumo de memória
- [ ] **Taxas de Erro**: Monitore frequência e tipos de erros

### Considerações de Segurança

- Nunca registre dados sensíveis (senhas, tokens, dados pessoais)
- Use logging estruturado para melhor análise
- Implemente rotação de logs em produção
- Considere requisitos de conformidade (LGPD, GDPR, CCPA)

## Suporte Futuro ao OpenTelemetry

O suporte direto ao OpenTelemetry está chegando ao TanStack Start, o que fornecerá instrumentação automática para server functions, middleware e route loaders sem a configuração manual mostrada acima.

## Recursos

- **[Documentação do Sentry](https://docs.sentry.io/)**
- **[Documentação do OpenTelemetry](https://opentelemetry.io/docs/)** - Padrão da indústria para observabilidade
- **[Exemplo Funcional](https://github.com/TanStack/router/tree/main/examples/react/start-basic)** - Veja padrões de observabilidade em ação
