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
      { path: "workouts", component: Workouts },
      { path: "workouts/:workoutId/exercises", component: Exercises },
      { path: "exercises/:exerciseId/media", component: Media },
      { path: "programs", component: Programs },
      { path: "programs/:programId/builder", component: ProgramBuilder },
      { path: "cms", component: CMS },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

/*
router.beforeEach((to) => {
  const token = localStorage.getItem("token");
  if (to.meta.requiresAuth && !token) {
    return "/login";
  }
});
*/

export default router;
