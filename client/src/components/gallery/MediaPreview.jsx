// Vista previa según el tipo de archivo.  Dueño: Rol 5
//
// Props:
//   archivo: objeto Archivo (usa archivo.tipoArchivo y archivo.url)
//
// TODO(Rol 5): vista previa NATIVA y diferenciada (la rúbrica lo exige):
//   - 'imagen' -> <img src={url} alt={titulo} loading="lazy" />  (object-fit: cover; altura fija)
//   - 'video'  -> <video src={url} controls preload="metadata" />
//   - 'pdf'    -> opción A: <iframe src={url} title={titulo} /> (o <embed type="application/pdf">)
//                 opción B (más liviana): miniatura de la 1ª página que genera Cloudinary
//                   cambiando la extensión .pdf por .jpg en la URL:  url.replace(/\.pdf$/i, '.jpg')
//                 + SIEMPRE un enlace <a href={url} target="_blank" rel="noopener noreferrer">Abrir PDF</a>
//   ⚠️ Si el PDF da 401: el Rol 1 debe activar "Allow delivery of PDF and ZIP files" en Cloudinary.

export default function MediaPreview({ archivo }) {
  void archivo;
  return <div className="pendiente">Vista previa — pendiente (Rol 5)</div>;
}
