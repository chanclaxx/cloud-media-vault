// Indicador de carga.  Dueño: Rol 4 (lo usa también Rol 5 en la galería)
//
// Props:
//   texto?: string  (ej. "Subiendo..." / "Cargando archivos...")
//
// TODO(Rol 4): animación CSS (borde que gira con @keyframes). aria-live="polite" para accesibilidad.

export default function Spinner({ texto = 'Cargando...' }) {
  return <span aria-live="polite">{texto}</span>;
}
