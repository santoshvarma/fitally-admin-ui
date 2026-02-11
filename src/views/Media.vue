<script setup>
import {ref, onMounted, watch, onBeforeUnmount, computed} from "vue";
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
  updateMedia,
} from "@/api/media";
import { generateExerciseImages, regenerateMediaImage, streamAiJob } from "@/api/ai";

/* ---------------------------------------
   Route & State
--------------------------------------- */
const route = useRoute();
const exerciseId = route.params.exerciseId;

const media = ref([]);
const loading = ref(false);
const showDialog = ref(false);
const showAiDialog = ref(false);
const aiLoading = ref(false);
const aiEditDialog = ref(false);
const aiEditLoading = ref(false);
const aiEditInstructions = ref("");
const aiEditOriginalPrompt = ref("");
const aiEditTarget = ref(null);
const aiEditValid = computed(() => !!aiEditInstructions.value.trim());
const aiJobStatus = ref(null);
const aiJobController = ref(null);
const aiJobRetryTimeout = ref(null);

/* ---------------------------------------
   Add Media Dialog State
--------------------------------------- */
const type = ref("IMAGE");
const title = ref("");
const description = ref(""); // HTML
const file = ref(null);
const url = ref("");
const category = ref("");
const sortOrder = ref(null);
const saving = ref(false);
const deleteDialog = ref(false);
const mediaToDelete = ref(null);
const editing = ref(false);
const editTarget = ref(null);

const snackbar = ref(false);
const snackbarText = ref("");
const snackbarColor = ref("success");

const showSnackbar = (message, color = "success") => {
  snackbarText.value = message;
  snackbarColor.value = color;
  snackbar.value = true;
};

const groupedMedia = computed(() => {
  const groups = new Map();
  media.value.forEach((item) => {
    const key = item.category || "UNCATEGORIZED";
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key).push(item);
  });
  const priority = {
    FOCUS_AREA: 0,
    DEMO: 1,
    COMMON_MISTAKE: 2,
    SAFETY_TIP: 3,
  };
  return Array.from(groups.entries())
    .sort(([a], [b]) => {
      const rankA = priority[a] ?? 999;
      const rankB = priority[b] ?? 999;
      if (rankA !== rankB) return rankA - rankB;
      return a.localeCompare(b);
    })
    .map(([category, items]) => {
      const sortedItems = [...items].sort((a, b) => {
        const orderA = typeof a.sortOrder === "number" ? a.sortOrder : 9999;
        const orderB = typeof b.sortOrder === "number" ? b.sortOrder : 9999;
        if (orderA !== orderB) return orderA - orderB;
        return (a.title || "").localeCompare(b.title || "");
      });
      return {
        category,
        items: sortedItems,
      };
    });
});

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
const loadMedia = async ({ notify = false } = {}) => {
  loading.value = true;
  try {
    const res = await getMediaByExercise(exerciseId);
    const payload = res.data;
    media.value = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.content)
        ? payload.content
        : [];
    if (notify) {
      showSnackbar("Media loaded");
    }
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
    if (editing.value && editTarget.value) {
      await updateMedia(editTarget.value.id, {
        title: title.value,
        description: description.value,
        url: url.value,
        sortOrder: sortOrder.value,
        type: type.value,
        category: category.value || null,
      });
    } else {
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
    }

    resetForm();
    showDialog.value = false;
    loadMedia({ notify: false });
    showSnackbar("Media saved");
  } finally {
    saving.value = false;
  }
};

/* ---------------------------------------
   Delete Media
--------------------------------------- */
const removeMedia = (media) => {
  mediaToDelete.value = media;
  deleteDialog.value = true;
};

const confirmDelete = async () => {
  try {
    await deleteMedia(mediaToDelete.value.id);
    showSnackbar("Media deleted successfully");
    loadMedia({ notify: false });
  } catch (e) {
    showSnackbar("Failed to delete media", "error");
  } finally {
    deleteDialog.value = false;
    mediaToDelete.value = null;
  }
};

const startAiGeneration = async () => {
  if (aiLoading.value) return;

  aiLoading.value = true;
  try {
    const res = await generateExerciseImages(exerciseId);
    const jobId = res.data?.jobId;
    showSnackbar(res.data?.message || "AI image generation started");
    if (jobId) {
      startAiStream(jobId);
    }
    showAiDialog.value = false;
  } catch (e) {
    showSnackbar("Failed to start AI image generation", "error");
  } finally {
    aiLoading.value = false;
  }
};

const extractImagePrompt = (item) => {
  const meta = item?.metadata;
  if (meta && typeof meta === "string") {
    try {
      const parsed = JSON.parse(meta);
      return parsed?.imagePrompt || parsed?.image_prompt || "";
    } catch {
      return "";
    }
  }
  return (
    meta?.imagePrompt ||
    meta?.image_prompt ||
    item?.imagePrompt ||
    ""
  );
};

const openAiEdit = (item) => {
  aiEditTarget.value = item;
  aiEditOriginalPrompt.value = extractImagePrompt(item);
  aiEditInstructions.value = aiEditOriginalPrompt.value;
  aiEditDialog.value = true;
};

const submitAiEdit = async () => {
  if (aiEditLoading.value || !aiEditTarget.value) return;
  if (!aiEditValid.value) return;

  aiEditLoading.value = true;
  try {
    const instructions = aiEditInstructions.value.trim();
    const res = await regenerateMediaImage(aiEditTarget.value.id, {
      imagePrompt: instructions,
    });
    const jobId = res.data?.jobId;
    showSnackbar(res.data?.message || "AI image regeneration started");
    if (jobId) {
      startAiStream(jobId);
    }
    aiEditDialog.value = false;
  } catch (e) {
    showSnackbar("Failed to start AI regeneration", "error");
  } finally {
    aiEditLoading.value = false;
  }
};

const isTerminalState = (state) =>
  ["COMPLETED", "COMPLETED_WITH_ERRORS", "FAILED", "CANCELLED"].includes(state);

const aiStatusType = computed(() => {
  if (!aiJobStatus.value?.state) return "info";
  if (aiJobStatus.value.state === "COMPLETED") return "success";
  if (aiJobStatus.value.state === "COMPLETED_WITH_ERRORS") return "warning";
  if (aiJobStatus.value.state === "FAILED") return "error";
  return "info";
});

const startAiStream = (jobId) => {
  aiJobController.value?.abort();
  if (aiJobRetryTimeout.value) {
    clearTimeout(aiJobRetryTimeout.value);
    aiJobRetryTimeout.value = null;
  }
  aiJobController.value = new AbortController();
  console.info("[AI SSE] Media stream start", { jobId });
  streamAiJob(jobId, {
    signal: aiJobController.value.signal,
    onMessage: (data) => {
      aiJobStatus.value = data;
      console.info("[AI SSE] Media status update", data);
      if (isTerminalState(data?.state)) {
        aiJobController.value?.abort();
      }
    },
    onError: () => {
      console.error("[AI SSE] Media stream error");
      showSnackbar("AI status stream disconnected", "error");
      if (!isTerminalState(aiJobStatus.value?.state)) {
        aiJobRetryTimeout.value = setTimeout(() => {
          startAiStream(jobId);
        }, 2000);
      }
    },
  }).catch(() => {});
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
  category.value = "";
  sortOrder.value = null;
  editing.value = false;
  editTarget.value = null;
  editor.commands.clearContent();
};

const openEdit = (item) => {
  editing.value = true;
  editTarget.value = item;
  type.value = item.type || "IMAGE";
  title.value = item.title || "";
  description.value = item.description || "";
  url.value = item.url || "";
  category.value = item.category || "";
  sortOrder.value =
    typeof item.sortOrder === "number" ? item.sortOrder : null;
  file.value = null;
  editor.commands.setContent(item.description || "");
  showDialog.value = true;
};
const getYoutubeEmbed = (videoUrl) => {
  if (!videoUrl) return "";
  const id = videoUrl.includes("v=")
    ? videoUrl.split("v=")[1].split("&")[0]
    : videoUrl.split("/").pop();
  return `https://www.youtube.com/embed/${id}`;
};

const isAiUrl = (value) => value?.startsWith("ai://");
const isAiPending = (item) => isAiUrl(item?.url);

watch(showDialog, (val) => {
  if (!val) editor.commands.clearContent();
});

onMounted(loadMedia);
onBeforeUnmount(() => {
  aiJobController.value?.abort();
  if (aiJobRetryTimeout.value) {
    clearTimeout(aiJobRetryTimeout.value);
  }
  editor.destroy();
});
</script>

<template>
  <v-snackbar
    v-model="snackbar"
    :color="snackbarColor"
    timeout="3000"
  >
    {{ snackbarText }}
  </v-snackbar>

  <v-card>
    <!-- HEADER -->
    <v-card-title class="d-flex align-center">
      <span class="text-h6">
        <v-icon start>mdi-image-multiple</v-icon>
        Exercise Media
      </span>

      <v-spacer/>

      <v-tooltip text="Refresh Media" location="top">
        <template #activator="{ props }">
          <v-btn v-bind="props" icon @click="loadMedia({ notify: true })">
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </template>
      </v-tooltip>
      <v-tooltip text="Generate AI Images" location="top">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            icon
            color="secondary"
            class="ml-2"
            @click="showAiDialog = true"
          >
            <v-icon>mdi-robot-outline</v-icon>
          </v-btn>
        </template>
      </v-tooltip>
      <v-btn color="primary" class="ml-2" @click="showDialog = true">
        <v-icon start>mdi-plus</v-icon>
        Add Media
      </v-btn>
    </v-card-title>

    <v-alert
      v-if="aiJobStatus"
      :type="aiStatusType"
      variant="tonal"
      class="mx-4 my-2"
    >
      <div class="text-body-2">
        AI Status: {{ aiJobStatus.state }} ({{ aiJobStatus.completed ?? 0 }}/{{ aiJobStatus.total ?? 0 }})
      </div>
      <div class="text-caption">{{ aiJobStatus.message }}</div>
    </v-alert>

    <v-divider/>

    <!-- MEDIA GRID -->
    <v-card-text>
      <div v-if="media.length">
        <div v-for="group in groupedMedia" :key="group.category" class="mb-6">
          <div class="d-flex align-center mb-3">
            <div class="text-subtitle-1 font-weight-medium">
              {{ group.category }}
            </div>
            <v-divider class="ml-4" />
          </div>
          <v-row>
            <v-col
              v-for="m in group.items"
              :key="m.id"
              cols="12"
              sm="6"
              md="4"
            >
              <v-card rounded="lg" elevation="4">
                <v-img
                  v-if="m.type === 'IMAGE' && !isAiPending(m)"
                  :src="m.url"
                  height="200"
                  contain
                />
                <div
                  v-else-if="m.type === 'IMAGE' && isAiPending(m)"
                  class="ai-placeholder"
                >
                  <div class="text-caption">AI image not generated yet</div>
                  <v-chip size="small" color="orange" variant="tonal" class="mt-2">
                    Needs AI generation
                  </v-chip>
                </div>

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
                  <v-tooltip text="Edit Media" location="top">
                    <template #activator="{ props }">
                      <v-btn v-bind="props" icon @click="openEdit(m)">
                        <v-icon>mdi-pencil</v-icon>
                      </v-btn>
                    </template>
                  </v-tooltip>
                  <v-tooltip text="AI Regenerate" location="top">
                    <template #activator="{ props }">
                      <v-btn v-bind="props" icon @click="openAiEdit(m)">
                        <v-icon>mdi-robot-outline</v-icon>
                      </v-btn>
                    </template>
                  </v-tooltip>
                  <v-btn icon color="red" @click="removeMedia(m)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </div>

      <v-alert v-else type="info" variant="tonal">
        No media added yet. Click <b>Add Media</b> to get started.
      </v-alert>
    </v-card-text>

    <!-- ADD MEDIA DIALOG -->
    <v-dialog v-model="showDialog" max-width="600" :persistent="saving">
      <v-card>
        <v-card-title>{{ editing ? "Edit Media" : "Add Media" }}</v-card-title>

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
          <v-text-field
            label="Sort Order"
            type="number"
            min="0"
            v-model="sortOrder"
            class="mb-4"
          />
          <v-select
            label="Category"
            :items="['DEMO', 'COMMON_MISTAKE', 'SAFETY_TIP']"
            v-model="category"
            clearable
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
            <div
              v-if="editing && type === 'IMAGE' && url && !isAiUrl(url)"
              class="mb-4"
            >
              <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                Current Image
              </label>
              <v-img :src="url" height="160" cover />
            </div>
            <v-file-input
              v-if="type === 'IMAGE' || type === 'AUDIO'"
              label="Select File"
              v-model="file"
              prepend-icon="mdi-paperclip"
              variant="outlined"
              :disabled="editing"
            />

            <div v-if="editing && type === 'VIDEO' && url" class="mb-4">
              <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                Current Video
              </label>
              <iframe
                :src="getYoutubeEmbed(url)"
                width="100%"
                height="160"
                frameborder="0"
                allowfullscreen
              />
            </div>
            <v-text-field
              v-if="type === 'VIDEO'"
              label="YouTube URL"
              v-model="url"
              prepend-icon="mdi-youtube"
              variant="outlined"
              :disabled="editing"
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
  <v-dialog v-model="showAiDialog" max-width="480">
    <v-card>
      <v-card-title>Generate AI Images</v-card-title>
      <v-card-text>
        This will generate and update all the images in this exercise.
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn variant="text" @click="showAiDialog = false">Cancel</v-btn>
        <v-btn color="primary" :loading="aiLoading" @click="startAiGeneration">
          Start
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="aiEditDialog" max-width="520">
    <v-card>
      <v-card-title>Regenerate Media Image</v-card-title>
      <v-card-text>
        <div class="text-body-2 mb-3">
          Update the image prompt for this media item.
        </div>
        <v-textarea
          label="Image Prompt"
          rows="3"
          v-model="aiEditInstructions"
        />
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn variant="text" @click="aiEditDialog = false">Cancel</v-btn>
        <v-btn
          color="primary"
          :loading="aiEditLoading"
          :disabled="!aiEditValid"
          @click="submitAiEdit"
        >
          Start
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
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
.ai-placeholder {
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #e0e0e0;
  color: #666;
}
</style>
