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
            @click="selectWorkout(w)"
          >
            {{ w.title }}
          </v-list-item>
        </v-list>
      </v-col>

      <v-col cols="8">
        <h3>Program Routine</h3>

        <v-text-field
          label="Day Number"
          type="number"
          v-model="dayNumber"
        />

        <v-btn color="primary" @click="addToProgram">
          Add Workout to Day
        </v-btn>

        <v-divider class="my-4" />

        <v-list>
          <v-list-item
            v-for="pw in routine"
            :key="pw.id"
          >
            Day {{ pw.dayNumber }} - {{ pw.workout.title }}
            <v-btn
              size="small"
              color="red"
              @click="remove(pw.id)"
            >
              Remove
            </v-btn>
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

const loadData = async () => {
  const w = await getWorkouts();
  workouts.value = w.data;

  const r = await getProgramWorkouts(programId);
  routine.value = r.data;
};

const selectWorkout = (w) => {
  selectedWorkout.value = w;
};

const addToProgram = async () => {
  if (!selectedWorkout.value) return;

  await addWorkoutToProgram({
    programId,
    workoutId: selectedWorkout.value.id,
    dayNumber: dayNumber.value,
  });

  loadData();
};

const remove = async (id) => {
  await removeProgramWorkout(id);
  loadData();
};

onMounted(loadData);
</script>
