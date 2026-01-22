<template>
  <v-app>
    <Sidebar />

    <v-main>
      <TopBar />
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import Sidebar from "@/components/layout/Sidebar.vue";
import TopBar from "@/components/layout/TopBar.vue";
</script>
