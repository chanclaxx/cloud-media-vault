export const MAX_MB = 10;
export const MAX_BYTES = MAX_MB * 1024 * 1024;

export const MIME_A_CATEGORIA = Object.freeze({
  'image/jpeg': 'imagen',
  'image/png': 'imagen',
  'image/webp': 'imagen',
  'image/gif': 'imagen',
  'video/mp4': 'video',
  'video/webm': 'video',
  'video/quicktime': 'video',
  'application/pdf': 'pdf',
});

export const ACCEPT = Object.keys(MIME_A_CATEGORIA).join(',');

export const FILTROS_TIPO = Object.freeze([
  { valor: '', etiqueta: 'Todos' },
  { valor: 'imagen', etiqueta: 'Imágenes' },
  { valor: 'video', etiqueta: 'Videos' },
  { valor: 'pdf', etiqueta: 'PDF' },
]);

export function categoriaDeMime(mimeType) {
  return MIME_A_CATEGORIA[mimeType] ?? null;
}
