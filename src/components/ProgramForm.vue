<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card class="pa-4">
      <h3>{{ program ? "Edit" : "Create" }} Program</h3>

      <v-text-field label="Title" v-model="form.title" />
      <v-textarea label="Description" v-model="form.description" />

      <v-select label="Category" :items="categories" v-model="form.category" />
      <v-select label="Goal" :items="goals" v-model="form.goal" />

      <v-text-field
        label="Duration (Days)"
        type="number"
        v-model="form.durationDays"
      />

      <v-switch label="Active" v-model="form.active" />

      <v-btn color="primary" @click="save">Save</v-btn>
      <v-btn @click="$emit('close')">Cancel</v-btn>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from "vue";
import { createProgram, updateProgram } from "@/api/programs";

const props = defineProps(["program"]);
const emit = defineEmits(["close", "saved"]);

const dialog = ref(true);

const form = ref({
  title: "",
  description: "",
  category: "",
  goal: "",
  durationDays: 30,
  active: true,
});

const categories = ["GYM", "YOGA", "HIIT", "MEDITATION", "PILATES", "ZUMBA"];
const goals = [
  "MUSCLE_GAIN",
  "FAT_LOSS",
  "FLEXIBILITY",
  "STRESS_RELIEF",
  "SLEEP",
  "ASTHMA",
];

watch(
  () => props.program,
  (p) => {
    if (p) form.value = { ...p };
  },
  { immediate: true }
);

const save = async () => {
  if (props.program) {
    await updateProgram(props.program.id, form.value);
  } else {
    await createProgram(form.value);
  }

  emit("saved");
  emit("close");
};
</script>
