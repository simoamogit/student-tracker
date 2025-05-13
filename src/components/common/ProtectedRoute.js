import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthService from '../../services/auth.service';

const ProtectedRoute = ({ children, isAuthenticated }) => {
  // Se l'autenticazione è già verificata dal componente genitore
  if (isAuthenticated === false) {
    return <Navigate to="/login" />;
  }
  
  // Altrimenti verifica direttamente
  const currentUser = AuthService.getCurrentUser();
  
  if (!currentUser) {
    // Utente non autenticato, reindirizza al login
    return <Navigate to="/login" />;
  }
  
  // Utente autenticato, mostra il contenuto protetto
  return children;
};

export default ProtectedRoute;
