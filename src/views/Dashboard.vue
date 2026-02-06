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
          :loading="loading.workouts"
          @refresh="loadWorkouts"
        />
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <StatCard
          title="Programs"
          :value="stats.programs"
          icon="mdi-calendar-check"
          color="success"
          :loading="loading.programs"
          @refresh="loadPrograms"
        />
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <StatCard
          title="Exercises"
          :value="stats.exercises"
          icon="mdi-run-fast"
          color="info"
          :loading="loading.exercises"
          @refresh="loadExercises"
        />
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <StatCard
          title="CMS Content"
          :value="stats.cms"
          icon="mdi-file-document-edit"
          color="warning"
          :loading="loading.cms"
          @refresh="loadCms"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import StatCard from "@/components/dashboard/StatCard.vue";
import { getWorkouts } from "@/api/workouts";
import { getPrograms } from "@/api/programs";
import { getAllExercises } from "@/api/exercises";
import { getContentByPage } from "@/api/cms";

const cmsPages = ["HOME", "ABOUT", "TERMS", "PRIVACY", "DASHBOARD"];

const stats = ref({
  workouts: 0,
  programs: 0,
  exercises: 0,
  cms: 0,
});

const getResponseCount = (data) => {
  if (typeof data?.totalElements === "number") {
    return data.totalElements;
  }
  if (Array.isArray(data)) {
    return data.length;
  }
  if (Array.isArray(data?.content)) {
    return data.content.length;
  }
  return 0;
};

const loading = ref({
  workouts: false,
  programs: false,
  exercises: false,
  cms: false,
});

const loadWorkouts = async () => {
  loading.value.workouts = true;
  try {
    const res = await getWorkouts();
    stats.value.workouts = getResponseCount(res.data);
  } finally {
    loading.value.workouts = false;
  }
};

const loadPrograms = async () => {
  loading.value.programs = true;
  try {
    const res = await getPrograms();
    stats.value.programs = getResponseCount(res.data);
  } finally {
    loading.value.programs = false;
  }
};

const loadExercises = async () => {
  loading.value.exercises = true;
  try {
    const res = await getAllExercises();
    stats.value.exercises = getResponseCount(res.data);
  } finally {
    loading.value.exercises = false;
  }
};

const loadCms = async () => {
  loading.value.cms = true;
  try {
    const results = await Promise.allSettled(
      cmsPages.map((page) => getContentByPage(page))
    );
    stats.value.cms = results.reduce((sum, result) => {
      if (result.status !== "fulfilled") {
        return sum;
      }
      return sum + getResponseCount(result.value?.data);
    }, 0);
  } finally {
    loading.value.cms = false;
  }
};

const loadStats = async () => {
  await Promise.all([loadWorkouts(), loadPrograms(), loadExercises(), loadCms()]);
};

onMounted(loadStats);
</script>
