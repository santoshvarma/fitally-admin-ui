<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="3">
        <StatCard title="Workouts" :value="stats.workouts" icon="mdi-dumbbell" />
      </v-col>
      <v-col cols="12" md="3">
        <StatCard title="Programs" :value="stats.programs" icon="mdi-calendar" />
      </v-col>
      <v-col cols="12" md="3">
        <StatCard title="Exercises" :value="stats.exercises" icon="mdi-run" />
      </v-col>
      <v-col cols="12" md="3">
        <StatCard title="CMS Content" :value="stats.cms" icon="mdi-image" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import StatCard from "@/components/dashboard/StatCard.vue";

const stats = ref({
  workouts: 12,
  programs: 5,
  exercises: 48,
  cms: 9,
});
</script>
