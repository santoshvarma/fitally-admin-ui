<script setup>
import { ref, onMounted, computed, watch, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { getAllExercises, deleteExercise } from "@/api/exercises";
import { generateExercises, streamAiJob } from "@/api/ai";
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
const showAiDialog = ref(false);
const aiLoading = ref(false);
const aiJobStatus = ref(null);
const aiJobController = ref(null);
const aiJobRetryTimeout = ref(null);
const aiForm = ref({
  title: "",
  category: "GYM",
  equipmentType: "DUMBBELL",
  difficulty: "BEGINNER",
  count: 10,
});
const countDisabled = computed(() => !!aiForm.value.title?.trim());

const headers = [
  { title: "Title", key: "title" },
  { title: "Description", key: "description" },
  { title: "Equipment", key: "equipmentType" },
  { title: "Category", key: "category" },
  { title: "Actions", key: "actions", sortable: false },
];

const categories = ["GYM", "YOGA", "PILATES", "MEDITATION", "HIIT", "ZUMBA"];
const difficulties = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];
const equipmentTypes = [
  "DUMBBELL",
  "BARBELL",
  "KETTLEBELL",
  "MACHINE",
  "BODYWEIGHT",
  "HOME",
  "NONE",
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
watch(
  () => aiForm.value.title,
  (value) => {
    if (value?.trim()) {
      aiForm.value.count = 1;
    }
  }
);
onBeforeUnmount(() => {
  aiJobController.value?.abort();
  if (aiJobRetryTimeout.value) {
    clearTimeout(aiJobRetryTimeout.value);
  }
});

const create = () => {
  selected.value = null;
  showForm.value = true;
};

const openAiDialog = () => {
  showAiDialog.value = true;
};

const edit = (e) => {
  selected.value = e;
  showForm.value = true;
};

const remove = async (id) => {
  await deleteExercise(id);
  load({ notify: false });
  showSnackbar("Exercise deleted");
};

const openMedia = (id) => {
  router.push(`/exercises/${id}/media`);
};

const saved = () => {
  showForm.value = false;
  load({ notify: false });
  showSnackbar("Exercise saved");
};

const submitAi = async () => {
  aiLoading.value = true;
  try {
    const count = Math.max(1, Number(aiForm.value.count) || 1);
    const title = aiForm.value.title?.trim();
    const res = await generateExercises({
      ...(title ? { title } : {}),
      category: aiForm.value.category,
      equipmentType: aiForm.value.equipmentType,
      difficulty: aiForm.value.difficulty,
      count,
    });
    const jobId = res.data?.jobId;
    showSnackbar(res.data?.message || "AI generation started");
    if (jobId) {
      startAiStream(jobId);
    }
    showAiDialog.value = false;
  } catch (e) {
    showSnackbar("Failed to start AI generation", "error");
  } finally {
    aiLoading.value = false;
  }
};

const isTerminalState = (state) =>
  ["COMPLETED", "FAILED", "CANCELLED"].includes(state);

const startAiStream = (jobId) => {
  aiJobController.value?.abort();
  if (aiJobRetryTimeout.value) {
    clearTimeout(aiJobRetryTimeout.value);
    aiJobRetryTimeout.value = null;
  }
  aiJobController.value = new AbortController();
  console.info("[AI SSE] Exercises stream start", { jobId });
  streamAiJob(jobId, {
    signal: aiJobController.value.signal,
    onMessage: (data) => {
      aiJobStatus.value = data;
      console.info("[AI SSE] Exercises status update", data);
      if (isTerminalState(data?.state)) {
        aiJobController.value?.abort();
      }
    },
    onError: () => {
      console.error("[AI SSE] Exercises stream error");
      showSnackbar("AI status stream disconnected", "error");
      if (!isTerminalState(aiJobStatus.value?.state)) {
        aiJobRetryTimeout.value = setTimeout(() => {
          startAiStream(jobId);
        }, 2000);
      }
    },
  }).catch(() => {});
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
      <v-tooltip text="Generate Exercises with AI" location="top">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            icon
            color="secondary"
            class="ml-2"
            @click="openAiDialog"
          >
            <v-icon>mdi-robot-outline</v-icon>
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

    <v-alert
      v-if="aiJobStatus"
      type="info"
      variant="tonal"
      class="mx-4 my-2"
    >
      <div class="text-body-2">
        AI Status: {{ aiJobStatus.state }} ({{ aiJobStatus.completed ?? 0 }}/{{ aiJobStatus.total ?? 0 }})
      </div>
      <div class="text-caption">{{ aiJobStatus.message }}</div>
    </v-alert>


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
            <v-btn
              v-bind="props"
              icon="mdi-pencil"
              size="small"
              variant="text"
              @click="edit(item)"
            />
          </template>
        </v-tooltip>

        <v-tooltip text="Manage Media" location="top">
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              icon="mdi-image"
              size="small"
              variant="text"
              @click="openMedia(item.id)"
            />
          </template>
        </v-tooltip>

        <v-tooltip text="Delete Exercise" location="top">
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              icon="mdi-delete"
              size="small"
              variant="text"
              color="red"
              @click="remove(item.id)"
            />
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

    <v-dialog v-model="showAiDialog" max-width="520">
      <v-card>
        <v-card-title>Generate Exercises with AI</v-card-title>
        <v-card-text class="d-flex flex-column ga-4">
          <v-select
            label="Category"
            :items="categories"
            v-model="aiForm.category"
          />
          <v-text-field
            label="Title"
            v-model="aiForm.title"
            hint="Optional: seed the AI with a specific exercise title"
            persistent-hint
          />
          <v-select
            label="Equipment Type"
            :items="equipmentTypes"
            v-model="aiForm.equipmentType"
          />
          <v-select
            label="Difficulty"
            :items="difficulties"
            v-model="aiForm.difficulty"
          />
          <v-text-field
            label="Count"
            type="number"
            min="1"
            v-model="aiForm.count"
            :disabled="countDisabled"
          />
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn variant="text" @click="showAiDialog = false">Cancel</v-btn>
          <v-btn color="primary" :loading="aiLoading" @click="submitAi">
            Start
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-card>
</template>
