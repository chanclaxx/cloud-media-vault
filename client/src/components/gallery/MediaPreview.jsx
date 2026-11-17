import { useState } from 'react';

const ANCHO = 480;
const ALTO = 320;

function conTransformacion(url, transformacion) {
  if (!url.includes('/upload/')) return url;
  return url.replace('/upload/', `/upload/${transformacion}/`);
}

function cambiarExtension(url, extension) {
  return url.replace(/\.[a-z0-9]+$/i, `.${extension}`);
}

export default function MediaPreview({ archivo }) {
  const { tipoArchivo, url, titulo } = archivo;
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
