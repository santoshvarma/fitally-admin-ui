<template>
  <v-container>
    <v-card class="pa-6 mx-auto" max-width="400">
      <v-text-field label="Email" v-model="email" />
      <v-text-field label="Password" type="password" v-model="password" />
      <v-btn block color="primary" @click="login">Login</v-btn>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const email = ref("");
const password = ref("");
const auth = useAuthStore();
const router = useRouter();

const login = async () => {
  try {
    await auth.login(email.value, password.value);
    router.push("/"); // ✔ correct (resolves to /admin/)
  } catch (err) {
    console.error("Login failed", err);
    alert("Invalid credentials");
  }
};
</script>
