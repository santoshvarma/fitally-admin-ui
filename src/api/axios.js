import axios from "axios";
import router from "@/router";
import { useErrorStore } from "@/stores/error";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

let isRefreshing = false;
let refreshQueue = [];

const resolveQueue = (error, token = null) => {
  refreshQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  refreshQueue = [];
};

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
      const originalRequest = error.config;
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken || originalRequest?._retry) {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        errorStore.clear();
        window.location.replace("/admin/login");
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise((resolve, reject) => {
        refreshClient
          .post("/auth/refresh", { refreshToken })
          .then((res) => {
            const newToken = res.data.accessToken;
            localStorage.setItem("token", newToken);
            api.defaults.headers.common.Authorization = `Bearer ${newToken}`;
            resolveQueue(null, newToken);
            resolve(api(originalRequest));
          })
          .catch((refreshError) => {
            resolveQueue(refreshError, null);
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            errorStore.clear();
            window.location.replace("/admin/login");
            reject(refreshError);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
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
