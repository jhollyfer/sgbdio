export type DispositionMode = 'inline' | 'attachment';

function toAsciiFallback(name: string): string {
  return name
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\x20-\x7e]/g, '_')
    .replace(/"/g, '');
}

export function buildContentDisposition(
  mode: DispositionMode,
  originalName: string,
): string {
  const ascii = toAsciiFallback(originalName);
  const encoded = encodeURIComponent(originalName);
  return `${mode}; filename="${ascii}"; filename*=UTF-8''${encoded}`;
}
