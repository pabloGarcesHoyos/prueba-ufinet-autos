import { useEffect, useState } from "react";
import CarForm from "../../components/cars/CarForm";
import CarsTable from "../../components/cars/CarsTable";
import useAuth from "../../hooks/useAuth";
import carService from "../../services/carService";
import {
  CAR_PHOTO_STORAGE_KEY,
  EMPTY_CAR_FORM,
} from "../../utils/constants";
import { getErrorMessage } from "../../utils/errorUtils";

function getStoredCarPhotos() {
  const rawValue = localStorage.getItem(CAR_PHOTO_STORAGE_KEY);

  if (!rawValue) {
    return {};
  }

  try {
    const parsedValue = JSON.parse(rawValue);
    return parsedValue && typeof parsedValue === "object" ? parsedValue : {};
  } catch {
    localStorage.removeItem(CAR_PHOTO_STORAGE_KEY);
    return {};
  }
}

function CarsPage() {
  const { user } = useAuth();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [pageError, setPageError] = useState("");
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");
  const [mode, setMode] = useState("create");
  const [editingId, setEditingId] = useState(null);
  const [formValues, setFormValues] = useState({ ...EMPTY_CAR_FORM });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [carPhotos, setCarPhotos] = useState(() => getStoredCarPhotos());

  useEffect(() => {
    loadCars();
  }, []);

  async function loadCars() {
    try {
      setLoading(true);
      setPageError("");
      const data = await carService.getCars();
      setCars(data);
      return data;
    } catch (error) {
      setPageError(getErrorMessage(error, "No fue posible cargar tus autos."));
      return [];
    } finally {
      setLoading(false);
    }
  }

  function updateCarPhoto(carId, photoName) {
    if (!carId) {
      return;
    }

    const normalizedPhotoName = photoName.trim();
    setCarPhotos((current) => {
      const nextPhotos = { ...current };

      if (normalizedPhotoName) {
        nextPhotos[String(carId)] = normalizedPhotoName;
      } else {
        delete nextPhotos[String(carId)];
      }

      localStorage.setItem(CAR_PHOTO_STORAGE_KEY, JSON.stringify(nextPhotos));
      return nextPhotos;
    });
  }

  function removeCarPhoto(carId) {
    if (!carId) {
      return;
    }

    setCarPhotos((current) => {
      if (!current[String(carId)]) {
        return current;
      }

      const nextPhotos = { ...current };
      delete nextPhotos[String(carId)];
      localStorage.setItem(CAR_PHOTO_STORAGE_KEY, JSON.stringify(nextPhotos));
      return nextPhotos;
    });
  }

  function getPhotoName(carId) {
    return carPhotos[String(carId)] || "";
  }

  function resetForm() {
    setMode("create");
    setEditingId(null);
    setFormError("");
    setFormValues({ ...EMPTY_CAR_FORM });
  }

  async function handleSubmit(values) {
    const { photoName = "", ...payload } = values;

    try {
      setSubmitting(true);
      setFormError("");
      setNotice("");

      let affectedCarId = editingId;

      if (mode === "edit" && editingId) {
        await carService.updateCar(editingId, payload);
        setNotice("Auto actualizado correctamente.");
      } else {
        const createdCar = await carService.createCar(payload);
        affectedCarId = createdCar?.id || null;
        setNotice("Auto creado correctamente.");
      }

      resetForm();
      const refreshedCars = await loadCars();

      if (!affectedCarId) {
        affectedCarId =
          refreshedCars.find((car) => car.plateNumber === payload.plateNumber)?.id ||
          null;
      }

      updateCarPhoto(affectedCarId, photoName);
    } catch (error) {
      setFormError(getErrorMessage(error, "No fue posible guardar la informacion del auto."));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleEdit(id) {
    try {
      setFormLoading(true);
      setFormError("");
      setNotice("");
      const car = await carService.getCarById(id);
      setMode("edit");
      setEditingId(id);
      setFormValues({
        brand: car.brand || "",
        model: car.model || "",
        year: car.year || "",
        plateNumber: car.plateNumber || "",
        color: car.color || "",
        photoName: getPhotoName(id),
      });
    } catch (error) {
      setPageError(getErrorMessage(error, "No fue posible cargar el detalle del auto."));
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Estas seguro de que deseas eliminar este auto?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setPageError("");
      setNotice("");
      await carService.deleteCar(id);

      if (editingId === id) {
        resetForm();
      }

      removeCarPhoto(id);
      setNotice("Auto eliminado correctamente.");
      await loadCars();
    } catch (error) {
      setPageError(getErrorMessage(error, "No fue posible eliminar el auto."));
    } finally {
      setDeletingId(null);
    }
  }

  function clearFilters() {
    setSearchTerm("");
    setSelectedBrand("");
    setSelectedYear("");
  }

  const carsWithPhoto = cars.map((car) => ({
    ...car,
    photoName: getPhotoName(car.id),
  }));

  const brandOptions = [...new Set(carsWithPhoto.map((car) => car.brand))]
    .filter(Boolean)
    .sort((left, right) => left.localeCompare(right));

  const yearOptions = [...new Set(carsWithPhoto.map((car) => car.year))]
    .filter((year) => year !== null && year !== undefined)
    .sort((left, right) => right - left);

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredCars = carsWithPhoto.filter((car) => {
    const matchesSearch =
      !normalizedSearch ||
      car.plateNumber.toLowerCase().includes(normalizedSearch) ||
      car.model.toLowerCase().includes(normalizedSearch);

    const matchesBrand = !selectedBrand || car.brand === selectedBrand;
    const matchesYear = !selectedYear || String(car.year) === selectedYear;

    return matchesSearch && matchesBrand && matchesYear;
  });

  const hasActiveFilters = Boolean(
    normalizedSearch || selectedBrand || selectedYear
  );
  const totalCars = carsWithPhoto.length;
  const resultLabel =
    totalCars === 0
      ? "Aun no tienes autos registrados."
      : `${filteredCars.length} de ${totalCars} auto${totalCars === 1 ? "" : "s"} mostrados`;

  return (
    <section className="cars-page">
      <div className="page-intro">
        <div>
          <p className="section-kicker">Area privada</p>
          <h2>Panel de autos</h2>
          <p>
            Gestiona los vehiculos asociados a {user?.name || user?.email || "tu cuenta"}.
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
                <p className="section-kicker">Consulta rapida</p>
                <h2>Busqueda y filtros</h2>
                <p className="results-copy">{resultLabel}</p>
              </div>

              <button
                type="button"
                className="button button--ghost"
                onClick={clearFilters}
                disabled={!hasActiveFilters}
              >
                Limpiar filtros
              </button>
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
                <span>Anio</span>
                <select
                  value={selectedYear}
                  onChange={(event) => setSelectedYear(event.target.value)}
                >
                  <option value="">Todos los anios</option>
                  {yearOptions.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </section>

          {loading ? (
            <div className="panel panel--centered">
              <p>Cargando autos...</p>
            </div>
          ) : totalCars === 0 ? (
            <div className="panel panel--centered">
              <p>Aun no hay autos registrados. Crea el primero usando el formulario.</p>
            </div>
          ) : filteredCars.length === 0 ? (
            <div className="panel panel--centered">
              <p>No hay autos que coincidan con la busqueda o los filtros actuales.</p>
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
              cars={filteredCars}
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
