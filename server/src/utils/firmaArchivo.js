const ascii = (buffer, inicio, fin) => buffer.subarray(inicio, fin).toString('latin1');

const VERIFICADORES = {
  'image/jpeg': (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  'image/png': (b) => b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
  'image/gif': (b) => ['GIF87a', 'GIF89a'].includes(ascii(b, 0, 6)),
  'image/webp': (b) => ascii(b, 0, 4) === 'RIFF' && ascii(b, 8, 12) === 'WEBP',
  'application/pdf': (b) => ascii(b, 0, 5) === '%PDF-',
  'video/mp4': (b) => ascii(b, 4, 8) === 'ftyp',
  'video/quicktime': (b) => ascii(b, 4, 8) === 'ftyp' || ['moov', 'mdat', 'wide', 'free'].includes(ascii(b, 4, 8)),
  'video/webm': (b) => b[0] === 0x1a && b[1] === 0x45 && b[2] === 0xdf && b[3] === 0xa3,
};

export function firmaCoincideConMime(buffer, mimeType) {
  const verificar = VERIFICADORES[mimeType];
  return Boolean(verificar && buffer.length >= 12 && verificar(buffer));
}
