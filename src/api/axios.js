import axios from "axios";
import router from "@/router";
import { useErrorStore } from "@/stores/error";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status;
    const errorStore = useErrorStore();

    // 🔴 TOKEN EXPIRED / INVALID
    if (status === 401) {
      localStorage.removeItem("token");

      // Clear global errors
      errorStore.clear();

      // 🔥 HARD REDIRECT (always works)
      window.location.replace("/admin/login");

      return Promise.reject(error);
    }


    if (status === 403) {
      errorStore.setError("You do not have permission to perform this action");
      return Promise.reject(error);
    }


    // 🟠 OTHER ERRORS (non-auth)
    const message =
      error.response?.data?.message ||
      error.response?.data ||
      "Something went wrong";

    // Skip global error if requested
    if (!error.config?.skipGlobalError) {
      errorStore.setError(message);
    }

    return Promise.reject(error);
  }
);

export default api;
