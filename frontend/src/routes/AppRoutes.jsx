import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import useAuth from "../hooks/useAuth";
import CarsPage from "../pages/Cars/CarsPage";
import LoginPage from "../pages/Login/LoginPage";
import RegisterPage from "../pages/Register/RegisterPage";
import { ROUTES } from "../utils/constants";
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
