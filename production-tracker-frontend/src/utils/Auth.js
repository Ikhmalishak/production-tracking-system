// utils/auth.js

// Token management
export const setToken = (token) => {
  localStorage.setItem("token", token);
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const removeToken = () => {
  localStorage.removeItem("token");
};

// User role should be stored separately if not in token
export const setUserRole = (role) => {
  localStorage.setItem("role", role);
};

export const getUserRole = () => {
  return localStorage.getItem("role");
};

export const isAuthenticated = () => {
  return !!getToken();
};

export const hasRequiredRole = (requiredRoles) => {
  const userRole = getUserRole();
  if (!userRole) return false;

  if (Array.isArray(requiredRoles)) {
    return requiredRoles.includes(userRole);
  }

  return requiredRoles === userRole;
};

export const logout = () => {
  removeToken();
  localStorage.removeItem("role");
  window.location.href = "/login";
};
