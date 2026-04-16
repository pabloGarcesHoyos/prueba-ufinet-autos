import { useEffect, useState } from "react";
import { EMPTY_CAR_FORM } from "../../utils/constants";

function validateCar(values) {
  const errors = {};
  const year = Number(values.year);

  if (!values.brand.trim()) {
    errors.brand = "La marca es obligatoria.";
  }

  if (!values.model.trim()) {
    errors.model = "El modelo es obligatorio.";
  }

  if (!values.plateNumber.trim()) {
    errors.plateNumber = "La placa es obligatoria.";
  }

  if (!values.color.trim()) {
    errors.color = "El color es obligatorio.";
  }

  if (!values.year) {
    errors.year = "El año es obligatorio.";
  } else if (Number.isNaN(year) || year < 1886 || year > 2100) {
    errors.year = "El año debe estar entre 1886 y 2100.";
  }

  return errors;
}

function CarForm({
  mode,
  initialValues,
  onSubmit,
  onCancel,
  submitting,
  loading,
  serverError,
}) {
  const [formValues, setFormValues] = useState({ ...EMPTY_CAR_FORM });
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    setFormValues({
      ...EMPTY_CAR_FORM,
      ...initialValues,
    });
    setFieldErrors({});
  }, [initialValues]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormValues((current) => ({
      ...current,
      [name]: value,
    }));

    setFieldErrors((current) => ({
      ...current,
      [name]: "",
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateCar(formValues);

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      return;
    }

    await onSubmit({
      ...formValues,
      brand: formValues.brand.trim(),
      model: formValues.model.trim(),
      year: Number(formValues.year),
      plateNumber: formValues.plateNumber.trim(),
      color: formValues.color.trim(),
      photoName: formValues.photoName.trim(),
    });
  }

  const isEditing = mode === "edit";

  return (
    <section className="panel">
      <div className="panel__header">
        <div>
          <p className="section-kicker">{isEditing ? "Editar auto" : "Nuevo auto"}</p>
          <h2>{isEditing ? "Actualizar datos del vehiculo" : "Registrar un nuevo auto"}</h2>
        </div>
      </div>

      <form className="form-grid" onSubmit={handleSubmit}>
        <label className="field">
          <span>Marca</span>
          <input
            name="brand"
            value={formValues.brand}
            onChange={handleChange}
            placeholder="Toyota"
            disabled={submitting || loading}
          />
          {fieldErrors.brand ? (
            <small className="field__error">{fieldErrors.brand}</small>
          ) : null}
        </label>

        <label className="field">
          <span>Modelo</span>
          <input
            name="model"
            value={formValues.model}
            onChange={handleChange}
            placeholder="Corolla"
            disabled={submitting || loading}
          />
          {fieldErrors.model ? (
            <small className="field__error">{fieldErrors.model}</small>
          ) : null}
        </label>

        <label className="field">
          <span>Año</span>
          <input
            name="year"
            type="number"
            min="1886"
            max="2100"
            value={formValues.year}
            onChange={handleChange}
            placeholder="2024"
            disabled={submitting || loading}
          />
          {fieldErrors.year ? (
            <small className="field__error">{fieldErrors.year}</small>
          ) : null}
        </label>

        <label className="field">
          <span>Placa</span>
          <input
            name="plateNumber"
            value={formValues.plateNumber}
            onChange={handleChange}
            placeholder="ABC123"
            disabled={submitting || loading}
          />
          {fieldErrors.plateNumber ? (
            <small className="field__error">{fieldErrors.plateNumber}</small>
          ) : null}
        </label>

        <label className="field">
          <span>Color</span>
          <input
            name="color"
            value={formValues.color}
            onChange={handleChange}
            placeholder="White"
            disabled={submitting || loading}
          />
          {fieldErrors.color ? (
            <small className="field__error">{fieldErrors.color}</small>
          ) : null}
        </label>

        <label className="field">
          <span>Nombre de la foto</span>
          <input
            name="photoName"
            value={formValues.photoName}
            onChange={handleChange}
            placeholder="Foto-auto.jpg"
            disabled={submitting || loading}
          />
          <small className="field__hint">
            Campo simulado solo para presentacion. No se realiza una carga real.
          </small>
        </label>

        <div className="form-grid__actions">
          <button
            type="submit"
            className="button button--primary"
            disabled={submitting || loading}
          >
            {submitting ? "Guardando..." : isEditing ? "Actualizar auto" : "Crear auto"}
          </button>

          {isEditing ? (
            <button
              type="button"
              className="button button--ghost"
              onClick={onCancel}
              disabled={submitting || loading}
            >
              Cancelar edicion
            </button>
          ) : null}
        </div>

        {serverError ? <div className="alert alert--error">{serverError}</div> : null}
      </form>
    </section>
  );
}

export default CarForm;
