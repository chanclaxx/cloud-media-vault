// Galería de archivos.  Dueño: Rol 5
//
// Props:
//   version: number -> cambia cada vez que se sube un archivo; al cambiar hay que recargar la lista.
//
// TODO(Rol 5):
//   Estado sugerido: archivos [], cargando, error, filtros { tipo: '', q: '' }
//   1. useEffect que depende de [version, filtros.tipo, filtros.q] -> listarArchivos(filtros).
//      - Para la búsqueda por texto, esperar ~300 ms después de que el usuario deja de escribir
//        (debounce) para no hacer una petición por cada tecla.
//      - Ignorar respuestas viejas si el usuario cambió el filtro (variable `cancelado` en el cleanup).
//   2. Mostrar: <Spinner /> mientras carga, <Alert tipo="error"> si falla,
//      "No hay archivos" si la lista está vacía, y si no, un grid de <FileCard />.
//   3. <Filters valor={filtros} onCambiar={setFiltros} />
//   4. Eliminar (borrado reactivo, la rúbrica lo pide):
//        async function manejarEliminar(id) {
//          await eliminarArchivo(id);
//          setArchivos((prev) => prev.filter((a) => a.id !== id));   // sin recargar la página
//        }
//      Mostrar error si falla (y NO quitar la tarjeta en ese caso).
//   5. Grid responsivo: display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));

export default function Gallery({ version }) {
  void version;
  return (
    <div className="pendiente">
      <strong>Galería multimedia</strong>
      <p>Pendiente — Rol 5 (vista previa, metadatos, filtros y eliminación).</p>
    </div>
  );
}
