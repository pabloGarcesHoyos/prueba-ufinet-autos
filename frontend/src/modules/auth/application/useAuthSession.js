import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setUnauthorizedHandler } from "../../../shared/http/apiClient";
import { ROUTES } from "../../../shared/config/constants";
import authApi from "../infrastructure/authApi";
import {
  clearStoredSession,
  getInitialAuthState,
  storeSession,
} from "../domain/sessionStorage";

function useAuthSession() {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState(() => getInitialAuthState());

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
    const response = await authApi.login(credentials);
    const session = storeSession(response);
    setAuthState(session);
    return response;
  }

  async function register(data) {
    const response = await authApi.register(data);
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

  return {
    token: authState.token,
    user: authState.user,
    isAuthenticated: Boolean(authState.token),
    login,
    register,
    logout,
  };
}

export default useAuthSession;
