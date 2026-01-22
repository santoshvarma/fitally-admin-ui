<template>
  <v-container>
    <v-row justify="space-between">
      <h2>Exercises – {{ workout?.title }}</h2>
      <v-btn color="primary" @click="openDialog">Add Exercise</v-btn>
    </v-row>

    <v-data-table
      :headers="headers"
      :items="exercises"
      item-key="id"
      class="mt-4"
    >
      <template #item.actions="{ item }">
        <v-btn size="small" @click="editExercise(item)">Edit</v-btn>
        <v-btn size="small" color="red" @click="removeExercise(item.id)">
          Delete
        </v-btn>
      </template>
    </v-data-table>

    <ExerciseForm
      v-if="showDialog"
      :exercise="selectedExercise"
      :workoutId="workoutId"
      @close="closeDialog"
      @saved="loadExercises"
    />
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getExercisesByWorkout, deleteExercise } from "@/api/exercises";
import { getWorkouts } from "@/api/workouts";
import ExerciseForm from "@/components/ExerciseForm.vue";

const route = useRoute();
const workoutId = route.params.workoutId;

const exercises = ref([]);
const workout = ref(null);
const showDialog = ref(false);
const selectedExercise = ref(null);

const headers = [
  { text: "Title", value: "title" },
  { text: "Equipment", value: "equipmentType" },
  { text: "Actions", value: "actions" },
];

const loadExercises = async () => {
  const res = await getExercisesByWorkout(workoutId);
  exercises.value = res.data;
};

const loadWorkout = async () => {
  const res = await getWorkouts();
  workout.value = res.data.find((w) => w.id === workoutId);
};

const openDialog = () => {
  selectedExercise.value = null;
  showDialog.value = true;
};

const editExercise = (exercise) => {
  selectedExercise.value = exercise;
  showDialog.value = true;
};

const closeDialog = () => {
  showDialog.value = false;
};

const removeExercise = async (id) => {
  await deleteExercise(id);
  loadExercises();
};

onMounted(() => {
  loadWorkout();
  loadExercises();
});
</script>
