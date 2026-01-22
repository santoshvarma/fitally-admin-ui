import { defineStore } from "pinia";
import api from "@/api/axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("token"),
    user: null,
  }),

  actions: {
    async login(username, password) {
      const res = await api.post("/auth/login", { username, password });
      this.token = res.data.accessToken;
      localStorage.setItem("token", this.token);
    },

    logout() {
      this.token = null;
      localStorage.removeItem("token");
    },
  },
});
