import { useEffect, useState } from "react";
import { EMPTY_CAR_FORM } from "../../../../shared/config/constants";
import {
  getFieldError,
  normalizeCarValues,
  sanitizeCarField,
  validateCarForm,
} from "../../../../shared/utils/formValidation";

const CURRENT_MAX_YEAR = new Date().getFullYear() + 1;

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
    const sanitizedValue = sanitizeCarField(name, value);
    const nextValues = {
      ...formValues,
      [name]: sanitizedValue,
    };

    setFormValues(nextValues);

    if (fieldErrors[name]) {
      const validationErrors = validateCarForm(nextValues);
      setFieldErrors((current) => ({
        ...current,
        [name]: getFieldError(validationErrors, name),
      }));
      return;
    }

    setFieldErrors((current) => ({
      ...current,
      [name]: "",
    }));
  }

  function handleBlur(event) {
    const { name } = event.target;
    const validationErrors = validateCarForm(formValues);

    setFieldErrors((current) => ({
      ...current,
      [name]: getFieldError(validationErrors, name),
    }));
  }

  async function handleFormSubmit(event) {
    event.preventDefault();

    const normalizedValues = normalizeCarValues(formValues);
    const validationErrors = validateCarForm(normalizedValues);

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      return;
    }

    await onSubmit({
      ...normalizedValues,
      year: Number(normalizedValues.year),
    });
  }

  const isEditing = mode === "edit";

  return (
    <section className="panel car-form">
      <div className="panel__header panel__header--split car-form__header">
        <div>
          <p className="section-kicker">{isEditing ? "Editar auto" : "Nuevo auto"}</p>
          <h2>{isEditing ? "Actualizar datos del vehículo" : "Registrar un nuevo auto"}</h2>
          <p>
            {isEditing
              ? "Modifica la información del vehículo y guarda los cambios."
              : "Completa todos los campos para registrar el vehículo correctamente."}
          </p>
        </div>

        <span
          className={`form-status ${isEditing ? "form-status--edit" : "form-status--create"}`}
        >
          {isEditing ? "Modo edición" : "Nuevo registro"}
        </span>
      </div>

      <form className="form-grid car-form__grid" onSubmit={handleFormSubmit} noValidate>
        <label className="field">
          <span>Marca</span>
          <input
            name="brand"
            value={formValues.brand}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Ej. Toyota"
            maxLength={50}
            autoComplete="off"
            aria-invalid={Boolean(fieldErrors.brand)}
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
            onBlur={handleBlur}
            placeholder="Ej. Corolla"
            maxLength={50}
            autoComplete="off"
            aria-invalid={Boolean(fieldErrors.model)}
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
            type="text"
            inputMode="numeric"
            value={formValues.year}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="2024"
            maxLength={4}
            autoComplete="off"
            aria-invalid={Boolean(fieldErrors.year)}
            disabled={submitting || loading}
          />
          {fieldErrors.year ? (
            <small className="field__error">{fieldErrors.year}</small>
          ) : (
            <small className="field__hint">Solo números. Entre 1886 y {CURRENT_MAX_YEAR}.</small>
          )}
        </label>

        <label className="field">
          <span>Placa</span>
          <input
            name="plateNumber"
            value={formValues.plateNumber}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Ej. ABC123"
            maxLength={10}
            autoComplete="off"
            aria-invalid={Boolean(fieldErrors.plateNumber)}
            disabled={submitting || loading}
          />
          {fieldErrors.plateNumber ? (
            <small className="field__error">{fieldErrors.plateNumber}</small>
          ) : (
            <small className="field__hint">Usa solo letras, números o guiones.</small>
          )}
        </label>

        <label className="field">
          <span>Color</span>
          <input
            name="color"
            value={formValues.color}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Ej. Blanco"
            maxLength={30}
            autoComplete="off"
            aria-invalid={Boolean(fieldErrors.color)}
            disabled={submitting || loading}
          />
          {fieldErrors.color ? (
            <small className="field__error">{fieldErrors.color}</small>
          ) : null}
        </label>

        <label className="field field--full field--soft">
          <span>Nombre de la foto</span>
          <input
            name="photoName"
            value={formValues.photoName}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="foto-auto.jpg"
            maxLength={100}
            autoComplete="off"
            aria-invalid={Boolean(fieldErrors.photoName)}
            disabled={submitting || loading}
          />
          {fieldErrors.photoName ? (
            <small className="field__error">{fieldErrors.photoName}</small>
          ) : (
            <small className="field__hint">
              Campo simulado para presentación. Usa un nombre descriptivo.
            </small>
          )}
        </label>

        <div className="form-grid__actions field--full">
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
              Cancelar edición
            </button>
          ) : null}
        </div>

        {serverError ? <div className="alert alert--error field--full">{serverError}</div> : null}
      </form>
    </section>
  );
}

export default CarForm;
