// src/auth/AuthContext.js
import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: localStorage.getItem('token') || null,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !auth.token) {
      setAuth((prev) => ({ ...prev, token }));
    }
  }, []);

  const login = (data) => {
    localStorage.setItem('token', data.token);
    setAuth({ user: data.user, token: data.token });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuth({ user: null, token: null });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
