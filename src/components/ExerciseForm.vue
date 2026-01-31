<script setup>
import { ref, watch } from "vue";
import {createExercise, updateExercise} from "@/api/exercises";

const props = defineProps({ exercise: Object });
const emit = defineEmits(["saved", "close"]);

const form = ref({
  title: "",
  description: "",
  equipmentType: "",
  category: "GYM",
});

const equipmentTypes = [
  { title: "Dumbbell", value: "DUMBBELL" },
  { title: "Barbell", value: "BARBELL" },
  { title: "Kettlebell", value: "KETTLEBELL" },
  { title: "Machine", value: "MACHINE" },
  { title: "Bodyweight", value: "BODYWEIGHT" },
  { title: "Home", value: "HOME" },
  { title: "None", value: "NONE" },
];

const fitnessCategories = [
  { title: "Gym", value: "GYM" },
  { title: "Yoga", value: "YOGA" },
  { title: "Pilates", value: "PILATES" },
  { title: "Meditation", value: "MEDITATION" },
  { title: "HIIT", value: "HIIT" },
  { title: "Zumba", value: "ZUMBA" },
];

watch(
  () => props.exercise,
  (val) => {
    if (val) form.value = { ...val };
  },
  { immediate: true }
);

const save = async () => {
  props.exercise
    ? await updateExercise(props.exercise.id, form.value)
    : await createExercise(form.value);

  emit("saved");
};
</script>

<template>
  <v-dialog model-value max-width="600">
    <v-card>
      <v-card-title>Exercise</v-card-title>

      <v-card-text>
        <v-text-field label="Title" v-model="form.title" />
        <v-textarea label="Description" v-model="form.description" />
        <v-select
          label="Equipment Type"
          :items="equipmentTypes"
          item-title="title"
          item-value="value"
          v-model="form.equipmentType"
          clearable
        />
        <v-select
          label="Fitness Category"
          :items="fitnessCategories"
          item-title="title"
          item-value="value"
          v-model="form.category"
        />
      </v-card-text>

      <v-card-actions>
        <v-btn text @click="$emit('close')">Cancel</v-btn>
        <v-btn color="primary" @click="save">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
