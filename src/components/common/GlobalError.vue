<script setup>
import { useErrorStore } from "@/stores/error";

const errorStore = useErrorStore();
</script>

<template>
  <v-snackbar
    v-model="errorStore.message"
    color="error"
    timeout="5000"
    location="top"
  >
    {{ errorStore.message }}

    <template #actions>
      <v-btn icon @click="errorStore.clear">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>
