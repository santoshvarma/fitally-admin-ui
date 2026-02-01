import { createRouter, createWebHistory } from "vue-router";

import Login from "@/views/Login.vue";
import Dashboard from "@/views/Dashboard.vue";
import Workouts from "@/views/Workouts.vue";
import Exercises from "@/views/Exercises.vue";
import Media from "@/views/Media.vue";
import Programs from "@/views/Programs.vue";
import ProgramBuilder from "@/views/ProgramBuilder.vue";
import CMS from "@/views/CMS.vue";

import AdminLayout from "@/layouts/AdminLayout.vue";
import {useErrorStore} from "@/stores/error.js";

const routes = [
  {
    path: "/login",
    component: Login,
  },

  {
    path: "/",
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      { path: "", component: Dashboard },
      { path: "exercises", component: Exercises },
      { path: "exercises/:exerciseId/media", component: Media },
      { path: "workouts", component: Workouts },
      { path: "workouts/:workoutId/exercises", component: Exercises },
      { path: "programs", component: Programs },
      { path: "programs/:programId/builder", component: ProgramBuilder },
      { path: "cms", component: CMS },
    ],
  },
];

const router = createRouter({
  history: createWebHistory('/admin/'),
  routes,
});

function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}



router.beforeEach((to) => {
  const errorStore = useErrorStore();
  errorStore.clear();

  const token = localStorage.getItem("token");

  if (to.meta.requiresAuth) {
    if (!token || isTokenExpired(token)) {
      localStorage.removeItem("token");
      return "/login";
    }
  }
});


export default router;
