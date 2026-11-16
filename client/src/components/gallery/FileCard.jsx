// Tarjeta de un archivo.  Dueño: Rol 5
//
// Props:
//   archivo: objeto Archivo (ver docs/API.md)
//   onEliminar(id): Promise  -> lo maneja Gallery
//
// TODO(Rol 5): la rúbrica pide que CADA tarjeta muestre:
//   - vista previa multimedia   -> <MediaPreview archivo={archivo} />
//   - nombre / título           -> archivo.titulo (y archivo.nombreOriginal en pequeño)
//   - peso formateado (KB/MB)   -> formatearBytes(archivo.tamanoBytes)
//   - tipo de archivo           -> archivo.tipoArchivo (como etiqueta/badge) y archivo.mimeType
//   - fecha de subida           -> formatearFecha(archivo.fechaSubida)
//   - autor                     -> archivo.subidoPor
//   - botón Eliminar:
//       * pedir confirmación: window.confirm(`¿Eliminar "${archivo.titulo}"? Se borrará de la nube y de la base de datos.`)
//       * deshabilitar el botón y mostrar "Eliminando..." mientras espera
//       * aria-label={`Eliminar ${archivo.titulo}`}

export default function FileCard({ archivo, onEliminar }) {
  void onEliminar;
  return <article className="pendiente">{archivo?.titulo ?? 'Tarjeta'} — pendiente (Rol 5)</article>;
}
