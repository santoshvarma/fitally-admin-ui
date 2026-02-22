import api from "./axios";

export const getMediaByExercise = (exerciseId) =>
  api.get(`/media/exercise/${exerciseId}`);

export const uploadImage = (exerciseId, formData) =>
  api.post(`/admin/media/image/exercise/${exerciseId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const replaceImageFile = (mediaId, formData) =>
  api.post(`/admin/media/image/${mediaId}/replace`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const uploadVideoFile = (exerciseId, formData) =>
  api.post(`/admin/media/video-file/exercise/${exerciseId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const replaceVideoFile = (mediaId, formData) =>
  api.post(`/admin/media/video-file/${mediaId}/replace`, formData, {
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
