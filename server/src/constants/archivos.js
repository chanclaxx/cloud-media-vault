export const MAX_MB = 10;
export const MAX_BYTES = MAX_MB * 1024 * 1024;

export const CATEGORIAS = Object.freeze(['imagen', 'video', 'pdf']);

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

export function categoriaDeMime(mimeType) {
  return MIME_A_CATEGORIA[mimeType] ?? null;
}
