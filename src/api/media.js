import api from "./axios";

export const getMediaByExercise = (exerciseId) =>
  api.get(`/media/exercise/${exerciseId}`);

export const uploadImage = (exerciseId, formData) =>
  api.post(`/admin/media/image/exercise/${exerciseId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const addYoutubeVideo = (exerciseId, data) =>
  api.post(`/admin/media/video/exercise/${exerciseId}`, null, {
    params: data,
  });

export const deleteMedia = (id) =>
  api.delete(`/admin/media/${id}`);

export const updateMedia = (id, data) =>
  api.put(`/media/${id}`, data);
