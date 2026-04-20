import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../modules/auth/presentation/useAuth";
import { ROUTES } from "../config/constants";

function PublicRoute() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={ROUTES.cars} replace />;
  }

  return <Outlet />;
}

export default PublicRoute;
