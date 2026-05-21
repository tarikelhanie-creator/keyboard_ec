import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Initialize and check token validity
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          // Verify token against Laravel /me endpoint
          const response = await api.get('/me');
          setUser(response.data);
          setToken(storedToken);
        } catch (error) {
          console.error("Token verification failed:", error);
          // Clean up if token is invalid
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();

    // Listen to global 401 unauthorized notifications from Axios interceptor
    const handleUnauthorized = () => {
      setToken(null);
      setUser(null);
    };

    window.addEventListener('auth-unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth-unauthorized', handleUnauthorized);
    };
  }, []);

  // Login handler
  const login = async (email, password) => {
    try {
      const response = await api.post('/login', { email, password });
      const { token: receivedToken, user: receivedUser } = response.data;
      
      localStorage.setItem('token', receivedToken);
      setToken(receivedToken);
      setUser(receivedUser);
      return receivedUser;
    } catch (error) {
      console.error("Login attempt failed:", error);
      throw error.response?.data?.error || error.response?.data?.message || "Authentication failed";
    }
  };

  // Register handler
  const register = async (name, email, password) => {
    try {
      const response = await api.post('/register', { name, email, password });
      return response.data;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error.response?.data?.errors || error.response?.data?.message || "Registration failed";
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      // Notify backend to invalidate token
      await api.post('/logout');
    } catch (error) {
      console.warn("Backend logout failed or token already expired:", error);
    } finally {
      // Always clean up frontend state
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
