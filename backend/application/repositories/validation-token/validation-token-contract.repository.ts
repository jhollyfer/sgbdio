/* eslint-disable no-unused-vars */
import type {
  E_TOKEN_STATUS,
  FindOptions,
  IValidationToken,
  Merge,
  ValueOf,
} from '@application/core/entity.core';

export type ValidationTokenCreatePayload = Merge<
  Pick<IValidationToken, 'code' | 'status'>,
  { user: string }
>;
export type ValidationTokenUpdatePayload = Merge<
  Pick<IValidationToken, '_id'>,
  Partial<ValidationTokenCreatePayload>
>;

export type ValidationTokenQueryPayload = {
  page?: number;
  perPage?: number;
  user?: string;
  status?: ValueOf<typeof E_TOKEN_STATUS>;
};

export abstract class ValidationTokenContractRepository {
  abstract create(
    payload: ValidationTokenCreatePayload,
  ): Promise<IValidationToken>;
  abstract findById(
    _id: string,
    options?: FindOptions,
  ): Promise<IValidationToken | null>;
  abstract findByCode(
    code: string,
    options?: FindOptions,
  ): Promise<IValidationToken | null>;
  abstract findMany(
    payload?: ValidationTokenQueryPayload,
  ): Promise<IValidationToken[]>;
  abstract update(
    payload: ValidationTokenUpdatePayload,
  ): Promise<IValidationToken>;
  abstract delete(_id: string): Promise<void>;
  abstract count(payload?: ValidationTokenQueryPayload): Promise<number>;
}
