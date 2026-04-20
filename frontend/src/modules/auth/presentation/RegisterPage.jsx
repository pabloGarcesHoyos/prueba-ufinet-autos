import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../../../shared/config/constants";
import {
  getFieldError,
  normalizeRegisterValues,
  sanitizeRegisterField,
  validateRegisterForm,
} from "../../../shared/utils/formValidation";
import { getErrorMessage } from "../../../shared/utils/errorUtils";
import useAuth from "./useAuth";

function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    const sanitizedValue = sanitizeRegisterField(name, value);
    const nextValues = {
      ...formValues,
      [name]: sanitizedValue,
    };

    setFormValues(nextValues);

    if (fieldErrors[name]) {
      const validationErrors = validateRegisterForm(nextValues);
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
    const validationErrors = validateRegisterForm(formValues);

    setFieldErrors((current) => ({
      ...current,
      [name]: getFieldError(validationErrors, name),
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const normalizedValues = normalizeRegisterValues(formValues);
    const validationErrors = validateRegisterForm(normalizedValues);

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");
      await register(normalizedValues);
      navigate(ROUTES.cars, { replace: true });
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "No fue posible registrar el usuario."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="auth-card__header">
          <p className="section-kicker">Registro</p>
          <h2>Crea tu cuenta</h2>
          <p>Completa todos los campos correctamente para ingresar al panel de autos.</p>
        </div>

        {errorMessage ? <div className="alert alert--error">{errorMessage}</div> : null}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <label className="field">
            <span>Nombre</span>
            <input
              type="text"
              name="name"
              value={formValues.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Tu nombre completo"
              maxLength={80}
              autoComplete="name"
              aria-invalid={Boolean(fieldErrors.name)}
              disabled={loading}
            />
            {fieldErrors.name ? (
              <small className="field__error">{fieldErrors.name}</small>
            ) : null}
          </label>

          <label className="field">
            <span>Correo electrónico</span>
            <input
              type="email"
              name="email"
              value={formValues.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="correo@ejemplo.com"
              autoComplete="email"
              aria-invalid={Boolean(fieldErrors.email)}
              disabled={loading}
            />
            {fieldErrors.email ? (
              <small className="field__error">{fieldErrors.email}</small>
            ) : null}
          </label>

          <label className="field">
            <span>Contraseña</span>
            <input
              type="password"
              name="password"
              value={formValues.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Elige una contraseña segura"
              minLength={8}
              maxLength={72}
              autoComplete="new-password"
              aria-invalid={Boolean(fieldErrors.password)}
              disabled={loading}
            />
            {fieldErrors.password ? (
              <small className="field__error">{fieldErrors.password}</small>
            ) : (
              <small className="field__hint">Debe tener al menos 8 caracteres.</small>
            )}
          </label>

          <button
            type="submit"
            className="button button--primary button--block"
            disabled={loading}
          >
            {loading ? "Creando cuenta..." : "Registrarse"}
          </button>
        </form>

        <p className="auth-card__footer">
          ¿Ya tienes una cuenta? <Link to={ROUTES.login}>Iniciar sesión</Link>
        </p>
      </div>
    </section>
  );
}

export default RegisterPage;
