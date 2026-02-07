<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getAllExercises } from "@/api/exercises";
import ExerciseForm from "@/components/ExerciseForm.vue";
import { previewText } from "@/utils/text-utils.js";

const router = useRouter();
const exercises = ref([]);
const showForm = ref(false);
const selected = ref(null);
const loading = ref(false);
const page = ref(1);
const itemsPerPage = ref(20);
const sortBy = ref([]);
const totalItems = ref(0);
const snackbar = ref(false);
const snackbarText = ref("");
const snackbarColor = ref("success");

const headers = [
  { title: "Title", key: "title" },
  { title: "Description", key: "description" },
  { title: "Equipment", key: "equipmentType" },
  { title: "Category", key: "category" },
  { title: "Actions", key: "actions", sortable: false },
];


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
  if (Array.isArray(payload?.exercises)) {
    return payload.exercises;
  }
  return [];
};

const getSortParams = () => {
  if (!sortBy.value?.length) {
    return {};
  }
  const [sort] = sortBy.value;
  return sort?.key
    ? { sortBy: sort.key, sortDir: sort.order || "asc" }
    : {};
};

const applyPagedResponse = (data) => {
  const list = normalizeList(data);
  exercises.value = list;
  totalItems.value =
    typeof data?.totalElements === "number" ? data.totalElements : list.length;
};

const showSnackbar = (message, color = "success") => {
  snackbarText.value = message;
  snackbarColor.value = color;
  snackbar.value = true;
};

const load = async ({ notify = false } = {}) => {
  loading.value = true;
  try {
    const res = await getAllExercises({
      pageNumber: page.value - 1,
      pageSize: itemsPerPage.value,
      ...getSortParams(),
    });
    applyPagedResponse(res.data);
    if (notify) {
      showSnackbar("Exercises loaded");
    }
  } finally {
    loading.value = false;
  }
};

const updateOptions = (options) => {
  page.value = options.page;
  itemsPerPage.value = options.itemsPerPage;
  sortBy.value = options.sortBy ?? [];
  load();
};

const refresh = () => {
  load({ notify: true });
};

onMounted(() => load({ notify: false }));

const create = () => {
  selected.value = null;
  showForm.value = true;
};

const edit = (e) => {
  selected.value = e;
  showForm.value = true;
};

const openMedia = (id) => {
  router.push(`/exercises/${id}/media`);
};

const saved = () => {
  showForm.value = false;
  load({ notify: false });
  showSnackbar("Exercise saved");
};
</script>

<template>
  <v-snackbar
    v-model="snackbar"
    :color="snackbarColor"
    timeout="3000"
  >
    {{ snackbarText }}
  </v-snackbar>

  <v-card>
    <v-card-title class="d-flex align-center">
      <span class="text-h6"><v-icon>mdi-run</v-icon> Exercises</span>

      <v-spacer />

      <!-- Refresh -->
      <v-tooltip text="Refresh Exercises" location="top">
        <template #activator="{ props }">
          <v-btn v-bind="props" icon @click="refresh">
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </template>
      </v-tooltip>
      <!-- Add Exercise -->
      <v-btn
        color="primary"
        class="ml-2"
        @click="create"
      >
        Add Exercise
      </v-btn>
    </v-card-title>



    <v-data-table-server
      :headers="headers"
      :items="exercises"
      :loading="loading"
      :items-length="totalItems"
      v-model:page="page"
      v-model:items-per-page="itemsPerPage"
      v-model:sort-by="sortBy"
      @update:options="updateOptions"
      loading-text="Loading exercises..."
    >
      <template #item.description="{ item }">
        <span class="description-preview">
          {{ previewText(item.description) }}
        </span>
      </template>

      <template #item.actions="{ item }">
        <v-tooltip text="Edit Exercise" location="top">
          <template #activator="{ props }">
            <v-btn v-bind="props" icon @click="edit(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </template>
        </v-tooltip>

        <v-tooltip text="Manage Media" location="top">
          <template #activator="{ props }">
            <v-btn v-bind="props" icon @click="openMedia(item.id)">
              <v-icon>mdi-image</v-icon>
            </v-btn>
          </template>
        </v-tooltip>
      </template>
    </v-data-table-server>


    <ExerciseForm
      v-if="showForm"
      :exercise="selected"
      @saved="saved"
      @close="showForm = false"
    />
  </v-card>
</template>
