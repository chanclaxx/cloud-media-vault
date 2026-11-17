// Indicador de carga.  Dueño: Rol 4 (lo usa también Rol 5 en la galería)
//
// Props:
//   texto?: string  (ej. "Subiendo..." / "Cargando archivos...")
import './Spinner.css';

export default function Spinner({ texto = 'Cargando...' }) {
  return (
    <span className="spinner" aria-live="polite">
      <span className="spinner__rueda" aria-hidden="true" />
      {texto}
    </span>
  );
}
