import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser(payload);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      setUser(null);
      delete api.defaults.headers.common["Authorization"];
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    const t = res.data.access_token;
    localStorage.setItem("token", t);
    setToken(t);
  };

  const register = async (email, password, role) => {
    await api.post("/auth/register", { email, password, role });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}