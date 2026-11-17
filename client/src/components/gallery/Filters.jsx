import { FILTROS_TIPO } from '../../constants/archivos.js';

export default function Filters({ valor, onCambiar }) {
  return (
    <div className="filtros">
      <div className="filtros__tipos" role="group" aria-label="Filtrar por tipo de archivo">
        {FILTROS_TIPO.map((opcion) => {
          const activo = valor.tipo === opcion.valor;
          return (
            <button
              key={opcion.valor || 'todos'}
              type="button"
              className={`filtros__boton${activo ? ' filtros__boton--activo' : ''}`}
              aria-pressed={activo}
              onClick={() => onCambiar({ ...valor, tipo: opcion.valor })}
            >
              {opcion.etiqueta}
            </button>
          );
        })}
      </div>

      <label className="filtros__busqueda">
        <span className="solo-lector">Buscar por título</span>
        <input
          type="search"
          placeholder="Buscar por título..."
          value={valor.q}
          maxLength={100}
          onChange={(e) => onCambiar({ ...valor, q: e.target.value })}
        />
      </label>
    </div>
  );
}
