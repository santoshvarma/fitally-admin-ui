<script setup>
import {ref, onMounted, watch, onBeforeUnmount} from "vue";
import {useRoute} from "vue-router";
import {Editor, EditorContent} from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import {TextStyle} from "@tiptap/extension-text-style";
import {Color} from "@tiptap/extension-color";


import {
  getMediaByExercise,
  uploadImage,
  addYoutubeVideo,
  deleteMedia,
} from "@/api/media";

/* ---------------------------------------
   Route & State
--------------------------------------- */
const route = useRoute();
const exerciseId = route.params.exerciseId;

const media = ref([]);
const loading = ref(false);
const showDialog = ref(false);

/* ---------------------------------------
   Add Media Dialog State
--------------------------------------- */
const type = ref("IMAGE");
const title = ref("");
const description = ref(""); // HTML
const file = ref(null);
const url = ref("");
const saving = ref(false);


/* ---------------------------------------
   TipTap Editor
--------------------------------------- */
const editor = new Editor({
  extensions: [
    StarterKit,
    Link.configure({
      openOnClick: false,
    }),
    TextStyle,
    Color,
  ],
  content: "",
  onUpdate({editor}) {
    description.value = editor.getHTML();
  },
});

/* ---------------------------------------
   Load Media
--------------------------------------- */
const loadMedia = async () => {
  loading.value = true;
  try {
    const res = await getMediaByExercise(exerciseId);
    media.value = res.data;
  } finally {
    loading.value = false;
  }
};

/* ---------------------------------------
   Save Media
--------------------------------------- */
const saveMedia = async () => {
  if (saving.value) return;

  saving.value = true;
  try {
    if (type.value === "IMAGE" || type.value === "AUDIO") {
      const formData = new FormData();
      formData.append("file", file.value);
      formData.append("title", title.value);
      formData.append("description", description.value);

      await uploadImage(exerciseId, formData);
    }

    if (type.value === "VIDEO") {
      await addYoutubeVideo(exerciseId, {
        youtubeUrl: url.value,
        title: title.value,
        description: description.value,
      });
    }

    resetForm();
    showDialog.value = false;
    loadMedia();
  } finally {
    saving.value = false;
  }
};

/* ---------------------------------------
   Delete Media
--------------------------------------- */
const removeMedia = async (id) => {
  await deleteMedia(id);
  loadMedia();
};

/* ---------------------------------------
   Helpers
--------------------------------------- */
const resetForm = () => {
  type.value = "IMAGE";
  title.value = "";
  description.value = "";
  file.value = null;
  url.value = "";
  editor.commands.clearContent();
};

const getYoutubeEmbed = (videoUrl) => {
  if (!videoUrl) return "";
  const id = videoUrl.includes("v=")
    ? videoUrl.split("v=")[1].split("&")[0]
    : videoUrl.split("/").pop();
  return `https://www.youtube.com/embed/${id}`;
};

watch(showDialog, (val) => {
  if (!val) editor.commands.clearContent();
});

onMounted(loadMedia);
onBeforeUnmount(() => editor.destroy());
</script>

<template>
  <v-card>
    <!-- HEADER -->
    <v-card-title class="d-flex align-center">
      <span class="text-h6">
        <v-icon start>mdi-image-multiple</v-icon>
        Exercise Media
      </span>

      <v-spacer/>

      <v-btn color="primary" @click="showDialog = true">
        <v-icon start>mdi-plus</v-icon>
        Add Media
      </v-btn>
    </v-card-title>

    <v-divider/>

    <!-- MEDIA GRID -->
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

            <audio
              v-if="m.type === 'AUDIO'"
              controls
              :src="m.url"
              class="w-100"
            />

            <v-card-title class="text-subtitle-1">
              {{ m.title }}
            </v-card-title>

            <v-card-subtitle v-html="m.description"/>

            <v-card-actions>
              <v-spacer/>
              <v-btn icon color="red" @click="removeMedia(m.id)">
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

    <!-- ADD MEDIA DIALOG -->
    <v-dialog v-model="showDialog" max-width="600" :persistent="saving">
      <v-card>
        <v-card-title>Add Media</v-card-title>

        <v-card-text>
          <v-select
            label="Media Type"
            :items="['IMAGE', 'VIDEO', 'AUDIO']"
            v-model="type"
            class="mb-4"
          />

          <v-text-field
            label="Title"
            v-model="title"
            class="mb-4"
          />

          <!-- Description Section -->
          <div class="mb-6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Description
            </label>

            <!-- TipTap Toolbar -->
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

            <!-- TipTap Editor -->
            <div class="tiptap-wrapper">
              <EditorContent :editor="editor"/>
            </div>
          </div>

          <!-- File/URL Input Section -->
          <div class="mt-6">
            <v-file-input
              v-if="type === 'IMAGE' || type === 'AUDIO'"
              label="Select File"
              v-model="file"
              prepend-icon="mdi-paperclip"
              variant="outlined"
            />

            <v-text-field
              v-if="type === 'VIDEO'"
              label="YouTube URL"
              v-model="url"
              prepend-icon="mdi-youtube"
              variant="outlined"
            />
          </div>
        </v-card-text>

        <v-card-actions>
          <v-btn text @click="showDialog = false">Cancel</v-btn>
          <v-btn color="primary" :loading="saving" :disabled="saving" @click="saveMedia">{{ saving ? "Saving…" : "Save" }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<style scoped>
</style>
