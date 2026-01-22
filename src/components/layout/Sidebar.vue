<template>
  <v-navigation-drawer
    app
    :permanent="!isMobile"
    :temporary="isMobile"
    breakpoint="md"
  >
    <v-list>
      <v-list-item title="FitAlly Admin" />

      <v-divider />

      <v-list-item to="/" title="Dashboard" />
      <v-list-item to="/workouts" title="Workouts" />
      <v-list-item to="/programs" title="Programs" />
      <v-list-item to="/cms" title="CMS" />
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { useDisplay } from "vuetify";

const { mobile: isMobile } = useDisplay();
</script>
