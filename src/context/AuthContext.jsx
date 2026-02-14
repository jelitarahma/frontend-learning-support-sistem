import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/apiClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');

    // Check if values exist and are not literally the string "undefined"
    if (savedUser && savedUser !== 'undefined' && savedToken && savedToken !== 'undefined') {
      try {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
        localStorage.clear();
      }
    } else {
      // If we have corrupted "undefined" strings, clear them to avoid 401s
      if (savedUser === 'undefined' || savedToken === 'undefined') {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authApi.login({ email, password });
      // The API returns data wrapped in a 'data' property
      const { token, user: userData } = response.data.data;

      if (!token || !userData) {
        throw new Error('Invalid response format from server');
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      setToken(token);
      setUser(userData);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Login failed'
      };
    }
  };

  const register = async (data) => {
    try {
      await authApi.register(data);
      return { success: true };
    } catch (error) {
      console.error('Register error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const isAdmin = user?.role === 'ADMIN';
  const isTeacher = user?.role === 'TEACHER';
  const isStudent = user?.role === 'STUDENT';
  const canAccessAdmin = isAdmin || isTeacher;

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      register,
      logout,
      loading,
      isAdmin,
      isTeacher,
      isStudent,
      canAccessAdmin
    }}>
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
