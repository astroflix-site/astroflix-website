import { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "wouter";
import * as api from "@/lib/api";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [_, setLocation] = useLocation();

  useEffect(() => {
    // Check session on mount - go straight to getUserDetails
    // which will fail with 401 if no valid cookie exists
    const checkSession = async () => {
      try {
        const userData = await api.getUserDetails();
        setUser({ ...userData, isAdmin: userData.role === 'admin' });
      } catch (error) {
        // No valid session - user stays null
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = async (email, password) => {
    // Don't set isLoading here - the login form has its own loading state.
    // Setting isLoading causes pages (AdminPanel, Dashboard) to flash blank.
    try {
      await api.login(email, password);
      const userData = await api.getUserDetails();
      setUser({ ...userData, isAdmin: userData.role === 'admin' });
      setLocation("/");
    } catch (error) {
      throw error;
    }
  };

  const register = async (username, email, password) => {
    try {
      await api.register(username, email, password);
      await api.login(email, password);
      const userData = await api.getUserDetails();
      setUser({ ...userData, isAdmin: userData.role === 'admin' });
      setLocation("/");
    } catch (error) {
      throw error;
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

  const updateProfile = async (data) => {
    try {
      const response = await api.updateUser(data);
      setUser(prev => ({ ...prev, ...response.user }));
      return response;
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateProfile }}>
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
