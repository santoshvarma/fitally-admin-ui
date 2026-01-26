<template>
  <v-container
    fluid
    class="d-flex align-center justify-center fill-height"
  >
    <v-card
      class="pa-8 pt-2"
      max-width="420"
      width="100%"
      elevation="10"
      rounded="xl"
    >
      <!-- Logo -->
      <div class="text-center">
        <v-img
          src="@/assets/logo.png"
          max-width="200"
          class="mx-auto"
          contain
        />
      </div>

      <!-- FORM -->
      <v-form ref="form" @submit.prevent="login">
        <v-text-field
          v-model="email"
          label="Email"
          type="email"
          prepend-inner-icon="mdi-email"
          variant="outlined"
          :rules="emailRules"
          required
        />

        <v-text-field
          v-model="password"
          label="Password"
          :type="showPassword ? 'text' : 'password'"
          prepend-inner-icon="mdi-lock"
          :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
          variant="outlined"
          :rules="passwordRules"
          required
          @click:append-inner="showPassword = !showPassword"
        />

        <v-btn
          type="submit"
          color="primary"
          size="large"
          block
          class="mt-6"
          :loading="loading"
        >
          Login
        </v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const auth = useAuthStore();

const email = ref("");
const password = ref("");
const showPassword = ref(false);
const loading = ref(false);

const form = ref(null);

/**
 * Validation rules
 */
const emailRules = [
  (v) => !!v || "Email is required",
  (v) => /.+@.+\..+/.test(v) || "Email must be valid",
];

const passwordRules = [
  (v) => !!v || "Password is required",
  (v) => v.length >= 6 || "Minimum 6 characters",
];

/**
 * Login handler
 */
const login = async () => {
  const { valid } = await form.value.validate();
  if (!valid) return;

  try {
    loading.value = true;
    await auth.login(email.value, password.value);
    router.push("/");
  } catch (err) {
    console.error("Login failed", err);
    alert("Invalid credentials");
  } finally {
    loading.value = false;
  }
};
</script>
