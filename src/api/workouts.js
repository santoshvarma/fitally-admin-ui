import api from "./axios";

export const getWorkouts = (params) => api.get("/workouts", { params });

const withMaybeMultipart = (data) =>
  data instanceof FormData
    ? { headers: { "Content-Type": "multipart/form-data" } }
    : undefined;

export const createWorkout = (data) =>
  api.post("/workouts", data, withMaybeMultipart(data));

export const updateWorkout = (id, data) =>
  api.put(`/workouts/${id}`, data, withMaybeMultipart(data));

export const deleteWorkout = (id) => api.delete(`/workouts/${id}`);

export const searchWorkouts = (params) =>
  api.get("/workouts/search", { params });
