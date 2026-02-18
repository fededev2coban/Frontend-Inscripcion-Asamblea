import React, { createContext, useState, useContext, useEffect, useCallback } from 'react'; // 1. Agregado useCallback
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 2. Envolvemos logout en useCallback para que sea una referencia estable
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  // 3. Envolvemos checkAuth en useCallback e incluimos logout como dependencia
  const checkAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await authService.verifyToken();
        if (response.success) {
          const userData = JSON.parse(localStorage.getItem('user'));
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          logout();
        }
      }
    } catch (error) {
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  // 4. Ahora el useEffect puede tener [checkAuth] sin causar bucles infinitos
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (username, password) => {
    try {
      const response = await authService.login(username, password);
      if (response.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setUser(response.data.user);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, error: response.error };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Error al iniciar sesión' 
      };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export default AuthContext;
