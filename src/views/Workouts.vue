<template>
  <v-container fluid>
    <v-card>
      <v-card-title class="d-flex align-center">
        <span class="text-h6">
          <v-icon>mdi-dumbbell</v-icon>
          Workouts
        </span>

        <v-spacer />

        <v-tooltip text="Refresh Workouts" location="top">
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              icon
              @click="loadWorkouts"
              :loading="loading"
            >
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </template>
        </v-tooltip>

        <v-btn color="primary" class="ml-2" @click="openCreate">
          Add Workout
        </v-btn>
      </v-card-title>

      <v-data-table
        class="mt-2"
        :headers="headers"
        :items="workouts"
        :loading="loading"
        item-key="id"
      >
      <template #item.description="{ item }">
        <span class="description-preview">
          {{ previewText(item.description) }}
        </span>
      </template>

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
    </v-card>

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
import { previewText } from "@/utils/text-utils.js";

const workouts = ref([]);
const loading = ref(false);
const dialog = ref(false);
const selected = ref(null);

const headers = [
  { title: "Title", key: "title" },
  { title: "Description", key: "description" },
  { title: "Category", key: "category" },
  { title: "Difficulty", key: "difficulty" },
  { title: "Equipment", key: "equipmentType" },
  { title: "Status", key: "active" },
  { title: "Actions", key: "actions", sortable: false },
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
