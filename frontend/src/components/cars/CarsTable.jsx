function CarsTable({ cars, deletingId, onEdit, onDelete }) {
  return (
    <div className="panel">
      <div className="panel__header panel__header--split">
        <div>
          <p className="section-kicker">Listado</p>
          <h2>Autos registrados</h2>
          <p>Consulta, edita o elimina los vehículos guardados en tu cuenta.</p>
        </div>

        <span className="results-badge">
          {cars.length} resultado{cars.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="table-scroll cars-table-wrap">
        <table className="cars-table">
          <thead>
            <tr>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Año</th>
              <th>Placa</th>
              <th>Color</th>
              <th>Foto</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car) => (
              <tr key={car.id}>
                <td>{car.brand}</td>
                <td>{car.model}</td>
                <td>{car.year}</td>
                <td>
                  <span className="plate-badge">{car.plateNumber}</span>
                </td>
                <td>{car.color}</td>
                <td>
                  {car.photoName ? (
                    <span className="table-badge">{car.photoName}</span>
                  ) : (
                    <span className="muted-text">Sin referencia</span>
                  )}
                </td>
                <td>
                  <div className="table-actions">
                    <button
                      type="button"
                      className="button button--ghost"
                      onClick={() => onEdit(car.id)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="button button--danger"
                      onClick={() => onDelete(car.id)}
                      disabled={deletingId === car.id}
                    >
                      {deletingId === car.id ? "Eliminando..." : "Eliminar"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="cars-cards">
        {cars.map((car) => (
          <article key={car.id} className="car-card">
            <div className="car-card__header">
              <div>
                <h3>
                  {car.brand} {car.model}
                </h3>
                <p>
                  {car.year} - {car.color}
                </p>
              </div>
              <span className="table-badge">{car.plateNumber}</span>
            </div>

            <dl className="car-card__details">
              <div>
                <dt>Marca</dt>
                <dd>{car.brand}</dd>
              </div>
              <div>
                <dt>Modelo</dt>
                <dd>{car.model}</dd>
              </div>
              <div>
                <dt>Año</dt>
                <dd>{car.year}</dd>
              </div>
              <div>
                <dt>Color</dt>
                <dd>{car.color}</dd>
              </div>
              <div>
                <dt>Foto</dt>
                <dd>{car.photoName || "Sin referencia"}</dd>
              </div>
            </dl>

            <div className="table-actions">
              <button
                type="button"
                className="button button--ghost"
                onClick={() => onEdit(car.id)}
              >
                Editar
              </button>
              <button
                type="button"
                className="button button--danger"
                onClick={() => onDelete(car.id)}
                disabled={deletingId === car.id}
              >
                {deletingId === car.id ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default CarsTable;
