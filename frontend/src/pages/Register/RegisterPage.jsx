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
      return "Name is required.";
    }

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
      await register({
        name: formValues.name.trim(),
        email: formValues.email.trim(),
        password: formValues.password,
      });
      navigate(ROUTES.cars, { replace: true });
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Unable to register user."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="auth-card__header">
          <p className="section-kicker">Registration</p>
          <h2>Create your account</h2>
          <p>Once registered, you will be signed in and redirected to your cars.</p>
        </div>

        {errorMessage ? (
          <div className="alert alert--error">{errorMessage}</div>
        ) : null}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Name</span>
            <input
              type="text"
              name="name"
              value={formValues.name}
              onChange={handleChange}
              placeholder="Your full name"
              disabled={loading}
            />
          </label>

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
              placeholder="Choose a secure password"
              disabled={loading}
            />
          </label>

          <button
            type="submit"
            className="button button--primary button--block"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="auth-card__footer">
          Already have an account? <Link to={ROUTES.login}>Sign in</Link>
        </p>
      </div>
    </section>
  );
}

export default RegisterPage;
