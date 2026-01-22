import api from "./axios";

export const getPrograms = () => api.get("/programs");

export const createProgram = (data) => api.post("/programs", data);

export const updateProgram = (id, data) => api.put(`/programs/${id}`, data);

export const deleteProgram = (id) => api.delete(`/programs/${id}`);

export const getProgramWorkouts = (programId) =>
  api.get(`/program-workouts/program/${programId}`);

export const addWorkoutToProgram = (data) =>
  api.post("/program-workouts", null, { params: data });

export const removeProgramWorkout = (id) =>
  api.delete(`/program-workouts/${id}`);
