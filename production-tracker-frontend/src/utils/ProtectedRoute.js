import { useNavigate } from "react-router-dom";
import { isAuthenticated, getUserRole } from "./Auth"; // Utility functions to check auth and role

const ProtectedRoute = ({ children, requiredRole }) => {
  const navigate = useNavigate();

  const token = isAuthenticated(); // Check if the user is authenticated
  const role = getUserRole(); // Get user role from the token

  if (!token) {
    // If the user isn't authenticated, redirect to the login page
    navigate("/login");
    return null;
  }

  if (requiredRole && role !== requiredRole) {
    // If the user doesn't have the required role, redirect to the login page or any other page
    navigate("/login"); // You can change this to another page (e.g., unauthorized page)
    return null;
  }

  // If authenticated and authorized, render the children (protected route)
  return children;
};

export default ProtectedRoute;
