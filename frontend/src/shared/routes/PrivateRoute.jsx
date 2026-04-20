import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../modules/auth/presentation/useAuth";
import { ROUTES } from "../config/constants";

function PrivateRoute() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} replace />;
  }

  return <Outlet />;
}

export default PrivateRoute;
