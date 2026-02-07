import api from "./axios";

export const getContentByPage = (page, params = {}) =>
  api.get("/content", { params: { page, ...params } });

export const createContent = (data) =>
  api.post("/content", data);

export const updateContent = (id, data) =>
  api.put(`/content/${id}`, data);

export const deleteContent = (id) =>
  api.delete(`/content/${id}`);

export const getContentMedia = (contentId, params = {}) =>
  api.get(`/content-media/content/${contentId}`, { params });

export const createContentMedia = (contentId, data) =>
  api.post(`/content-media/content/${contentId}`, data);

export const deleteContentMedia = (id) =>
  api.delete(`/content-media/${id}`);

export const uploadContentImage = (contentId, formData) =>
  api.post(`/content-media/image/content/${contentId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
