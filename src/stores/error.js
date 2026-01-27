import { defineStore } from "pinia";

export const useErrorStore = defineStore("error", {
  state: () => ({
    message: null,
  }),
  actions: {
    setError(msg) {
      this.message = msg;
    },
    clear() {
      this.message = null;
    },
  },
});
