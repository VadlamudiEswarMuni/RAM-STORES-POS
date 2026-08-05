import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../lib/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('ramStoresUser');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('ramStoresToken') || '');

  useEffect(() => {
    if (token) {
      localStorage.setItem('ramStoresToken', token);
    } else {
      localStorage.removeItem('ramStoresToken');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('ramStoresUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('ramStoresUser');
    }
  }, [user]);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { token: authToken, user: userInfo } = response.data;
    setToken(authToken);
    setUser(userInfo);
    return response.data;
  };

  const logout = () => {
    setToken('');
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, token, login, logout, isAuthenticated: Boolean(token && user) }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
