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
      return "Email is required.";
    }

    if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      return "Enter a valid email address.";
    }

    if (!formValues.password) {
      return "Password is required.";
    }

    if (formValues.password.length < 8) {
      return "Password must contain at least 8 characters.";
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
      setErrorMessage(getErrorMessage(error, "Unable to sign in."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="auth-card__header">
          <p className="section-kicker">Authentication</p>
          <h2>Sign in to manage your cars</h2>
          <p>Use your registered email and password to access the private area.</p>
        </div>

        {location.state?.sessionExpired ? (
          <div className="alert alert--warning">
            Your session is no longer valid. Please sign in again.
          </div>
        ) : null}

        {errorMessage ? (
          <div className="alert alert--error">{errorMessage}</div>
        ) : null}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={formValues.email}
              onChange={handleChange}
              placeholder="you@example.com"
              disabled={loading}
            />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              type="password"
              name="password"
              value={formValues.password}
              onChange={handleChange}
              placeholder="Enter your password"
              disabled={loading}
            />
          </label>

          <button
            type="submit"
            className="button button--primary button--block"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="auth-card__footer">
          Don&apos;t have an account? <Link to={ROUTES.register}>Create one</Link>
        </p>
      </div>
    </section>
  );
}

export default LoginPage;
