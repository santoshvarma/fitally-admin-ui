<script setup>
import {ref, onMounted} from "vue";
import {useRouter} from "vue-router";
import {getAllExercises} from "@/api/exercises";
import ExerciseForm from "@/components/ExerciseForm.vue";

const router = useRouter();
const exercises = ref([]);
const showForm = ref(false);
const selected = ref(null);

const load = async () => {
  loading.value = true;
  try {
    exercises.value = (await getAllExercises()).data;
  } finally {
    loading.value = false;
  }
};

onMounted(load);

const loading = ref(false);

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
  load();
};
</script>

<template>
  <v-card>
    <v-card-title class="d-flex align-center">
      <span class="text-h6"><v-icon>mdi-run</v-icon> Exercises</span>

      <v-spacer />

      <!-- Add Exercise -->
      <v-btn
        color="primary"
        class="ml-2"
        @click="create"
      >
        Add Exercise
      </v-btn>
      <!-- Refresh -->
      <v-tooltip text="Refresh Exercises" location="top">
        <template #activator="{ props }">
          <v-btn v-bind="props" icon @click="load">
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </template>
      </v-tooltip>
    </v-card-title>



    <v-data-table
      :items="exercises"
      :loading="loading"
      loading-text="Loading exercises..."
    >
    <template #item.actions="{ item }">
        <v-btn icon @click="edit(item)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>

        <v-btn icon @click="openMedia(item.id)">
          <v-icon>mdi-image</v-icon>
        </v-btn>
      </template>
    </v-data-table>

    <ExerciseForm
      v-if="showForm"
      :exercise="selected"
      @saved="saved"
      @close="showForm = false"
    />
  </v-card>
</template>
