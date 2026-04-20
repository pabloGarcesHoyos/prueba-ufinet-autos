import useCarsManager from "../application/useCarsManager";
import CarForm from "./components/CarForm";
import CarsTable from "./components/CarsTable";

function CarsPage() {
  const {
    user,
    cars,
    loading,
    formLoading,
    submitting,
    deletingId,
    pageError,
    formError,
    notice,
    mode,
    formValues,
    searchTerm,
    selectedBrand,
    selectedYear,
    brandOptions,
    yearOptions,
    hasActiveFilters,
    totalCars,
    resultLabel,
    setSearchTerm,
    setSelectedBrand,
    setSelectedYear,
    handleSubmit,
    handleEdit,
    handleDelete,
    clearFilters,
    resetForm,
  } = useCarsManager();

  return (
    <section className="cars-page">
      <div className="page-intro">
        <div>
          <p className="section-kicker">Área privada</p>
          <h2>Panel de autos</h2>
          <p>
            Gestiona los vehículos asociados a {user?.name || user?.email || "tu cuenta"}.
          </p>
        </div>

        <div className="summary-chip">
          <strong>{totalCars}</strong>
          <span>{totalCars === 1 ? "auto registrado" : "autos registrados"}</span>
        </div>
      </div>

      {notice ? <div className="alert alert--success">{notice}</div> : null}
      {pageError ? <div className="alert alert--error">{pageError}</div> : null}

      <div className="cars-grid">
        <CarForm
          mode={mode}
          initialValues={formValues}
          onSubmit={handleSubmit}
          onCancel={resetForm}
          submitting={submitting}
          loading={formLoading}
          serverError={formError}
        />

        <section className="cars-content">
          <section className="panel filters-panel">
            <div className="filters-panel__header">
              <div>
                <p className="section-kicker">Filtrar autos</p>
                <h2>Encuentra tus registros</h2>
              </div>
              <p className="results-copy">{resultLabel}</p>
            </div>

            <div className="filters-grid">
              <label className="field field--search">
                <span>Buscar por placa o modelo</span>
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Escribe una placa o un modelo"
                />
              </label>

              <label className="field">
                <span>Marca</span>
                <select
                  value={selectedBrand}
                  onChange={(event) => setSelectedBrand(event.target.value)}
                >
                  <option value="">Todas las marcas</option>
                  {brandOptions.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field">
                <span>Año</span>
                <select
                  value={selectedYear}
                  onChange={(event) => setSelectedYear(event.target.value)}
                >
                  <option value="">Todos los años</option>
                  {yearOptions.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </label>

              <div className="filters-actions">
                <button
                  type="button"
                  className="button button--ghost button--block"
                  onClick={clearFilters}
                  disabled={!hasActiveFilters}
                >
                  Limpiar filtros
                </button>
              </div>
            </div>

            {hasActiveFilters ? (
              <div className="active-filters">
                <span className="active-filters__label">Activos:</span>
                {searchTerm.trim() ? (
                  <span className="filter-chip">Búsqueda: {searchTerm.trim()}</span>
                ) : null}
                {selectedBrand ? (
                  <span className="filter-chip">Marca: {selectedBrand}</span>
                ) : null}
                {selectedYear ? (
                  <span className="filter-chip">Año: {selectedYear}</span>
                ) : null}
              </div>
            ) : null}
          </section>

          {loading ? (
            <div className="panel panel--centered">
              <p>Cargando autos...</p>
            </div>
          ) : totalCars === 0 ? (
            <div className="panel panel--centered">
              <p>Aún no hay autos registrados. Crea el primero usando el formulario.</p>
            </div>
          ) : cars.length === 0 ? (
            <div className="panel panel--centered">
              <p>No hay autos que coincidan con la búsqueda o los filtros actuales.</p>
              <button
                type="button"
                className="button button--ghost"
                onClick={clearFilters}
              >
                Mostrar todos los autos
              </button>
            </div>
          ) : (
            <CarsTable
              cars={cars}
              deletingId={deletingId}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </section>
      </div>
    </section>
  );
}

export default CarsPage;
