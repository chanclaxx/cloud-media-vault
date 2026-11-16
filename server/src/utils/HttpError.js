// Error con código HTTP y código legible para el frontend (formato de docs/API.md).
// Uso:  throw new HttpError(404, 'NO_ENCONTRADO', 'El archivo no existe.');
// El middleware errorHandler lo convierte en { ok: false, error: { codigo, mensaje } }.
export class HttpError extends Error {
  constructor(status, codigo, mensaje) {
    super(mensaje);
    this.name = 'HttpError';
    this.status = status;
    this.codigo = codigo;
  }
}
