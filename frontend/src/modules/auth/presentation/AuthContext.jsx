import { createContext } from "react";
import useAuthSession from "../application/useAuthSession";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const auth = useAuthSession();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export default AuthContext;
