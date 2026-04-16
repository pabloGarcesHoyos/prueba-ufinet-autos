function CarsTable({ cars, deletingId, onEdit, onDelete }) {
  return (
    <div className="panel">
      <div className="panel__header">
        <div>
          <p className="section-kicker">Your garage</p>
          <h2>Registered cars</h2>
          <p>{cars.length} result{cars.length === 1 ? "" : "s"} available.</p>
        </div>
      </div>

      <div className="table-scroll cars-table-wrap">
        <table className="cars-table">
          <thead>
            <tr>
              <th>Brand</th>
              <th>Model</th>
              <th>Year</th>
              <th>Plate</th>
              <th>Color</th>
              <th>Photo</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car) => (
              <tr key={car.id}>
                <td>{car.brand}</td>
                <td>{car.model}</td>
                <td>{car.year}</td>
                <td>{car.plateNumber}</td>
                <td>{car.color}</td>
                <td>
                  {car.photoName ? (
                    <span className="table-badge">{car.photoName}</span>
                  ) : (
                    <span className="muted-text">No photo note</span>
                  )}
                </td>
                <td>
                  <div className="table-actions">
                    <button
                      type="button"
                      className="button button--ghost"
                      onClick={() => onEdit(car.id)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="button button--danger"
                      onClick={() => onDelete(car.id)}
                      disabled={deletingId === car.id}
                    >
                      {deletingId === car.id ? "Deleting..." : "Delete"}
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
                  {car.year} · {car.color}
                </p>
              </div>
              <span className="table-badge">{car.plateNumber}</span>
            </div>

            <dl className="car-card__details">
              <div>
                <dt>Brand</dt>
                <dd>{car.brand}</dd>
              </div>
              <div>
                <dt>Model</dt>
                <dd>{car.model}</dd>
              </div>
              <div>
                <dt>Year</dt>
                <dd>{car.year}</dd>
              </div>
              <div>
                <dt>Color</dt>
                <dd>{car.color}</dd>
              </div>
              <div>
                <dt>Photo</dt>
                <dd>{car.photoName || "No photo note"}</dd>
              </div>
            </dl>

            <div className="table-actions">
              <button
                type="button"
                className="button button--ghost"
                onClick={() => onEdit(car.id)}
              >
                Edit
              </button>
              <button
                type="button"
                className="button button--danger"
                onClick={() => onDelete(car.id)}
                disabled={deletingId === car.id}
              >
                {deletingId === car.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default CarsTable;
