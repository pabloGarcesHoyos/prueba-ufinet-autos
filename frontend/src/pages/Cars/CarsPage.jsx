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
      setPageError(getErrorMessage(error, "Unable to load your cars."));
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
        setNotice("Car updated successfully.");
      } else {
        const createdCar = await carService.createCar(payload);
        affectedCarId = createdCar?.id || null;
        setNotice("Car created successfully.");
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
      setFormError(getErrorMessage(error, "Unable to save car data."));
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
      setPageError(getErrorMessage(error, "Unable to load car details."));
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this car?"
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
      setNotice("Car deleted successfully.");
      await loadCars();
    } catch (error) {
      setPageError(getErrorMessage(error, "Unable to delete the car."));
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
      ? "No cars in your garage yet."
      : `${filteredCars.length} of ${totalCars} car${totalCars === 1 ? "" : "s"} shown`;

  return (
    <section className="cars-page">
      <div className="page-intro">
        <div>
          <p className="section-kicker">Private area</p>
          <h2>Cars dashboard</h2>
          <p>
            Manage the vehicles linked to {user?.name || user?.email || "your account"}.
          </p>
        </div>

        <div className="summary-chip">
          <strong>{totalCars}</strong>
          <span>{totalCars === 1 ? "car registered" : "cars registered"}</span>
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
                <p className="section-kicker">Discover faster</p>
                <h2>Search and filter</h2>
                <p className="results-copy">{resultLabel}</p>
              </div>

              <button
                type="button"
                className="button button--ghost"
                onClick={clearFilters}
                disabled={!hasActiveFilters}
              >
                Clear filters
              </button>
            </div>

            <div className="filters-grid">
              <label className="field field--search">
                <span>Search by plate or model</span>
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Type a plate or model"
                />
              </label>

              <label className="field">
                <span>Brand</span>
                <select
                  value={selectedBrand}
                  onChange={(event) => setSelectedBrand(event.target.value)}
                >
                  <option value="">All brands</option>
                  {brandOptions.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field">
                <span>Year</span>
                <select
                  value={selectedYear}
                  onChange={(event) => setSelectedYear(event.target.value)}
                >
                  <option value="">All years</option>
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
              <p>Loading cars...</p>
            </div>
          ) : totalCars === 0 ? (
            <div className="panel panel--centered">
              <p>No cars registered yet. Create your first one using the form.</p>
            </div>
          ) : filteredCars.length === 0 ? (
            <div className="panel panel--centered">
              <p>No cars match the current search or filters.</p>
              <button
                type="button"
                className="button button--ghost"
                onClick={clearFilters}
              >
                Show all cars
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
