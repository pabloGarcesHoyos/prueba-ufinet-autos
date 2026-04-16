import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { ROUTES } from "../utils/constants";

function PublicRoute() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={ROUTES.cars} replace />;
  }

  return <Outlet />;
}

export default PublicRoute;
