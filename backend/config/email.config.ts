import { Env } from '@start/env';

export type NodemailerTransportConfig = {
  host: string;
  port: number;
  secure: boolean;
  requireTLS: boolean;
  auth: { user: string; pass: string };
};

/**
 * Monta a configuracao do transporter Nodemailer a partir das env vars.
 * Retorna null se qualquer credencial essencial (HOST/PORT/USER/PASSWORD)
 * estiver ausente.
 */
export function buildNodemailerConfig(): NodemailerTransportConfig | null {
  const host = Env.EMAIL_PROVIDER_HOST;
  const port = Env.EMAIL_PROVIDER_PORT;
  const user = Env.EMAIL_PROVIDER_USER;
  const pass = Env.EMAIL_PROVIDER_PASSWORD;

  if (!host) return null;
  if (!port) return null;
  if (!user) return null;
  if (!pass) return null;

  return {
    host,
    port,
    secure: port === 465,
    requireTLS: true,
    auth: { user, pass },
  };
}

/**
 * Resolve o remetente (MAIL FROM). Preferencia: EMAIL_PROVIDER_FROM,
 * fallback para EMAIL_PROVIDER_USER.
 */
export function resolveEmailFrom(): string | null {
  if (Env.EMAIL_PROVIDER_FROM) return Env.EMAIL_PROVIDER_FROM;
  if (Env.EMAIL_PROVIDER_USER) return Env.EMAIL_PROVIDER_USER;
  return null;
}
