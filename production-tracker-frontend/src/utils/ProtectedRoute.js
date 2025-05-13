import { Navigate } from "react-router-dom";
import { isAuthenticated, getUserRole } from "./auth"; // Utility functions to check auth and role

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = isAuthenticated(); // Check if the user is authenticated
  const role = getUserRole(); // Get user role from the token

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/login" replace />;
  }

  return children; // Render protected content
};

export default ProtectedRoute;
