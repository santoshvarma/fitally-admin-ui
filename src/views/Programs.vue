<template>
  <v-card>
    <v-card-title class="d-flex align-center">
      <span class="text-h6">
        <v-icon>mdi-calendar-check</v-icon>
        Programs
      </span>

      <v-spacer />

      <v-tooltip text="Refresh Programs" location="top">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            icon
            @click="loadPrograms"
            :loading="loading"
          >
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </template>
      </v-tooltip>

      <v-btn color="primary" class="ml-2" @click="openDialog">
        Create Program
      </v-btn>
    </v-card-title>

    <v-data-table-server
      :headers="headers"
      :items="programs"
      :loading="loading"
      :items-length="totalItems"
      v-model:page="page"
      v-model:items-per-page="itemsPerPage"
      v-model:sort-by="sortBy"
      @update:options="updateOptions"
      loading-text="Loading programs..."
      item-key="id"
    >
      <template #item.description="{ item }">
        <span class="description-preview">
          {{ previewText(item.description) }}
        </span>
      </template>

      <template #item.active="{ value }">
        <v-chip :color="value ? 'green' : 'grey'" size="small">
          {{ value ? "Active" : "Inactive" }}
        </v-chip>
      </template>

      <template #item.actions="{ item }">
        <v-tooltip text="Manage Program" location="top">
          <template #activator="{ props }">
            <v-btn v-bind="props" icon @click="manage(item)">
              <v-icon>mdi-cog</v-icon>
            </v-btn>
          </template>
        </v-tooltip>

        <v-tooltip text="Edit Program" location="top">
          <template #activator="{ props }">
            <v-btn v-bind="props" icon @click="edit(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </template>
        </v-tooltip>

        <v-tooltip text="Delete Program" location="top">
          <template #activator="{ props }">
            <v-btn v-bind="props" icon @click="remove(item.id)">
              <v-icon color="red">mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-tooltip>
      </template>
    </v-data-table-server>
  </v-card>

  <ProgramForm
    v-if="showDialog"
    :program="selected"
    @close="closeDialog"
    @saved="loadPrograms"
  />
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getPrograms, deleteProgram } from "@/api/programs";
import ProgramForm from "@/components/ProgramForm.vue";
import { useRouter } from "vue-router";
import { previewText } from "@/utils/text-utils.js";

const router = useRouter();
const programs = ref([]);
const loading = ref(false);
const showDialog = ref(false);
const selected = ref(null);
const page = ref(1);
const itemsPerPage = ref(20);
const sortBy = ref([]);
const totalItems = ref(0);

const headers = [
  { title: "Title", key: "title" },
  { title: "Description", key: "description" },
  { title: "Category", key: "category" },
  { title: "Goal", key: "goal" },
  { title: "Duration (Days)", key: "durationDays" },
  { title: "Status", key: "active" },
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
  if (Array.isArray(payload?.programs)) {
    return payload.programs;
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

const loadPrograms = async () => {
  loading.value = true;
  try {
    const res = await getPrograms({
      pageNumber: page.value - 1,
      pageSize: itemsPerPage.value,
      ...getSortParams(),
    });
    const list = normalizeList(res.data);
    programs.value = list;
    totalItems.value =
      typeof res.data?.totalElements === "number"
        ? res.data.totalElements
        : list.length;
  } catch (e) {
    console.error("Failed to load programs", e);
    programs.value = [];
    totalItems.value = 0;
  } finally {
    loading.value = false;
  }
};

const updateOptions = (options) => {
  page.value = options.page;
  itemsPerPage.value = options.itemsPerPage;
  sortBy.value = options.sortBy ?? [];
  loadPrograms();
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
