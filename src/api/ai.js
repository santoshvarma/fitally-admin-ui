import api from "./axios";

export const generateExercises = (payload) =>
  api.post(`/admin/ai/generate-exercises`, payload);

export const generateExerciseImages = (exerciseId) =>
  api.post(`/admin/ai/generate-images/exercise/${exerciseId}`);

export const regenerateMediaImage = (mediaId, payload) =>
  api.post(`/admin/ai/generate-image/media/${mediaId}`, payload);
