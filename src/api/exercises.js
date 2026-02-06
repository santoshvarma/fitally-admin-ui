import api from "./axios";

export const getAllExercises = (params) =>
  api.get(`/exercises`, { params });

export const getExercisesByWorkout = (workoutId, params) =>
  api.get(`/exercises/workout/${workoutId}`, { params });

export const createExercise = (data) =>
  api.post(`/exercises`, data);

export const updateExercise = (id, data) =>
  api.put(`/exercises/${id}`, data);

export const deleteExercise = (id) =>
  api.delete(`/exercises/${id}`);
