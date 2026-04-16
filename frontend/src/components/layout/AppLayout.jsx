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
          <h1>Portal de Gestion de Autos</h1>
          <p className="brand-block__text">
            Registra tu cuenta, inicia sesion y administra tus vehiculos conectados
            a la API desarrollada en Spring Boot.
          </p>
        </div>

        <nav className="app-shell__nav">
          {isAuthenticated ? (
            <>
              <span className="user-chip">
                {user?.name || user?.email || "Usuario autenticado"}
              </span>
              <NavLink
                to={ROUTES.cars}
                className={({ isActive }) =>
                  isActive ? "nav-link nav-link--active" : "nav-link"
                }
              >
                Autos
              </NavLink>
              <button
                type="button"
                className="button button--ghost"
                onClick={() => logout()}
              >
                Cerrar sesion
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
                Iniciar sesion
              </NavLink>
              <NavLink
                to={ROUTES.register}
                className={({ isActive }) =>
                  isActive ? "nav-link nav-link--active" : "nav-link"
                }
              >
                Registrarse
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
