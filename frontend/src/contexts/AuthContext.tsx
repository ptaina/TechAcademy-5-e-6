import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";
import type { User } from "../types";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserDetails = async (userId: number, token: string) => {
    try {
      const response = await api.get(`/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const fullUser = response.data;

      localStorage.setItem("user", JSON.stringify(fullUser));
      setUser(fullUser);
    } catch (error) {
      console.error("Falha ao buscar detalhes do utilizador:", error);
    }
  };

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");
      if (token && userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error("Falha ao ler dados do localStorage", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.post("/login", { email, password });
    const { token, user: loginUser } = response.data;

    if (token && loginUser) {
      localStorage.setItem("token", token);

      localStorage.setItem("user", JSON.stringify(loginUser));
      setUser(loginUser);

      await fetchUserDetails(loginUser.id, token);
    } else {
      throw new Error("A API não retornou um token ou dados do utilizador.");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        A carregar...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
