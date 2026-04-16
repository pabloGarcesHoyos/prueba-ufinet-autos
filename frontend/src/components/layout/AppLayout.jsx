import { NavLink, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { APP_NAME, ROUTES } from "../../utils/constants";

function AppLayout() {
  const { isAuthenticated, logout, user } = useAuth();
  const displayName = user?.name?.trim() || "Usuario autenticado";
  const displayEmail = user?.email?.trim();

  return (
    <div className="app-shell">
      <header className="app-shell__header">
        <div className="header-card header-card--brand">
          <div className="brand-block">
            <p className="app-shell__eyebrow">{APP_NAME}</p>
            <h1>Portal de Gestión de Autos</h1>
            <p className="brand-block__text">
              Registra tu cuenta, inicia sesión y administra tus vehículos conectados
              a la API desarrollada en Spring Boot.
            </p>
          </div>
        </div>

        <div className="header-card header-card--nav">
          <nav className="app-shell__nav">
            {isAuthenticated ? (
              <>
                <div className="user-chip">
                  <span className="user-chip__label">Sesión activa</span>
                  <strong className="user-chip__value">{displayName}</strong>
                  {displayEmail && displayEmail !== displayName ? (
                    <span className="user-chip__meta">{displayEmail}</span>
                  ) : null}
                </div>
                <NavLink
                  to={ROUTES.cars}
                  className={({ isActive }) =>
                    isActive ? "nav-link nav-link--active" : "nav-link"
                  }
                >
                  Mis autos
                </NavLink>
                <button
                  type="button"
                  className="button button--ghost"
                  onClick={() => logout()}
                >
                  Salir
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
                  Iniciar sesión
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
        </div>
      </header>

      <main className="app-shell__content">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
