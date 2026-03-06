import api from "./axios";

export const getAppPages = () => api.get("/app-pages/all");

export const createAppPage = (data) => api.post("/app-pages", data);

export const updateAppPage = (id, data) => api.put(`/app-pages/${id}`, data);

export const deleteAppPage = (id) => api.delete(`/app-pages/${id}`);

