/* eslint-disable no-unused-vars */
import { Service } from 'fastify-decorators';
import type { Readable } from 'node:stream';

import {
  buildCsvStream,
  EXPORT_CSV_LIMIT,
  ExportLimitExceededError,
  iterateInBatches,
  type CsvField,
} from '@application/core/csv/csv-stream';
import type { Either } from '@application/core/either.core';
import { left, right } from '@application/core/either.core';
import type { IUser } from '@application/core/entity.core';
import HTTPException from '@application/core/exception.core';
import { UserContractRepository } from '@application/repositories/user/user-contract.repository';

import type { UserExportCsvPayload } from './export-csv.validator';

type Response = Either<HTTPException, Readable>;

const FIELDS: CsvField[] = [
  { label: 'ID', value: '_id' },
  { label: 'Nome', value: 'name' },
  { label: 'Email', value: 'email' },
  { label: 'Role', value: 'role' },
  { label: 'Status', value: 'status' },
  { label: 'Criado em', value: 'createdAt' },
  { label: 'Atualizado em', value: 'updatedAt' },
];

function toCsvRow(user: IUser): Record<string, string> {
  let createdAt = '';
  if (user.createdAt) createdAt = new Date(user.createdAt).toISOString();
  let updatedAt = '';
  if (user.updatedAt) updatedAt = new Date(user.updatedAt).toISOString();

  return {
    _id: user._id,
    name: user.name ?? '',
    email: user.email ?? '',
    role: user.role ?? '',
    status: user.status ?? '',
    createdAt,
    updatedAt,
  };
}

@Service()
export default class UserExportCsvUseCase {
  constructor(private readonly userRepository: UserContractRepository) {}

  async execute(payload: UserExportCsvPayload): Promise<Response> {
    try {
      const sort: Record<string, 'asc' | 'desc'> = {};
      if (payload['order-name']) sort.name = payload['order-name'];
      if (payload['order-email']) sort.email = payload['order-email'];
      if (payload['order-role']) sort.role = payload['order-role'];
      if (payload['order-status']) sort.status = payload['order-status'];
      if (payload['order-created-at']) {
        sort.createdAt = payload['order-created-at'];
      }

      const total = await this.userRepository.count(payload);

      if (total > EXPORT_CSV_LIMIT) {
        return left(
          HTTPException.UnprocessableEntity(
            `Resultado excede o limite de ${EXPORT_CSV_LIMIT.toLocaleString('pt-BR')} linhas. Refine os filtros antes de exportar.`,
            'EXPORT_LIMIT_EXCEEDED',
          ),
        );
      }

      let userIdLog = 'unknown';
      if (payload.user?._id) userIdLog = payload.user._id;
      console.info(`[users > export-csv] user=${userIdLog} count=${total}`);

      const source = iterateInBatches({
        payload: { ...payload, sort },
        fetchBatch: async (
          p,
          page,
          perPage,
        ): Promise<Record<string, string>[]> => {
          const batch = await this.userRepository.findMany({
            ...p,
            page,
            perPage,
          });
          return batch.map((u): Record<string, string> => toCsvRow(u));
        },
      });

      const stream = buildCsvStream({ source, fields: FIELDS });

      return right(stream);
    } catch (error) {
      if (error instanceof ExportLimitExceededError) {
        return left(
          HTTPException.UnprocessableEntity(error.message, error.cause),
        );
      }
      console.error('[users > export-csv][error]:', error);
      return left(
        HTTPException.InternalServerError(
          'Erro interno do servidor',
          'EXPORT_USER_CSV_ERROR',
        ),
      );
    }
  }
}
