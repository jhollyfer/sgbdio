import { AsyncParser } from '@json2csv/node';
import { Readable } from 'node:stream';

export const EXPORT_CSV_LIMIT = 500_000;

export class ExportLimitExceededError extends Error {
  override readonly cause = 'EXPORT_LIMIT_EXCEEDED';
  constructor(public readonly limit: number = EXPORT_CSV_LIMIT) {
    super(
      `Resultado excede o limite máximo de ${limit.toLocaleString('pt-BR')} linhas para exportação.`,
    );
  }
}

export type CsvField = { label: string; value: string };

/**
 * Itera registros via `findMany` em batches sequenciais, evitando carregar
 * a coleção inteira em memória. Garante o teto de `limit` linhas como
 * defesa em profundidade — o use-case deve checar `count()` antes para
 * falhar cedo com 422.
 */
export type CsvBatchFetcher<TPayload, TEntity> = (
  payload: TPayload,

  page: number,

  perPage: number,
) => Promise<TEntity[]>;

export async function* iterateInBatches<TPayload, TEntity>(opts: {
  payload: TPayload;
  fetchBatch: CsvBatchFetcher<TPayload, TEntity>;
  batchSize?: number;
  limit?: number;
}): AsyncGenerator<TEntity> {
  const batchSize = opts.batchSize ?? 1000;
  const limit = opts.limit ?? EXPORT_CSV_LIMIT;
  let page = 1;
  let emitted = 0;

  while (true) {
    const batch = await opts.fetchBatch(opts.payload, page, batchSize);
    if (batch.length === 0) break;

    for (const item of batch) {
      if (emitted >= limit) throw new ExportLimitExceededError(limit);
      emitted++;
      yield item;
    }

    if (batch.length < batchSize) break;
    page += 1;
  }
}

/**
 * Cria o stream CSV (Readable) a partir de uma fonte assíncrona de objetos
 * já mapeados para o shape de saída. Inclui BOM UTF-8 e cabeçalho.
 */
export function buildCsvStream<TRow extends Record<string, unknown>>(opts: {
  source: AsyncIterable<TRow>;
  fields: CsvField[];
  delimiter?: string;
}): Readable {
  const parser = new AsyncParser({
    fields: opts.fields,
    withBOM: true,
    header: true,
    delimiter: opts.delimiter ?? ',',
    defaultValue: '',
  });

  // `AsyncParser.parse` despacha AsyncIterable como objeto único (bug interno
  // da lib), então convertemos para Readable em objectMode antes.
  const input = Readable.from(opts.source, { objectMode: true });
  return parser.parse(input) as unknown as Readable;
}
