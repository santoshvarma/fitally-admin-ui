<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import { Editor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";

import {
  getContentMedia,
  createContentMedia,
  deleteContentMedia,
  uploadContentImage,
} from "@/api/cms";

const route = useRoute();
const contentId = route.params.contentId;

const media = ref([]);
const loading = ref(false);
const showDialog = ref(false);
const saving = ref(false);

const page = ref(1);
const itemsPerPage = ref(12);
const totalItems = ref(0);
const sortBy = ref([]);

const type = ref("IMAGE");
const title = ref("");
const description = ref("");
const file = ref(null);
const url = ref("");

const deleteDialog = ref(false);
const mediaToDelete = ref(null);

const snackbar = ref(false);
const snackbarText = ref("");
const snackbarColor = ref("success");

const editor = new Editor({
  extensions: [
    StarterKit,
    Link.configure({ openOnClick: false }),
    TextStyle,
    Color,
  ],
  content: "",
  onUpdate({ editor }) {
    description.value = editor.getHTML();
  },
});

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

const loadMedia = async ({ notify = false } = {}) => {
  loading.value = true;
  try {
    const res = await getContentMedia(contentId, {
      pageNumber: page.value - 1,
      pageSize: itemsPerPage.value,
      ...getSortParams(),
    });
    const list = Array.isArray(res.data?.content)
      ? res.data.content
      : Array.isArray(res.data)
        ? res.data
        : [];
    media.value = list;
    totalItems.value =
      typeof res.data?.totalElements === "number"
        ? res.data.totalElements
        : list.length;
    if (notify) {
      showSnackbar("Media loaded");
    }
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  type.value = "IMAGE";
  title.value = "";
  description.value = "";
  file.value = null;
  url.value = "";
  editor.commands.clearContent();
};

const saveMedia = async () => {
  if (saving.value) return;
  saving.value = true;
  try {
    if (type.value === "IMAGE" && file.value) {
      const formData = new FormData();
      formData.append("file", file.value);
      formData.append("title", title.value);
      await uploadContentImage(contentId, formData);
    } else {
      await createContentMedia(contentId, {
        title: title.value,
        description: description.value,
        url: url.value,
        type: type.value,
      });
    }

    resetForm();
    showDialog.value = false;
    await loadMedia({ notify: false });
    showSnackbar("Media saved");
  } finally {
    saving.value = false;
  }
};

const removeMedia = (item) => {
  mediaToDelete.value = item;
  deleteDialog.value = true;
};

const confirmDelete = async () => {
  try {
    await deleteContentMedia(mediaToDelete.value.id);
    showSnackbar("Media deleted successfully");
    await loadMedia({ notify: false });
  } catch (e) {
    showSnackbar("Failed to delete media", "error");
  } finally {
    deleteDialog.value = false;
    mediaToDelete.value = null;
  }
};

const getYoutubeEmbed = (videoUrl) => {
  if (!videoUrl) return "";
  const id = videoUrl.includes("v=")
    ? videoUrl.split("v=")[1].split("&")[0]
    : videoUrl.split("/").pop();
  return `https://www.youtube.com/embed/${id}`;
};

const onPageChange = (value) => {
  page.value = value;
  loadMedia();
};

const refresh = () => {
  loadMedia({ notify: true });
};

watch(showDialog, (val) => {
  if (!val) editor.commands.clearContent();
});

onMounted(() => loadMedia({ notify: false }));
onBeforeUnmount(() => editor.destroy());
</script>

<template>
  <v-snackbar
    v-model="snackbar"
    :color="snackbarColor"
    timeout="3000"
  >
    {{ snackbarText }}
  </v-snackbar>

  <v-container fluid>
    <v-card>
      <v-card-title class="d-flex align-center">
        <span class="text-h6">
          <v-icon>mdi-image-multiple</v-icon>
          CMS Media
        </span>

        <v-spacer />

        <v-tooltip text="Refresh Media" location="top">
          <template #activator="{ props }">
            <v-btn v-bind="props" icon @click="refresh" :loading="loading">
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </template>
        </v-tooltip>

        <v-btn color="primary" class="ml-2" @click="showDialog = true">
          Add Media
        </v-btn>
      </v-card-title>

    <v-divider />

    <v-card-text>
      <v-row v-if="media.length">
        <v-col
          v-for="m in media"
          :key="m.id"
          cols="12"
          sm="6"
          md="4"
        >
          <v-card rounded="lg" elevation="4">
            <v-img
              v-if="m.type === 'IMAGE'"
              :src="m.url"
              height="200"
              cover
            />

            <iframe
              v-if="m.type === 'VIDEO'"
              :src="getYoutubeEmbed(m.url)"
              width="100%"
              height="200"
              frameborder="0"
              allowfullscreen
            />

            <v-card-title class="text-subtitle-1">
              {{ m.title }}
            </v-card-title>

            <v-card-subtitle v-html="m.description" />

            <v-card-actions>
              <v-spacer />
              <v-btn icon color="red" @click="removeMedia(m)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <v-alert v-else type="info" variant="tonal">
        No media added yet. Click <b>Add Media</b> to get started.
      </v-alert>
    </v-card-text>

    <v-card-actions class="justify-end">
      <v-pagination
        v-if="totalItems > itemsPerPage"
        v-model="page"
        :length="Math.ceil(totalItems / itemsPerPage)"
        @update:modelValue="onPageChange"
      />
    </v-card-actions>

    <v-dialog v-model="showDialog" max-width="600" :persistent="saving">
      <v-card>
        <v-card-title>Add Media</v-card-title>

        <v-card-text>
          <v-select
            label="Media Type"
            :items="['IMAGE', 'VIDEO']"
            v-model="type"
            class="mb-4"
          />

          <v-text-field
            label="Title"
            v-model="title"
            class="mb-4"
          />

          <div class="mb-6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Description
            </label>

            <div class="editor-toolbar mb-2">
              <v-btn size="small" icon @click="editor.chain().focus().toggleBold().run()">
                <v-icon>mdi-format-bold</v-icon>
              </v-btn>
              <v-btn size="small" icon @click="editor.chain().focus().toggleItalic().run()">
                <v-icon>mdi-format-italic</v-icon>
              </v-btn>
              <v-btn size="small" icon @click="editor.chain().focus().toggleBulletList().run()">
                <v-icon>mdi-format-list-bulleted</v-icon>
              </v-btn>
              <v-btn
                size="small"
                icon
                @click="editor.chain().focus().setLink({ href: prompt('Enter URL') }).run()"
              >
                <v-icon>mdi-link</v-icon>
              </v-btn>
            </div>

            <div class="tiptap-wrapper">
              <EditorContent :editor="editor" />
            </div>
          </div>

          <div class="mt-6">
            <v-file-input
              v-if="type === 'IMAGE'"
              label="Select Image"
              v-model="file"
              prepend-icon="mdi-paperclip"
              variant="outlined"
            />

            <v-text-field
              v-else
              label="Media URL"
              v-model="url"
              prepend-icon="mdi-link-variant"
              variant="outlined"
            />
          </div>
        </v-card-text>

        <v-card-actions>
          <v-btn text @click="showDialog = false">Cancel</v-btn>
          <v-btn
            color="primary"
            :loading="saving"
            :disabled="saving"
            @click="saveMedia"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    </v-card>
  </v-container>

  <v-dialog v-model="deleteDialog" max-width="400">
    <v-card>
      <v-card-title class="text-h6">
        Confirm Delete
      </v-card-title>

      <v-card-text>
        Are you sure you want to delete
        <b>{{ mediaToDelete?.title }}</b>?
        <br />
        This action cannot be undone.
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn text @click="deleteDialog = false">Cancel</v-btn>
        <v-btn color="red" @click="confirmDelete">
          Delete
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
</style>
