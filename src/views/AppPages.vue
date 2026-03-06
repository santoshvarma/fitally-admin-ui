<template>
  <v-container fluid>
    <v-card>
      <v-card-title class="d-flex align-center">
        <span class="text-h6">
          <v-icon>mdi-view-list</v-icon>
          App Pages
        </span>
        <v-spacer />
        <v-btn icon @click="load" :loading="loading">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
        <v-btn color="primary" class="ml-2" @click="openCreate">Add Page</v-btn>
      </v-card-title>

      <v-data-table :headers="headers" :items="pages" :loading="loading">
        <template #item.visibleInMenu="{ value }">
          <v-chip :color="value ? 'green' : 'grey'" size="small">
            {{ value ? "Visible" : "Hidden" }}
          </v-chip>
        </template>
        <template #item.active="{ value }">
          <v-chip :color="value ? 'green' : 'grey'" size="small">
            {{ value ? "Active" : "Inactive" }}
          </v-chip>
        </template>
        <template #item.actions="{ item }">
          <v-btn icon size="small" variant="text" @click="openEdit(item)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon size="small" variant="text" color="red" @click="remove(item.id)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog" max-width="560">
      <v-card class="pa-4">
        <h3 class="mb-3">{{ editing ? "Edit Page" : "Create Page" }}</h3>
        <v-text-field label="Page Key" v-model="form.pageKey" :disabled="editing" />
        <v-text-field label="Title" v-model="form.title" />
        <v-text-field label="Icon" v-model="form.icon" hint="Material icon name (e.g. home, fitness_center)" persistent-hint />
        <v-text-field label="Route Slug" v-model="form.routeSlug" />
        <v-text-field label="Display Order" type="number" v-model="form.displayOrder" />
        <v-switch label="Visible In Menu" v-model="form.visibleInMenu" />
        <v-switch label="Active" v-model="form.active" />
        <div class="d-flex justify-end ga-2 mt-2">
          <v-btn variant="text" @click="dialog = false">Cancel</v-btn>
          <v-btn color="primary" :loading="saving" @click="save">Save</v-btn>
        </div>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { createAppPage, deleteAppPage, getAppPages, updateAppPage } from "@/api/app-pages";

const pages = ref([]);
const loading = ref(false);
const dialog = ref(false);
const saving = ref(false);
const editing = ref(false);
const editId = ref(null);

const form = ref({
  pageKey: "",
  title: "",
  icon: "",
  routeSlug: "",
  displayOrder: 1,
  visibleInMenu: true,
  active: true,
});

const headers = [
  { title: "Key", key: "pageKey" },
  { title: "Title", key: "title" },
  { title: "Icon", key: "icon" },
  { title: "Order", key: "displayOrder" },
  { title: "Menu", key: "visibleInMenu" },
  { title: "Status", key: "active" },
  { title: "Actions", key: "actions", sortable: false },
];

const load = async () => {
  loading.value = true;
  try {
    const res = await getAppPages();
    pages.value = Array.isArray(res.data) ? res.data : [];
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  form.value = {
    pageKey: "",
    title: "",
    icon: "",
    routeSlug: "",
    displayOrder: 1,
    visibleInMenu: true,
    active: true,
  };
  editing.value = false;
  editId.value = null;
};

const openCreate = () => {
  resetForm();
  dialog.value = true;
};

const openEdit = (item) => {
  editing.value = true;
  editId.value = item.id;
  form.value = { ...item };
  dialog.value = true;
};

const save = async () => {
  if (saving.value) return;
  saving.value = true;
  try {
    if (editing.value && editId.value) {
      await updateAppPage(editId.value, form.value);
    } else {
      await createAppPage(form.value);
    }
    dialog.value = false;
    await load();
  } finally {
    saving.value = false;
  }
};

const remove = async (id) => {
  await deleteAppPage(id);
  await load();
};

onMounted(load);
</script>

