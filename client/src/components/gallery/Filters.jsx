// Filtros de la galería.  Dueño: Rol 5
//
// Props:
//   valor: { tipo: string, q: string }
//   onCambiar(nuevoValor) -> Gallery actualiza sus filtros
//
// TODO(Rol 5):
//   - Botones (o <select>) con FILTROS_TIPO de constants/archivos.js: Todos / Imágenes / Videos / PDF.
//     Marcar el activo (aria-pressed={activo} si son botones).
//   - <input type="search" placeholder="Buscar por título..."> con <label> (puede ser visualmente oculto).
//   - onCambiar({ ...valor, tipo }) / onCambiar({ ...valor, q }).

export default function Filters({ valor, onCambiar }) {
  void valor;
  void onCambiar;
  return <div className="pendiente">Filtros — pendiente (Rol 5)</div>;
}
