import api from "./axios";

export const getAllExercises = () =>
  api.get(`/exercises`);

export const getExercisesByWorkout = (workoutId) =>
  api.get(`/exercises/workout/${workoutId}`);

export const createExercise = (workoutId, data) =>
  api.post(`/exercises/workout/${workoutId}`, data);

export const updateExercise = (id, data) =>
  api.put(`/exercises/${id}`, data);

export const deleteExercise = (id) =>
  api.delete(`/exercises/${id}`);
