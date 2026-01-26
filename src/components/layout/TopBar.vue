<template>
  <v-app-bar app flat>
    <!-- Sidebar toggle (works on desktop + mobile) -->
    <v-btn icon @click="layout.drawer = !layout.drawer">
      <v-icon>
        {{ layout.drawer ? "mdi-menu-open" : "mdi-menu" }}
      </v-icon>
    </v-btn>

    <v-spacer />

    <!-- Theme toggle -->
    <v-btn icon @click="toggleTheme">
      <v-icon>
        {{ isDark ? "mdi-weather-sunny" : "mdi-weather-night" }}
      </v-icon>
    </v-btn>

    <!-- Profile menu -->
    <v-menu>
      <template #activator="{ props }">
        <v-btn v-bind="props" icon>
          <v-icon>mdi-account</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item @click="logout">
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script setup>
import { computed } from "vue";
import { useTheme } from "vuetify";
import { useAuthStore } from "@/stores/auth";
import { useLayoutStore } from "@/stores/layout";

const theme = useTheme();
const auth = useAuthStore();
const layout = useLayoutStore();

/**
 * Reactive dark mode state
 */
const isDark = computed(() => theme.global.current.value.dark);

/**
 * Toggle between light and dark theme
 */
const toggleTheme = () => {
  theme.global.name.value = isDark.value ? "light" : "dark";
};

/**
 * Logout handler
 */
const logout = () => {
  auth.logout();
  window.location.href = "/admin/login";
};
</script>
