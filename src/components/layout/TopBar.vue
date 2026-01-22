<template>
  <v-app-bar app flat>
    <v-spacer />

    <v-btn icon @click="toggleTheme">
      <v-icon>{{ isDark ? "mdi-weather-sunny" : "mdi-weather-night" }}</v-icon>
    </v-btn>

    <v-menu>
      <template #activator="{ props }">
        <v-btn v-bind="props" icon>
          <v-icon>mdi-account</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item @click="logout">Logout</v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script setup>
import { useTheme } from "vuetify";
import { useAuthStore } from "@/stores/auth";

const theme = useTheme();
const auth = useAuthStore();

const isDark = theme.global.current.value.dark;

const toggleTheme = () => {
  theme.global.name.value = isDark ? "light" : "dark";
};

const logout = () => {
  auth.logout();
  window.location.href = "/login";
};
</script>
