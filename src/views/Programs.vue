<template>
  <v-container>
    <v-row justify="space-between">
      <h2>Programs</h2>
      <v-btn color="primary" @click="openDialog">Create Program</v-btn>
    </v-row>

    <v-data-table :headers="headers" :items="programs">
      <template #item.actions="{ item }">
        <v-btn size="small" @click="manage(item)">Manage</v-btn>
        <v-btn size="small" @click="edit(item)">Edit</v-btn>
        <v-btn size="small" color="red" @click="remove(item.id)">Delete</v-btn>
      </template>
    </v-data-table>

    <ProgramForm
      v-if="showDialog"
      :program="selected"
      @close="closeDialog"
      @saved="loadPrograms"
    />
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getPrograms, deleteProgram } from "@/api/programs";
import ProgramForm from "@/components/ProgramForm.vue";
import { useRouter } from "vue-router";

const router = useRouter();
const programs = ref([]);
const showDialog = ref(false);
const selected = ref(null);

const headers = [
  { text: "Title", value: "title" },
  { text: "Category", value: "category" },
  { text: "Goal", value: "goal" },
  { text: "Duration", value: "durationDays" },
  { text: "Actions", value: "actions" },
];

const loadPrograms = async () => {
  const res = await getPrograms();
  programs.value = res.data;
};

const openDialog = () => {
  selected.value = null;
  showDialog.value = true;
};

const edit = (p) => {
  selected.value = p;
  showDialog.value = true;
};

const closeDialog = () => {
  showDialog.value = false;
};

const remove = async (id) => {
  await deleteProgram(id);
  loadPrograms();
};

const manage = (p) => {
  router.push(`/programs/${p.id}/builder`);
};

onMounted(loadPrograms);
</script>
