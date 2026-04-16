import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { ROUTES } from "../../utils/constants";
import { getErrorMessage } from "../../utils/errorUtils";

function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formValues, setFormValues] = useState({
    name: "",
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
    if (!formValues.name.trim()) {
      return "El nombre es obligatorio.";
    }

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
      await register({
        name: formValues.name.trim(),
        email: formValues.email.trim(),
        password: formValues.password,
      });
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
          <p>Cuando completes el registro, entrarás automáticamente a tus autos.</p>
        </div>

        {errorMessage ? (
          <div className="alert alert--error">{errorMessage}</div>
        ) : null}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Nombre</span>
            <input
              type="text"
              name="name"
              value={formValues.name}
              onChange={handleChange}
              placeholder="Tu nombre completo"
              disabled={loading}
            />
          </label>

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
              placeholder="Elige una contraseña segura"
              disabled={loading}
            />
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
