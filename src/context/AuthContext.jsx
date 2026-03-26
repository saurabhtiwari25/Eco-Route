import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("userName");
    if (role && name) {
      setUser({ role, name });
    }
    setLoading(false);
  }, []);

  const login = (role, name) => {
    localStorage.setItem("role", role);
    localStorage.setItem("userName", name);
    setUser({ role, name });
  };

  const logout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};