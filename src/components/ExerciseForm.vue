<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card class="pa-4">
      <h3>{{ exercise ? "Edit" : "Add" }} Exercise</h3>

      <v-text-field label="Title" v-model="form.title" />
      <v-textarea label="Description" v-model="form.description" />

      <v-select
        label="Equipment"
        :items="equipment"
        v-model="form.equipmentType"
      />

      <v-btn color="primary" @click="save">Save</v-btn>
      <v-btn @click="$emit('close')">Cancel</v-btn>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from "vue";
import { createExercise, updateExercise } from "@/api/exercises";

const props = defineProps(["exercise", "workoutId"]);
const emit = defineEmits(["close", "saved"]);

const dialog = ref(true);

const form = ref({
  title: "",
  description: "",
  equipmentType: "NONE",
});

const equipment = [
  "DUMBBELL",
  "BARBELL",
  "MACHINE",
  "BODYWEIGHT",
  "NONE",
];

watch(
  () => props.exercise,
  (e) => {
    if (e) form.value = { ...e };
  },
  { immediate: true }
);

const save = async () => {
  if (props.exercise) {
    await updateExercise(props.exercise.id, form.value);
  } else {
    await createExercise(props.workoutId, form.value);
  }

  emit("saved");
  emit("close");
};
</script>
