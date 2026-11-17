// Vista previa según el tipo de archivo.  Dueño: Rol 5
//
// Props:
//   archivo: objeto Archivo (usa archivo.tipoArchivo, archivo.url y archivo.titulo)
//
// Vista previa NATIVA y diferenciada (la rúbrica lo exige):
//   - imagen -> <img>
//   - video  -> <video controls>
//   - pdf    -> miniatura de la 1.ª página (la genera Cloudinary) + enlace "Abrir PDF"
//
// Cloudinary puede transformar un archivo cambiando su URL: si se agrega un texto como
// "w_480,h_320,c_fill" después de "/upload/", entrega una versión más pequeña. Así la galería
// descarga miniaturas livianas y no los archivos originales completos.
import { useState } from 'react';

const ANCHO = 480;
const ALTO = 320;

/** Inserta una transformación de Cloudinary en la URL. Si la URL no es de Cloudinary, la deja igual. */
function conTransformacion(url, transformacion) {
  if (!url.includes('/upload/')) return url;
  return url.replace('/upload/', `/upload/${transformacion}/`);
}

/** Cambia la extensión final de la URL (ej. ".pdf" o ".mp4" -> ".jpg"). */
function cambiarExtension(url, extension) {
  return url.replace(/\.[a-z0-9]+$/i, `.${extension}`);
}

export default function MediaPreview({ archivo }) {
  const { tipoArchivo, url, titulo } = archivo;
  // Si la miniatura no carga (ej. PDF bloqueado en Cloudinary), se muestra un recuadro de respaldo.
  const [falloMiniatura, setFalloMiniatura] = useState(false);

  if (tipoArchivo === 'imagen') {
    if (falloMiniatura) return <Respaldo icono="🖼️" texto="No se pudo cargar la imagen" />;
    return (
      <img
        className="vista-previa"
        src={conTransformacion(url, `c_fill,w_${ANCHO},h_${ALTO},q_auto,f_auto`)}
        alt={titulo}
        loading="lazy"
        width={ANCHO}
        height={ALTO}
        onError={() => setFalloMiniatura(true)}
      />
    );
  }

  if (tipoArchivo === 'video') {
    // `poster`: Cloudinary genera una imagen del primer segundo si se pide el video como .jpg.
    const poster = cambiarExtension(conTransformacion(url, `so_0,c_fill,w_${ANCHO},h_${ALTO}`), 'jpg');
    return (
      <video className="vista-previa" src={url} poster={poster} controls preload="metadata">
        Tu navegador no puede reproducir este video.{' '}
        <a href={url} target="_blank" rel="noopener noreferrer">
          Descargarlo
        </a>
      </video>
    );
  }

  if (tipoArchivo === 'pdf') {
    // Un PDF subido con resource_type "auto" queda como "image" en Cloudinary, por eso se puede
    // pedir su primera página como .jpg.
    const miniatura = cambiarExtension(conTransformacion(url, `pg_1,c_fill,g_north,w_${ANCHO},h_${ALTO}`), 'jpg');
    return (
      <a
        className="vista-previa vista-previa--pdf"
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        title={`Abrir PDF: ${titulo}`}
      >
        {falloMiniatura ? (
          <Respaldo icono="📄" texto="Documento PDF" />
        ) : (
          <img
            src={miniatura}
            alt={`Primera página de ${titulo}`}
            loading="lazy"
            width={ANCHO}
            height={ALTO}
            onError={() => setFalloMiniatura(true)}
          />
        )}
        <span className="vista-previa__etiqueta">Abrir PDF ↗</span>
      </a>
    );
  }

  // Tipo desconocido: no debería pasar con nuestra API, pero la tarjeta no se rompe.
  return <Respaldo icono="📁" texto="Sin vista previa" />;
}

function Respaldo({ icono, texto }) {
  return (
    <div className="vista-previa vista-previa--respaldo">
      <span aria-hidden="true">{icono}</span>
      <span>{texto}</span>
    </div>
  );
}
