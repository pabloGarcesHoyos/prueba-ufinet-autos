import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../../../shared/config/constants";
import {
  getFieldError,
  normalizeLoginValues,
  sanitizeLoginField,
  validateLoginForm,
} from "../../../shared/utils/formValidation";
import { getErrorMessage } from "../../../shared/utils/errorUtils";
import useAuth from "./useAuth";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    const sanitizedValue = sanitizeLoginField(name, value);
    const nextValues = {
      ...formValues,
      [name]: sanitizedValue,
    };

    setFormValues(nextValues);

    if (fieldErrors[name]) {
      const validationErrors = validateLoginForm(nextValues);
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
    const validationErrors = validateLoginForm(formValues);

    setFieldErrors((current) => ({
      ...current,
      [name]: getFieldError(validationErrors, name),
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const normalizedValues = normalizeLoginValues(formValues);
    const validationErrors = validateLoginForm(normalizedValues);

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");
      await login(normalizedValues);
      navigate(ROUTES.cars, { replace: true });
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "No fue posible iniciar sesión."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="auth-card__header">
          <p className="section-kicker">Autenticación</p>
          <h2>Inicia sesión para gestionar tus autos</h2>
          <p>Usa tu correo registrado y tu contraseña para entrar al área privada.</p>
        </div>

        {location.state?.sessionExpired ? (
          <div className="alert alert--warning">
            Tu sesión ya no es válida. Inicia sesión nuevamente.
          </div>
        ) : null}

        {errorMessage ? <div className="alert alert--error">{errorMessage}</div> : null}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
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
              placeholder="Ingresa tu contraseña"
              autoComplete="current-password"
              aria-invalid={Boolean(fieldErrors.password)}
              disabled={loading}
            />
            {fieldErrors.password ? (
              <small className="field__error">{fieldErrors.password}</small>
            ) : null}
          </label>

          <button
            type="submit"
            className="button button--primary button--block"
            disabled={loading}
          >
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>

        <p className="auth-card__footer">
          ¿No tienes una cuenta? <Link to={ROUTES.register}>Crear cuenta</Link>
        </p>
      </div>
    </section>
  );
}

export default LoginPage;
