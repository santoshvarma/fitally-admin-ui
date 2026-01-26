<template>
  <v-navigation-drawer
    v-model="layout.drawer"
    :temporary="mobile"
    :persistent="!mobile"
    :rail="!mobile && !layout.drawer"
    expand-on-hover
    app
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
import { watch } from "vue";
import { useRoute } from "vue-router";
import { useDisplay } from "vuetify";
import { useLayoutStore } from "@/stores/layout";

const { mobile } = useDisplay();
const route = useRoute();
const layout = useLayoutStore();

watch(route, () => {
  if (mobile.value) layout.drawer = false;
});
</script>
