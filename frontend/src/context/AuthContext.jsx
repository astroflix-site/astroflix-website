import { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "wouter";
import * as api from "@/lib/api";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [_, setLocation] = useLocation();

  useEffect(() => {
    // Check session on mount
    const checkSession = async () => {
      try {
        const isValid = await api.checkCookie();
        if (isValid) {
          const userData = await api.getUserDetails();
          setUser({ ...userData, isAdmin: userData.role === 'admin' });
        }
      } catch (error) {
        console.error("Session check failed", error);
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      await api.login(email, password);
      const userData = await api.getUserDetails();
      setUser({ ...userData, isAdmin: userData.role === 'admin' });
      setLocation("/");
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username, email, password) => {
    setIsLoading(true);
    try {
      // 1. Register the user
      await api.register(username, email, password);

      // 2. Auto-login the user immediately after registration
      await api.login(email, password);

      // 3. Fetch user details
      const userData = await api.getUserDetails();

      setUser({ ...userData, isAdmin: userData.role === 'admin' });
      setLocation("/");
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error("Logout failed", error);
    }
    setUser(null);
    setLocation("/login");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
