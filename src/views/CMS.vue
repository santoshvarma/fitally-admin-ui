<template>
  <v-container fluid>
    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      timeout="3000"
    >
      {{ snackbarText }}
    </v-snackbar>

    <v-card>
      <v-card-title class="d-flex align-center">
        <span class="text-h6">
          <v-icon>mdi-file-document-edit</v-icon>
          CMS Content
        </span>

        <v-spacer />

        <v-tooltip text="Refresh Content" location="top">
          <template #activator="{ props }">
            <v-btn v-bind="props" icon @click="refresh" :loading="loading">
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </template>
        </v-tooltip>

        <v-btn color="primary" class="ml-2" @click="openDialog">
          Add Content
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-select
          label="Page"
          :items="pages"
          v-model="selectedPage"
          @update:modelValue="loadContent"
        />
      </v-card-text>

      <v-data-table-server
        :headers="headers"
        :items="content"
        :loading="loading"
        :items-length="totalItems"
        v-model:page="page"
        v-model:items-per-page="itemsPerPage"
        v-model:sort-by="sortBy"
        @update:options="updateOptions"
        loading-text="Loading content..."
      >
      <template #item.active="{ value }">
        <v-chip :color="value ? 'green' : 'grey'" size="small">
          {{ value ? "Active" : "Inactive" }}
        </v-chip>
      </template>

      <template #item.actions="{ item }">
        <v-tooltip text="Manage Media" location="top">
          <template #activator="{ props }">
            <v-btn v-bind="props" icon @click="manageMedia(item)">
              <v-icon>mdi-image</v-icon>
            </v-btn>
          </template>
        </v-tooltip>

        <v-tooltip text="Edit Content" location="top">
          <template #activator="{ props }">
            <v-btn v-bind="props" icon @click="edit(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </template>
        </v-tooltip>

        <v-tooltip text="Delete Content" location="top">
          <template #activator="{ props }">
            <v-btn v-bind="props" icon @click="remove(item.id)">
              <v-icon color="red">mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-tooltip>
      </template>
      </v-data-table-server>
    </v-card>

    <CMSForm
      v-if="showDialog"
      :contentItem="selected"
      @close="closeDialog"
      @saved="saved"
    />
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getContentByPage, deleteContent } from "@/api/cms";
import CMSForm from "@/components/CMSForm.vue";
import { useRouter } from "vue-router";

const pages = ["HOME", "ABOUT", "TERMS", "PRIVACY", "DASHBOARD"];
const selectedPage = ref("HOME");

const router = useRouter();
const content = ref([]);
const loading = ref(false);
const showDialog = ref(false);
const selected = ref(null);
const page = ref(1);
const itemsPerPage = ref(20);
const sortBy = ref([]);
const totalItems = ref(0);
const snackbar = ref(false);
const snackbarText = ref("");
const snackbarColor = ref("success");

const headers = [
  { title: "Title", key: "title" },
  { title: "Type", key: "type" },
  { title: "Order", key: "displayOrder" },
  { title: "Active", key: "active" },
  { title: "Actions", key: "actions", sortable: false },
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
  if (Array.isArray(payload?.contentItems)) {
    return payload.contentItems;
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

const showSnackbar = (message, color = "success") => {
  snackbarText.value = message;
  snackbarColor.value = color;
  snackbar.value = true;
};

const loadContent = async ({ notify = false } = {}) => {
  loading.value = true;
  try {
    const res = await getContentByPage(selectedPage.value, {
      pageNumber: page.value - 1,
      pageSize: itemsPerPage.value,
      ...getSortParams(),
    });
    const list = normalizeList(res.data);
    content.value = list;
    totalItems.value =
      typeof res.data?.totalElements === "number"
        ? res.data.totalElements
        : list.length;
    if (notify) {
      showSnackbar("Content loaded");
    }
  } finally {
    loading.value = false;
  }
};

const updateOptions = (options) => {
  page.value = options.page;
  itemsPerPage.value = options.itemsPerPage;
  sortBy.value = options.sortBy ?? [];
  loadContent();
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
  loadContent({ notify: false });
  showSnackbar("Content deleted");
};

const manageMedia = (item) => {
  router.push(`/cms/${item.id}/media`);
};

const saved = () => {
  loadContent({ notify: false });
  showSnackbar("Content saved");
};

const refresh = () => {
  loadContent({ notify: true });
};

onMounted(() => loadContent({ notify: false }));
</script>
