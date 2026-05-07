/**
 * Monta o nome de arquivo CSV padronizado: `<prefix>-YYYY-MM-DD.csv`.
 * O prefixo é normalizado: minúsculas, espaços/underscores viram `-`.
 */
export function buildCsvFilename(
  prefix: string,
  date: Date = new Date(),
): string {
  const safePrefix = prefix
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]+/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(date.getUTCDate()).padStart(2, '0');

  return `${safePrefix || 'export'}-${yyyy}-${mm}-${dd}.csv`;
}
