<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card class="pa-4">
      <h3>{{ contentItem ? "Edit" : "Create" }} CMS Content</h3>

      <v-text-field label="Title" v-model="form.title" />
      <v-textarea label="Description" v-model="form.description" />

      <v-select label="Type" :items="types" v-model="form.type" />
      <v-text-field label="Page" v-model="form.page" />
      <v-text-field
        label="Display Order"
        type="number"
        v-model="form.displayOrder"
      />

      <v-switch label="Active" v-model="form.active" />

      <v-btn color="primary" @click="save">Save</v-btn>
      <v-btn @click="$emit('close')">Cancel</v-btn>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from "vue";
import { createContent, updateContent } from "@/api/cms";

const props = defineProps(["contentItem"]);
const emit = defineEmits(["close", "saved"]);

const dialog = ref(true);

const form = ref({
  title: "",
  description: "",
  type: "",
  page: "HOME",
  displayOrder: 1,
  active: true,
});

const types = [
  "HOME_BANNER",
  "FEATURED_SECTION",
  "PAGE",
  "ARTICLE",
  "PROMOTION",
  "HEADER",
  "FOOTER",
];

watch(
  () => props.contentItem,
  (c) => {
    if (c) form.value = { ...c };
  },
  { immediate: true }
);

const save = async () => {
  if (props.contentItem) {
    await updateContent(props.contentItem.id, form.value);
  } else {
    await createContent(form.value);
  }

  emit("saved");
  emit("close");
};
</script>
