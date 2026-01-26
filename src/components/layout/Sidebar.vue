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
      <!-- App logo + title -->
      <v-list-item class="mb-2">
        <template #prepend>
          <v-img
            src="@/assets/logo_with_out_title.png"
            width="100"
            height="60"
            class="mr-2"
            contain
          />
        </template>

        <v-list-item-title class="text-h6 font-weight-bold">
          FitAlly
        </v-list-item-title>
      </v-list-item>

      <v-divider />

      <!-- Navigation -->
      <v-list-item
        to="/"
        title="Dashboard"
        exact
        prepend-icon="mdi-view-dashboard"
      />

      <v-list-item
        to="/exercises"
        title="Exercises"
        prepend-icon="mdi-run"
      />

      <v-list-item
        to="/workouts"
        title="Workouts"
        prepend-icon="mdi-dumbbell"
      />

      <v-list-item
        to="/programs"
        title="Programs"
        prepend-icon="mdi-calendar-check"
      />

      <v-list-item
        to="/cms"
        title="CMS"
        prepend-icon="mdi-file-document-edit"
      />
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

/**
 * Auto-close drawer on navigation (mobile only)
 */
watch(route, () => {
  if (mobile.value) layout.drawer = false;
});
</script>
