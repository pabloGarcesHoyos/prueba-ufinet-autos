import { NavLink, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { APP_NAME, ROUTES } from "../../utils/constants";

function AppLayout() {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <div className="app-shell">
      <header className="app-shell__header">
        <div className="brand-block">
          <p className="app-shell__eyebrow">{APP_NAME}</p>
          <h1>Autos Management Portal</h1>
          <p className="brand-block__text">
            Register, authenticate, and manage vehicles connected to the Spring
            Boot API.
          </p>
        </div>

        <nav className="app-shell__nav">
          {isAuthenticated ? (
            <>
              <span className="user-chip">
                {user?.name || user?.email || "Authenticated user"}
              </span>
              <NavLink
                to={ROUTES.cars}
                className={({ isActive }) =>
                  isActive ? "nav-link nav-link--active" : "nav-link"
                }
              >
                Cars
              </NavLink>
              <button
                type="button"
                className="button button--ghost"
                onClick={() => logout()}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to={ROUTES.login}
                className={({ isActive }) =>
                  isActive ? "nav-link nav-link--active" : "nav-link"
                }
              >
                Login
              </NavLink>
              <NavLink
                to={ROUTES.register}
                className={({ isActive }) =>
                  isActive ? "nav-link nav-link--active" : "nav-link"
                }
              >
                Register
              </NavLink>
            </>
          )}
        </nav>
      </header>

      <main className="app-shell__content">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
