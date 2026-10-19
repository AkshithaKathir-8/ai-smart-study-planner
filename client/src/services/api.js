import axios from "axios";

const api = axios.create({
  baseURL: "https://ai-smart-study-planner-dhc6.onrender.com/api",
});

// Add JWT token automatically
api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

export default api;