// Tarjeta de un archivo.  Dueño: Rol 5
//
// Props:
//   archivo: objeto Archivo (ver docs/API.md)
//   onEliminar(id): Promise  -> lo maneja Gallery (borra en la API y quita la tarjeta de la lista)
//
// Muestra lo que pide la rúbrica: vista previa, título, peso (KB/MB), tipo, fecha, autor y botón Eliminar.
import { useState } from 'react';
import MediaPreview from './MediaPreview.jsx';
import { formatearBytes, formatearFecha } from '../../utils/formato.js';

const ETIQUETA_TIPO = {
  imagen: 'Imagen',
  video: 'Video',
  pdf: 'PDF',
};

export default function FileCard({ archivo, onEliminar }) {
  const [eliminando, setEliminando] = useState(false);

  async function manejarClickEliminar() {
    const confirmado = window.confirm(
      `¿Eliminar "${archivo.titulo}"? Se borrará de la nube y de la base de datos.`,
    );
    if (!confirmado) return;

    setEliminando(true);
    try {
      await onEliminar(archivo.id);
      // Si salió bien, Gallery quita esta tarjeta de la lista (desaparece sola).
    } catch {
      // Gallery ya muestra el mensaje de error; aquí solo se reactiva el botón.
      setEliminando(false);
    }
  }

  return (
    <article className={`tarjeta${eliminando ? ' tarjeta--eliminando' : ''}`} aria-busy={eliminando}>
      <MediaPreview archivo={archivo} />

      <div className="tarjeta__cuerpo">
        <div className="tarjeta__encabezado">
          <h3 className="tarjeta__titulo" title={archivo.titulo}>
            {archivo.titulo}
          </h3>
          <span className={`insignia insignia--${archivo.tipoArchivo}`}>
            {ETIQUETA_TIPO[archivo.tipoArchivo] ?? archivo.tipoArchivo}
          </span>
        </div>

        {archivo.nombreOriginal && (
          <p className="tarjeta__nombre-original" title={archivo.nombreOriginal}>
            {archivo.nombreOriginal}
          </p>
        )}

        <dl className="tarjeta__metadatos">
          <div>
            <dt>Peso</dt>
            <dd>{formatearBytes(archivo.tamanoBytes)}</dd>
          </div>
          <div>
            <dt>Tipo</dt>
            <dd>{archivo.mimeType}</dd>
          </div>
          <div>
            <dt>Subido</dt>
            <dd>
              <time dateTime={archivo.fechaSubida}>{formatearFecha(archivo.fechaSubida)}</time>
            </dd>
          </div>
          <div>
            <dt>Autor</dt>
            <dd>{archivo.subidoPor}</dd>
          </div>
        </dl>

        <button
          type="button"
          className="tarjeta__eliminar"
          onClick={manejarClickEliminar}
          disabled={eliminando}
          aria-label={`Eliminar ${archivo.titulo}`}
        >
          {eliminando ? 'Eliminando...' : 'Eliminar'}
        </button>
      </div>
    </article>
  );
}
