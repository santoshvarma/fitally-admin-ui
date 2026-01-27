<template>
  <v-app>
    <Sidebar />

    <v-main>
      <TopBar />
      <GlobalError />
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import Sidebar from "@/components/layout/Sidebar.vue";
import TopBar from "@/components/layout/TopBar.vue";
import GlobalError from "@/components/common/GlobalError.vue";
</script>
