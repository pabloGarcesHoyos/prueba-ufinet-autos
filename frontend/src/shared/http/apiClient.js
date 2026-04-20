import axios from "axios";
import {
  API_BASE_URL,
  AUTH_TOKEN_STORAGE_KEY,
} from "../config/constants";

let unauthorizedHandler = null;

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler;
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    const url = error.config?.url || "";
    const isAuthRequest =
      url.includes("/auth/login") || url.includes("/auth/register");

    if (status === 401 && token && !isAuthRequest && unauthorizedHandler) {
      unauthorizedHandler();
    }

    return Promise.reject(error);
  }
);

export default apiClient;
