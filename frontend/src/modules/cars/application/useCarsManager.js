import { useEffect, useState } from "react";
import useAuth from "../../auth/presentation/useAuth";
import carApi from "../infrastructure/carApi";
import { EMPTY_CAR_FORM } from "../../../shared/config/constants";
import { getErrorMessage } from "../../../shared/utils/errorUtils";
import {
  buildBrandOptions,
  buildResultLabel,
  buildYearOptions,
  filterCars,
} from "../domain/carFilters";
import {
  getCarPhotoName,
  getStoredCarPhotos,
  removeStoredCarPhoto,
  updateStoredCarPhoto,
} from "../domain/carPhotoStorage";

function useCarsManager() {
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
    void loadCars();
  }, []);

  async function loadCars() {
    try {
      setLoading(true);
      setPageError("");
      const data = await carApi.getCars();
      setCars(data);
      return data;
    } catch (error) {
      setPageError(getErrorMessage(error, "No fue posible cargar tus autos."));
      return [];
    } finally {
      setLoading(false);
    }
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
        await carApi.updateCar(editingId, payload);
        setNotice("Auto actualizado correctamente.");
      } else {
        const createdCar = await carApi.createCar(payload);
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

      setCarPhotos((current) => updateStoredCarPhoto(current, affectedCarId, photoName));
    } catch (error) {
      setFormError(getErrorMessage(error, "No fue posible guardar la información del auto."));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleEdit(id) {
    try {
      setFormLoading(true);
      setFormError("");
      setNotice("");
      const car = await carApi.getCarById(id);
      setMode("edit");
      setEditingId(id);
      setFormValues({
        brand: car.brand || "",
        model: car.model || "",
        year: car.year || "",
        plateNumber: car.plateNumber || "",
        color: car.color || "",
        photoName: getCarPhotoName(carPhotos, id),
      });
    } catch (error) {
      setPageError(getErrorMessage(error, "No fue posible cargar el detalle del auto."));
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm("¿Estás seguro de que deseas eliminar este auto?");

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setPageError("");
      setNotice("");
      await carApi.deleteCar(id);

      if (editingId === id) {
        resetForm();
      }

      setCarPhotos((current) => removeStoredCarPhoto(current, id));
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
    photoName: getCarPhotoName(carPhotos, car.id),
  }));
  const filteredCars = filterCars(carsWithPhoto, searchTerm, selectedBrand, selectedYear);
  const brandOptions = buildBrandOptions(carsWithPhoto);
  const yearOptions = buildYearOptions(carsWithPhoto);
  const hasActiveFilters = Boolean(searchTerm.trim() || selectedBrand || selectedYear);
  const totalCars = carsWithPhoto.length;
  const resultLabel = buildResultLabel(filteredCars.length, totalCars);

  return {
    user,
    cars: filteredCars,
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
  };
}

export default useCarsManager;
