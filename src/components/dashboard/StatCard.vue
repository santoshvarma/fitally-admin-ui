<template>
  <v-card class="pa-4">
    <v-row align="center" no-gutters>
      <v-icon size="40">{{ icon }}</v-icon>
      <v-col class="pl-4">
        <h3>{{ value }}</h3>
        <p>{{ title }}</p>
      </v-col>
      <v-spacer />
      <v-btn
        variant="text"
        icon="mdi-refresh"
        size="small"
        :loading="loading"
        :disabled="loading"
        @click="emit('refresh')"
      />
    </v-row>
  </v-card>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  value: { type: [String, Number], required: true },
  icon: { type: String, required: true },
  loading: { type: Boolean, default: false },
});

const emit = defineEmits(["refresh"]);
</script>
