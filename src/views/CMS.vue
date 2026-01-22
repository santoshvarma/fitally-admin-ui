<template>
  <v-container>
    <v-row justify="space-between">
      <h2>CMS Content</h2>
      <v-btn color="primary" @click="openDialog">Add Content</v-btn>
    </v-row>

    <v-select
      label="Page"
      :items="pages"
      v-model="selectedPage"
      @update:modelValue="loadContent"
      class="my-4"
    />

    <v-data-table :headers="headers" :items="content">
      <template #item.actions="{ item }">
        <v-btn size="small" @click="edit(item)">Edit</v-btn>
        <v-btn size="small" color="red" @click="remove(item.id)">Delete</v-btn>
      </template>
    </v-data-table>

    <CMSForm
      v-if="showDialog"
      :contentItem="selected"
      @close="closeDialog"
      @saved="loadContent"
    />
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getContentByPage, deleteContent } from "@/api/cms";
import CMSForm from "@/components/CMSForm.vue";

const pages = ["HOME", "ABOUT", "TERMS", "PRIVACY", "DASHBOARD"];
const selectedPage = ref("HOME");

const content = ref([]);
const showDialog = ref(false);
const selected = ref(null);

const headers = [
  { text: "Title", value: "title" },
  { text: "Type", value: "type" },
  { text: "Order", value: "displayOrder" },
  { text: "Active", value: "active" },
  { text: "Actions", value: "actions" },
];

const loadContent = async () => {
  const res = await getContentByPage(selectedPage.value);
  content.value = res.data;
};

const openDialog = () => {
  selected.value = null;
  showDialog.value = true;
};

const edit = (item) => {
  selected.value = item;
  showDialog.value = true;
};

const closeDialog = () => {
  showDialog.value = false;
};

const remove = async (id) => {
  await deleteContent(id);
  loadContent();
};

onMounted(loadContent);
</script>
