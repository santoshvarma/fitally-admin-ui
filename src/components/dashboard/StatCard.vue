<template>
  <v-card class="pa-4">
    <v-row align="center">
      <v-icon size="40">{{ icon }}</v-icon>
      <v-col>
        <h3>{{ value }}</h3>
        <p>{{ title }}</p>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup>
defineProps(["title", "value", "icon"]);
</script>
