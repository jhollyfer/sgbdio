export const Role = {
  MASTER: 'MASTER',
  ADMINISTRATOR: 'ADMINISTRATOR',
} as const;

export type Role = (typeof Role)[keyof typeof Role];

const ROLES: Role[] = Object.values(Role);

export function isRole(value: unknown): value is Role {
  if (typeof value !== 'string') return false;
  return ROLES.some((role): boolean => role === value);
}
