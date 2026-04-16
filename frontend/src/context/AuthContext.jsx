import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setUnauthorizedHandler } from "../api/apiClient";
import authService from "../services/authService";
import {
  AUTH_TOKEN_STORAGE_KEY,
  AUTH_USER_STORAGE_KEY,
  ROUTES,
} from "../utils/constants";

const AuthContext = createContext(null);

function getStoredUser() {
  const rawUser = localStorage.getItem(AUTH_USER_STORAGE_KEY);

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser);
  } catch {
    localStorage.removeItem(AUTH_USER_STORAGE_KEY);
    return null;
  }
}

function clearStoredSession() {
  localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  localStorage.removeItem(AUTH_USER_STORAGE_KEY);

  return {
    token: "",
    user: null,
  };
}

function buildUser(authResponse) {
  return {
    id: authResponse.userId,
    name: authResponse.name,
    email: authResponse.email,
  };
}

function storeSession(authResponse) {
  const token = authResponse.token || "";
  const user = buildUser(authResponse);

  localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
  localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));

  return {
    token,
    user,
  };
}

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState(() => ({
    token: localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) || "",
    user: getStoredUser(),
  }));

  const isAuthenticated = Boolean(authState.token);

  useEffect(() => {
    function handleUnauthorized() {
      setAuthState(clearStoredSession());
      navigate(ROUTES.login, {
        replace: true,
        state: { sessionExpired: true },
      });
    }

    setUnauthorizedHandler(handleUnauthorized);

    return () => setUnauthorizedHandler(null);
  }, [navigate]);

  async function login(credentials) {
    const response = await authService.login(credentials);
    const session = storeSession(response);
    setAuthState(session);
    return response;
  }

  async function register(data) {
    const response = await authService.register(data);
    const session = storeSession(response);
    setAuthState(session);
    return response;
  }

  function logout(options = {}) {
    setAuthState(clearStoredSession());

    if (options.redirect === false) {
      return;
    }

    navigate(ROUTES.login, {
      replace: true,
      state: options.sessionExpired ? { sessionExpired: true } : null,
    });
  }

  return (
    <AuthContext.Provider
      value={{
        token: authState.token,
        user: authState.user,
        isAuthenticated,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
