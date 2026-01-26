// src/stores/layout.js
import { defineStore } from "pinia";

export const useLayoutStore = defineStore("layout", {
  state: () => ({
    drawer: true, // ✅ open by default
  }),
});
