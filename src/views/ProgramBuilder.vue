<template>
  <v-container>
    <h2>Program Builder</h2>

    <v-row>
      <v-col cols="4">
        <h3>Available Workouts</h3>
        <v-list>
          <v-list-item
            v-for="w in workouts"
            :key="w.id"
            :active="selectedWorkout?.id === w.id"
            color="primary"
            @click="selectWorkout(w)"
          >
            {{ w.title }}
          </v-list-item>
        </v-list>
      </v-col>

      <v-col cols="8">
        <h3>Program Routine</h3>

        <v-combobox
          label="Day Number"
          :items="dayOptions"
          v-model="dayNumber"
        />

        <v-btn
          color="primary"
          :loading="saving"
          :disabled="!selectedWorkout || !Number(dayNumber)"
          @click="addToProgram"
        >
          Add Workout to Day
        </v-btn>

        <v-divider class="my-4" />

        <v-list>
          <v-list-item
            v-for="pw in routine"
            :key="pw.id"
          >
            <v-list-item-title>
              Day {{ pw.dayNumber }} - {{ pw.workout?.title || "Workout" }}
            </v-list-item-title>
            <template #append>
              <v-btn
                icon
                variant="text"
                color="red"
                @click="remove(pw.id)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getWorkouts } from "@/api/workouts";
import {
  getProgramWorkouts,
  addWorkoutToProgram,
  removeProgramWorkout,
} from "@/api/programs";

const route = useRoute();
const programId = route.params.programId;

const workouts = ref([]);
const routine = ref([]);
const selectedWorkout = ref(null);
const dayNumber = ref(1);
const dayOptions = Array.from({ length: 90 }, (_, i) => i + 1);
const saving = ref(false);

const loadData = async () => {
  const w = await getWorkouts();
  workouts.value = Array.isArray(w.data)
    ? w.data
    : Array.isArray(w.data?.content)
      ? w.data.content
      : [];

  const r = await getProgramWorkouts(programId);
  routine.value = Array.isArray(r.data)
    ? r.data
    : Array.isArray(r.data?.content)
      ? r.data.content
      : [];
};

const selectWorkout = (w) => {
  selectedWorkout.value = w;
};

const addToProgram = async () => {
  if (!selectedWorkout.value || !dayNumber.value) return;

  saving.value = true;
  try {
    await addWorkoutToProgram({
      programId,
      workoutId: selectedWorkout.value.id,
      dayNumber: Number(dayNumber.value),
    });

    await loadData();
  } finally {
    saving.value = false;
  }
};

const remove = async (id) => {
  await removeProgramWorkout(id);
  loadData();
};

onMounted(loadData);
</script>
