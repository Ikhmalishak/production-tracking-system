// utils/api.js
import axios from "axios";
import { getToken, logout } from "./auth";

// Create an axios instance with base URL
const api = axios.create({
  baseURL: "http://localhost:8000/api",
});

// Request interceptor to add token to all requests
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token is expired or invalid, logout the user
      logout();
    }
    return Promise.reject(error);
  }
);

export default api;