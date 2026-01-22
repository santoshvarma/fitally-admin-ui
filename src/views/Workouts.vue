<template>
  <v-container>
    <v-row justify="space-between">
      <h2>Workouts</h2>
      <v-btn color="primary" @click="openDialog">Add Workout</v-btn>
    </v-row>

    <v-data-table
      :headers="headers"
      :items="workouts"
      item-key="id"
      class="mt-4"
    >
      <template #item.actions="{ item }">
        <v-btn size="small" @click="editWorkout(item)">Edit</v-btn>
        <v-btn size="small" color="red" @click="removeWorkout(item.id)">
          Delete
        </v-btn>
      </template>
    </v-data-table>

    <WorkoutForm
      v-if="showDialog"
      :workout="selectedWorkout"
      @close="closeDialog"
      @saved="loadWorkouts"
    />
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getWorkouts, deleteWorkout } from "@/api/workouts";
import WorkoutForm from "@/components/WorkoutForm.vue";

const workouts = ref([]);
const showDialog = ref(false);
const selectedWorkout = ref(null);

const headers = [
  { text: "Title", value: "title" },
  { text: "Category", value: "category" },
  { text: "Difficulty", value: "difficulty" },
  { text: "Equipment", value: "equipmentType" },
  { text: "Actions", value: "actions" },
];

const loadWorkouts = async () => {
  const res = await getWorkouts();
  workouts.value = res.data;
};

const openDialog = () => {
  selectedWorkout.value = null;
  showDialog.value = true;
};

const editWorkout = (workout) => {
  selectedWorkout.value = workout;
  showDialog.value = true;
};

const closeDialog = () => {
  showDialog.value = false;
};

const removeWorkout = async (id) => {
  await deleteWorkout(id);
  loadWorkouts();
};

onMounted(loadWorkouts);
</script>

