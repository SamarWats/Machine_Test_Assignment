import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../auth/useAuth';

const ProtectedRoute = ({ children }) => {
  const { auth } = useAuth();

  return auth.token ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
