import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const access = useSelector(s => s.auth.access);
  if (!access) return <Navigate to="/auth" replace />;
  return children;
}
