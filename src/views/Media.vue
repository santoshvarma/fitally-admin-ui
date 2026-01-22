<template>
  <v-container>
    <h2>Media for Exercise</h2>

    <v-row>
      <v-col cols="6">
        <h3>Upload Image</h3>
        <v-file-input label="Select Image" v-model="imageFile" />
        <v-text-field label="Title" v-model="imageTitle" />
        <v-textarea label="Description" v-model="imageDesc" />
        <v-btn color="primary" @click="uploadImageFile">Upload</v-btn>
      </v-col>

      <v-col cols="6">
        <h3>Add YouTube Video</h3>
        <v-text-field label="YouTube URL" v-model="videoUrl" />
        <v-text-field label="Title" v-model="videoTitle" />
        <v-textarea label="Description" v-model="videoDesc" />
        <v-btn color="primary" @click="addVideo">Add Video</v-btn>
      </v-col>
    </v-row>

    <v-divider class="my-6" />

    <h3>Existing Media</h3>

    <v-row>
      <v-col v-for="m in media" :key="m.id" cols="4">
        <v-card>
          <v-img v-if="m.type === 'IMAGE'" :src="m.url" height="200" />
          <iframe
            v-if="m.type === 'VIDEO'"
            :src="getYoutubeEmbed(m.url)"
            width="100%"
            height="200"
          ></iframe>

          <v-card-title>{{ m.title }}</v-card-title>
          <v-card-subtitle>{{ m.description }}</v-card-subtitle>

          <v-btn color="red" @click="removeMedia(m.id)">Delete</v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import {
  getMediaByExercise,
  uploadImage,
  addYoutubeVideo,
  deleteMedia,
} from "@/api/media";

const route = useRoute();
const exerciseId = route.params.exerciseId;

const media = ref([]);

const imageFile = ref(null);
const imageTitle = ref("");
const imageDesc = ref("");

const videoUrl = ref("");
const videoTitle = ref("");
const videoDesc = ref("");

const loadMedia = async () => {
  const res = await getMediaByExercise(exerciseId);
  media.value = res.data;
};

const uploadImageFile = async () => {
  const formData = new FormData();
  formData.append("file", imageFile.value);
  formData.append("title", imageTitle.value);
  formData.append("description", imageDesc.value);

  await uploadImage(exerciseId, formData);
  loadMedia();
};

const addVideo = async () => {
  await addYoutubeVideo(exerciseId, {
    youtubeUrl: videoUrl.value,
    title: videoTitle.value,
    description: videoDesc.value,
  });
  loadMedia();
};

const removeMedia = async (id) => {
  await deleteMedia(id);
  loadMedia();
};

const getYoutubeEmbed = (url) => {
  const id = url.split("v=")[1];
  return `https://www.youtube.com/embed/${id}`;
};

onMounted(loadMedia);
</script>
