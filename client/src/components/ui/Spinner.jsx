import './Spinner.css';

export default function Spinner({ texto = 'Cargando...' }) {
  return (
    <span className="spinner" aria-live="polite">
      <span className="spinner__rueda" aria-hidden="true" />
      {texto}
    </span>
  );
}
