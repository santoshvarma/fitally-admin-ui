import { defineStore } from "pinia";
import api from "@/api/axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("token"),
    refreshToken: localStorage.getItem("refreshToken"),
    user: null,
  }),

  actions: {
    async login(email, password) {
      const res = await api.post("/auth/login", { email, password });
      this.token = res.data.accessToken;
      this.refreshToken = res.data.refreshToken;
      localStorage.setItem("token", this.token);
      localStorage.setItem("refreshToken", this.refreshToken);
    },

    logout() {
      this.token = null;
      this.refreshToken = null;
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
    },
  },
});
