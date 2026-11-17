import { API_URL } from '../config.js';

export async function pedirJSON(ruta, opciones = {}) {
  let respuesta;
  try {
    respuesta = await fetch(`${API_URL}${ruta}`, opciones);
  } catch {
    throw new Error('No se pudo conectar con el servidor. ¿Está corriendo la API?');
  }

  const cuerpo = await respuesta.json().catch(() => null);

  if (!respuesta.ok || !cuerpo?.ok) {
    const error = new Error(cuerpo?.error?.mensaje || `Error ${respuesta.status} del servidor.`);
    error.codigo = cuerpo?.error?.codigo;
    error.status = respuesta.status;
    throw error;
  }
  return cuerpo.data;
}

export function subirArchivo(formData, { onProgreso } = {}) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_URL}/api/archivos`);

    xhr.upload.onprogress = (evento) => {
      if (evento.lengthComputable) {
        onProgreso?.(Math.round((evento.loaded / evento.total) * 100));
      }
    };

    xhr.onload = () => {
      let cuerpo;
      try {
        cuerpo = JSON.parse(xhr.responseText);
      } catch {
        cuerpo = null;
      }

      if (xhr.status >= 200 && xhr.status < 300 && cuerpo?.ok) {
        resolve(cuerpo.data);
        return;
      }
      const error = new Error(cuerpo?.error?.mensaje || `Error ${xhr.status} del servidor.`);
      error.codigo = cuerpo?.error?.codigo;
      error.status = xhr.status;
      reject(error);
    };

    xhr.onerror = () => reject(new Error('No se pudo conectar con el servidor. ¿Está corriendo la API?'));
    xhr.onabort = () => reject(new Error('La subida fue cancelada.'));

    xhr.send(formData);
  });
}

export async function listarArchivos(filtros = {}) {
  const params = new URLSearchParams();
  for (const [clave, valor] of Object.entries(filtros)) {
    const texto = typeof valor === 'string' ? valor.trim() : valor;
    if (texto) params.set(clave, texto);
  }
  const query = params.toString();
  return pedirJSON(`/api/archivos${query ? `?${query}` : ''}`);
}

export async function eliminarArchivo(id) {
  return pedirJSON(`/api/archivos/${encodeURIComponent(id)}`, { method: 'DELETE' });
}
