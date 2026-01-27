import axios from "axios";
import { useErrorStore } from "@/stores/error";
import router from "@/router";

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
  response => response,
  error => {
    const errorStore = useErrorStore();

    const status = error.response?.status;
    const message =
      error.response?.data?.message ||
      error.response?.data ||
      "Something went wrong";

    // 🔒 Auth errors
    if (status === 401) {
      localStorage.removeItem("token");
      router.push("/login");
    }

    // ❌ Global error
    errorStore.setError(message);

    return Promise.reject(error);
  }
);

export default api;
