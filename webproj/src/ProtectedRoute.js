import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  // Ako je ruta login ili register -> ne traži token
  if (location.pathname === "/login" || location.pathname === "/register") {
    return children;
  }

  // Sve ostalo traži token
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute;
