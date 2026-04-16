import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { ROUTES } from "../../utils/constants";
import { getErrorMessage } from "../../utils/errorUtils";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormValues((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function validateForm() {
    if (!formValues.email.trim()) {
      return "El correo electrónico es obligatorio.";
    }

    if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      return "Ingresa un correo electrónico válido.";
    }

    if (!formValues.password) {
      return "La contraseña es obligatoria.";
    }

    if (formValues.password.length < 8) {
      return "La contraseña debe tener al menos 8 caracteres.";
    }

    return "";
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationError = validateForm();

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");
      await login({
        email: formValues.email.trim(),
        password: formValues.password,
      });
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

        {errorMessage ? (
          <div className="alert alert--error">{errorMessage}</div>
        ) : null}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Correo electrónico</span>
            <input
              type="email"
              name="email"
              value={formValues.email}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
              disabled={loading}
            />
          </label>

          <label className="field">
            <span>Contraseña</span>
            <input
              type="password"
              name="password"
              value={formValues.password}
              onChange={handleChange}
              placeholder="Ingresa tu contraseña"
              disabled={loading}
            />
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
