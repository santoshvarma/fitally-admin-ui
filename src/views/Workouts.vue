<template>
  <v-container fluid>
    <v-row align="center" justify="space-between">
      <h2 class="text-h5">Workouts</h2>

      <div class="d-flex ga-2">
        <v-btn
          icon="mdi-refresh"
          variant="tonal"
          @click="loadWorkouts"
          :loading="loading"
        />

        <v-btn color="primary" @click="openCreate">
          Add Workout
        </v-btn>
      </div>
    </v-row>

    <v-data-table
      class="mt-4"
      :headers="headers"
      :items="workouts"
      :loading="loading"
      item-key="id"
    >
      <template #item.active="{ value }">
        <v-chip :color="value ? 'green' : 'grey'" size="small">
          {{ value ? "Active" : "Inactive" }}
        </v-chip>
      </template>

      <template #item.actions="{ item }">
        <v-btn
          icon="mdi-pencil"
          size="small"
          variant="text"
          @click="openEdit(item)"
        />
        <v-btn
          icon="mdi-delete"
          size="small"
          variant="text"
          color="red"
          @click="remove(item.id)"
        />
      </template>
    </v-data-table>

    <WorkoutForm
      v-model="dialog"
      :workout="selected"
      @saved="loadWorkouts"
    />
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getWorkouts, deleteWorkout } from "@/api/workouts";
import WorkoutForm from "@/components/WorkoutForm.vue";

const workouts = ref([]);
const loading = ref(false);
const dialog = ref(false);
const selected = ref(null);

const headers = [
  { text: "Title", value: "title" },
  { text: "Category", value: "category" },
  { text: "Difficulty", value: "difficulty" },
  { text: "Equipment", value: "equipmentType" },
  { text: "Status", value: "active" },
  { text: "Actions", value: "actions", sortable: false },
];

const loadWorkouts = async () => {
  loading.value = true;
  try {
    const res = await getWorkouts();
    console.log("Results:", res.data)
    const list = Array.isArray(res.data)
      ? res.data
      : Array.isArray(res.data?.content)
        ? res.data.content
        : [];

    workouts.value = list;
  } catch (e) {
    console.error("Failed to load workouts", e);
    workouts.value = [];
  } finally {
    loading.value = false;
  }
};

const openCreate = () => {
  selected.value = null;
  dialog.value = true;
};

const openEdit = (workout) => {
  selected.value = workout;
  dialog.value = true;
};

const remove = async (id) => {
  await deleteWorkout(id);
  loadWorkouts();
};

onMounted(loadWorkouts);
</script>
