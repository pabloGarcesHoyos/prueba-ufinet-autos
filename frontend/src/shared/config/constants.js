export const APP_NAME = "prueba-ufinet-autos";
export const APP_STAGE = "frontend-integration";
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

export const AUTH_TOKEN_STORAGE_KEY = "prueba-ufinet-autos.token";
export const AUTH_USER_STORAGE_KEY = "prueba-ufinet-autos.user";
export const CAR_PHOTO_STORAGE_KEY = "prueba-ufinet-autos.car-photos";

export const ROUTES = {
  login: "/login",
  register: "/register",
  cars: "/cars",
};

export const EMPTY_CAR_FORM = {
  brand: "",
  model: "",
  year: "",
  plateNumber: "",
  color: "",
  photoName: "",
};
