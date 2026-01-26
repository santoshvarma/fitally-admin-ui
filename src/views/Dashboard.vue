<template>
  <v-container fluid>
    <!-- Page Header -->
    <v-row class="mb-6">
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between">
          <div>
            <h1 class="text-h5 font-weight-bold">Dashboard</h1>
            <div class="text-body-2 text-medium-emphasis">
              Overview of your fitness platform
            </div>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- Stats Cards -->
    <v-row dense>
      <v-col cols="12" sm="6" md="3">
        <StatCard
          title="Workouts"
          :value="stats.workouts"
          icon="mdi-dumbbell"
          color="primary"
        />
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <StatCard
          title="Programs"
          :value="stats.programs"
          icon="mdi-calendar-check"
          color="success"
        />
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <StatCard
          title="Exercises"
          :value="stats.exercises"
          icon="mdi-run-fast"
          color="info"
        />
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <StatCard
          title="CMS Content"
          :value="stats.cms"
          icon="mdi-file-document-edit"
          color="warning"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import StatCard from "@/components/dashboard/StatCard.vue";

/**
 * Dashboard statistics
 * (Later this can come from API)
 */
const stats = ref({
  workouts: 12,
  programs: 5,
  exercises: 48,
  cms: 9,
});
</script>
