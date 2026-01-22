<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card class="pa-4">
      <h3>{{ workout ? "Edit" : "Create" }} Workout</h3>

      <v-text-field label="Title" v-model="form.title" />
      <v-textarea label="Description" v-model="form.description" />

      <v-select label="Category" :items="categories" v-model="form.category" />
      <v-select label="Difficulty" :items="difficulties" v-model="form.difficulty" />
      <v-select label="Equipment" :items="equipment" v-model="form.equipmentType" />

      <v-switch label="Equipment Required" v-model="form.equipmentRequired" />
      <v-switch label="Active" v-model="form.active" />

      <v-btn color="primary" @click="save">Save</v-btn>
      <v-btn @click="$emit('close')">Cancel</v-btn>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from "vue";
import { createWorkout, updateWorkout } from "@/api/workouts";

const props = defineProps(["workout"]);
const emit = defineEmits(["close", "saved"]);

const dialog = ref(true);

const form = ref({
  title: "",
  description: "",
  category: "",
  difficulty: "",
  equipmentType: "",
  equipmentRequired: false,
  active: true,
});

const categories = ["GYM", "YOGA", "HIIT", "MEDITATION", "PILATES", "ZUMBA"];
const difficulties = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];
const equipment = ["DUMBBELL", "BARBELL", "MACHINE", "BODYWEIGHT", "NONE"];

watch(
  () => props.workout,
  (w) => {
    if (w) form.value = { ...w };
  },
  { immediate: true }
);

const save = async () => {
  if (props.workout) {
    await updateWorkout(props.workout.id, form.value);
  } else {
    await createWorkout(form.value);
  }

  emit("saved");
  emit("close");
};
</script>
