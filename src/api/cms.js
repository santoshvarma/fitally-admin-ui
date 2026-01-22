import api from "./axios";

export const getContentByPage = (page) =>
  api.get("/content", { params: { page } });

export const createContent = (data) =>
  api.post("/content", data);

export const updateContent = (id, data) =>
  api.put(`/content/${id}`, data);

export const deleteContent = (id) =>
  api.delete(`/content/${id}`);

export const uploadContentImage = (contentId, formData) =>
  api.post(`/admin/media/image/content/${contentId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
