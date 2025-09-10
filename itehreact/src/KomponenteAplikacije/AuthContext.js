import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();
//ovde je glavno mesto gde se pamti da li je korisnik ulogovan ili ne 
//tipa kad proveravam to u drugim komponentama ovde ce mi saltati
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
//children mi je cela aplikacija jer je obmotano sa tim sve
  useEffect(() => {
    // Provera da li postoji token u sessionStorage
    //ako postoji stavlja isAuthenticated na true
    const token = sessionStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);
//login: čuva token i setuje korisnika kao ulogovanog.
  const login = (token) => {
    sessionStorage.setItem('token', token);
    setIsAuthenticated(true);
  };
//logout: briše token i setuje korisnika kao izlogovanog.
  const logout = () => {
    sessionStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
