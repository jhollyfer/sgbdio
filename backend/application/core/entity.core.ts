import type { Role } from '@application/core/role.core';

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
export type Merge<T, U> = {
  [K in keyof (T & U)]: (T & U)[K];
};
export type ValueOf<T> = T[keyof T];

export type FindOptions = { trashed?: boolean };

export const E_TOKEN_STATUS = {
  REQUESTED: 'REQUESTED',
  EXPIRED: 'EXPIRED',
  VALIDATED: 'VALIDATED',
} as const;

export const E_JWT_TYPE = {
  ACCESS: 'ACCESS',
  REFRESH: 'REFRESH',
} as const;

export const E_USER_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const;

export const E_STORAGE_LOCATION = {
  LOCAL: 'local',
  S3: 's3',
} as const;

export type TStorageLocation = ValueOf<typeof E_STORAGE_LOCATION>;

export type IJWTPayload = {
  sub: string;
  email: string;
  role: Role;
  type: ValueOf<typeof E_JWT_TYPE>;
};

export type Base = {
  _id: string;
  createdAt: Date;
  updatedAt: Date | null;
  trashedAt: Date | null;
  trashed: boolean;
};

export type IUser = Merge<
  Base,
  {
    name: string;
    email: string;
    password: string;
    role: Role;
    status: ValueOf<typeof E_USER_STATUS>;
  }
>;

export type IStorage = Merge<
  Base,
  {
    url: string;
    filename: string;
    mimetype: string;
    originalName: string;
    size: number;
    location: TStorageLocation;
  }
>;

export type IValidationToken = Merge<
  Base,
  {
    user: IUser;
    code: string;
    status: ValueOf<typeof E_TOKEN_STATUS>;
  }
>;

export type IAttachment = {
  filename: string;
  content: Buffer | string;
};

export type IEmailOptions = {
  from?: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
  attachments?: Array<IAttachment>;
};

export type ISentMessageInfo = {
  accepted: string[];
  rejected: string[];
  envelope: {
    from: string;
    to: string[];
  };
};

export type ISearch = Merge<
  Record<string, unknown>,
  {
    page: number;
    perPage: number;
    search?: string;
    trashed?: 'true' | 'false';
    sub?: string;
  }
>;

export type IMeta = {
  total: number;
  page: number;
  perPage: number;
  lastPage: number;
  firstPage: number;
};

export type Paginated<Entity> = {
  data: Entity[];
  meta: IMeta;
};
