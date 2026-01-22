<template>
  <v-container>
    <v-card class="pa-6 mx-auto" max-width="400">
      <v-text-field label="Username" v-model="username" />
      <v-text-field label="Password" type="password" v-model="password" />
<!--      <v-btn block color="primary" @click="login">Login</v-btn>-->
      <v-btn block color="primary" @click="goToHome">Login</v-btn>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";

const username = ref("");
const password = ref("");
const auth = useAuthStore();

const login = async () => {
  await auth.login(username.value, password.value);
  window.location.href = "/";
};

const goToHome = () => {
  router.push("/");
};
</script>
