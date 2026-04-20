import { Navigate, Route, Routes } from "react-router-dom";
import useAuth from "../../modules/auth/presentation/useAuth";
import LoginPage from "../../modules/auth/presentation/LoginPage";
import RegisterPage from "../../modules/auth/presentation/RegisterPage";
import CarsPage from "../../modules/cars/presentation/CarsPage";
import { ROUTES } from "../config/constants";
import AppLayout from "../layout/AppLayout";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route
          path="/"
          element={
            <Navigate
              to={isAuthenticated ? ROUTES.cars : ROUTES.login}
              replace
            />
          }
        />

        <Route element={<PublicRoute />}>
          <Route path={ROUTES.login} element={<LoginPage />} />
          <Route path={ROUTES.register} element={<RegisterPage />} />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route path={ROUTES.cars} element={<CarsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default AppRoutes;
