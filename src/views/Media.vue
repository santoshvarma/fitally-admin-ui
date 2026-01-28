<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
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
const type = ref("IMAGE"); // IMAGE | VIDEO | AUDIO
const title = ref("");
const description = ref("");
const file = ref(null);
const url = ref("");

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
};

const getYoutubeEmbed = (videoUrl) => {
  if (!videoUrl) return "";
  const id = videoUrl.includes("v=")
    ? videoUrl.split("v=")[1].split("&")[0]
    : videoUrl.split("/").pop();
  return `https://www.youtube.com/embed/${id}`;
};

onMounted(loadMedia);
</script>

<template>
  <v-card>
    <!-- HEADER -->
    <v-card-title class="d-flex align-center">
      <span class="text-h6">
        <v-icon start>mdi-image-multiple</v-icon>
        Exercise Media
      </span>

      <v-spacer />

      <v-btn color="primary" @click="showDialog = true">
        <v-icon start>mdi-plus</v-icon>
        Add Media
      </v-btn>
    </v-card-title>

    <v-divider />

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
            <!-- IMAGE -->
            <v-img
              v-if="m.type === 'IMAGE'"
              :src="m.url"
              height="200"
              cover
            />

            <!-- VIDEO -->
            <iframe
              v-if="m.type === 'VIDEO'"
              :src="getYoutubeEmbed(m.url)"
              width="100%"
              height="200"
              frameborder="0"
              allowfullscreen
            />

            <!-- AUDIO -->
            <audio
              v-if="m.type === 'AUDIO'"
              controls
              :src="m.url"
              class="w-100"
            />

            <v-card-title class="text-subtitle-1">
              {{ m.title }}
            </v-card-title>

            <v-card-subtitle>
              {{ m.description }}
            </v-card-subtitle>

            <v-card-actions>
              <v-spacer />
              <v-btn
                icon
                color="red"
                @click="removeMedia(m.id)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <!-- EMPTY STATE -->
      <v-alert
        v-else
        type="info"
        variant="tonal"
      >
        No media added yet. Click <b>Add Media</b> to get started.
      </v-alert>
    </v-card-text>

    <!-- ADD MEDIA DIALOG -->
    <v-dialog v-model="showDialog" max-width="600">
      <v-card>
        <v-card-title>Add Media</v-card-title>

        <v-card-text>
          <v-select
            label="Media Type"
            :items="['IMAGE', 'VIDEO', 'AUDIO']"
            v-model="type"
          />

          <v-text-field
            label="Title"
            v-model="title"
          />

          <v-textarea
            label="Description"
            v-model="description"
          />

          <v-file-input
            v-if="type === 'IMAGE' || type === 'AUDIO'"
            label="Select File"
            v-model="file"
          />

          <v-text-field
            v-if="type === 'VIDEO'"
            label="YouTube URL"
            v-model="url"
          />
        </v-card-text>

        <v-card-actions>
          <v-btn text @click="showDialog = false">
            Cancel
          </v-btn>
          <v-btn color="primary" @click="saveMedia">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>
