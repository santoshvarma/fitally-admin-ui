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

      <v-data-table-server
        class="mt-2"
        :headers="headers"
        :items="workouts"
        :loading="loading"
        :items-length="totalItems"
        v-model:page="page"
        v-model:items-per-page="itemsPerPage"
        v-model:sort-by="sortBy"
        @update:options="updateOptions"
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
      </v-data-table-server>
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
const page = ref(1);
const itemsPerPage = ref(20);
const sortBy = ref([]);
const totalItems = ref(0);

const headers = [
  { title: "Title", key: "title" },
  { title: "Description", key: "description" },
  { title: "Category", key: "category" },
  { title: "Difficulty", key: "difficulty" },
  { title: "Equipment", key: "equipmentType" },
  { title: "Status", key: "active" },
  { title: "Actions", key: "actions", sortable: false },
];

const getSortParams = () => {
  if (!sortBy.value?.length) {
    return {};
  }
  const [sort] = sortBy.value;
  return sort?.key
    ? { sortBy: sort.key, sortDir: sort.order || "asc" }
    : {};
};

const normalizeList = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }
  if (Array.isArray(payload?.content)) {
    return payload.content;
  }
  if (Array.isArray(payload?.data)) {
    return payload.data;
  }
  if (Array.isArray(payload?.items)) {
    return payload.items;
  }
  if (Array.isArray(payload?.workouts)) {
    return payload.workouts;
  }
  return [];
};

const loadWorkouts = async () => {
  loading.value = true;
  try {
    const res = await getWorkouts({
      pageNumber: page.value - 1,
      pageSize: itemsPerPage.value,
      ...getSortParams(),
    });
    const list = normalizeList(res.data);
    workouts.value = list;
    totalItems.value =
      typeof res.data?.totalElements === "number"
        ? res.data.totalElements
        : list.length;
  } catch (e) {
    console.error("Failed to load workouts", e);
    workouts.value = [];
    totalItems.value = 0;
  } finally {
    loading.value = false;
  }
};

const updateOptions = (options) => {
  page.value = options.page;
  itemsPerPage.value = options.itemsPerPage;
  sortBy.value = options.sortBy ?? [];
  loadWorkouts();
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
