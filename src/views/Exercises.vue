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
  exercises.value = (await getAllExercises()).data;
};

onMounted(load);

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
    <v-card-title>
      Exercises
      <v-spacer/>
      <v-btn color="primary" @click="create">Add Exercise</v-btn>
    </v-card-title>

    <v-data-table :items="exercises">
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
