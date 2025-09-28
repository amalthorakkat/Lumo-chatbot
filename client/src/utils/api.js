import axios from "axios";

// Base URL from environment, append /api directly here
const api = axios.create({
  baseURL: `${import.meta.env.VITE_REACT_APP_BACKEND_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptor to include JWT token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log(
      "Axios Interceptor - Token:",
      token ? "Token found" : "No token in localStorage"
    );
    console.log("Axios Interceptor - Request Headers:", config.headers);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Axios Interceptor Error:", error);
    return Promise.reject(error);
  }
);

export default api;
