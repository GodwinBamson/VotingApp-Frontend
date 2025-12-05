import { createContext, useEffect, useState } from "react";
import API, { getCSRFToken } from "../api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    try {
      const res = await API.get("/auth/profile");
      setUser(res.data);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const logout = async () => {
    try {
      const csrfToken = await getCSRFToken();
      await API.post(
        "/auth/logout",
        {},
        {
          headers: { "X-CSRF-Token": csrfToken },
        }
      );
    } catch (error) {
      console.error("Logout failed", error);
    }
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
