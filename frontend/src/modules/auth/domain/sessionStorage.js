import {
  AUTH_TOKEN_STORAGE_KEY,
  AUTH_USER_STORAGE_KEY,
} from "../../../shared/config/constants";

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

function buildUser(authResponse) {
  return {
    id: authResponse.userId,
    name: authResponse.name,
    email: authResponse.email,
  };
}

export function getInitialAuthState() {
  return {
    token: localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) || "",
    user: getStoredUser(),
  };
}

export function clearStoredSession() {
  localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  localStorage.removeItem(AUTH_USER_STORAGE_KEY);

  return {
    token: "",
    user: null,
  };
}

export function storeSession(authResponse) {
  const token = authResponse.token || "";
  const user = buildUser(authResponse);

  localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
  localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));

  return {
    token,
    user,
  };
}
