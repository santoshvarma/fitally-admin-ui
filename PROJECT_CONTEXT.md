# FitAlly Admin UI - Project Context

## Overview
This is the admin UI for FitAlly. It is a Vue 3 + Vite app using Vuetify for UI, Pinia for state, and Vue Router for navigation.

## Tech Stack
- Vue 3 (composition API)
- Vite
- Vuetify
- Pinia
- Vue Router
- Axios
- TipTap (rich text editor for media descriptions)

## App Entry
- App bootstraps in `src/main.js` with router, Pinia, and Vuetify.
- Global styles are imported in `src/styles/global/styles.css` and `src/styles/global/tiptap.css`.

## Routing and Navigation
- Routes live in `src/router/index.js`.
- Router history is created with base path `/admin/`.
- Authenticated routes are children under `AdminLayout`.
- Main routes:
  - `/` Dashboard
  - `/exercises` Exercises list
  - `/exercises/:exerciseId/media` Exercise media manager
  - `/workouts` Workouts list
  - `/workouts/:workoutId/exercises` (currently mapped to Exercises view)
  - `/programs` Programs list
  - `/programs/:programId/builder` Program builder
  - `/cms` CMS content
- Sidebar navigation is in `src/components/layout/Sidebar.vue`.

## Layout and Global UI
- `AdminLayout` wraps the authenticated area with:
  - `Sidebar`
  - `TopBar`
  - `GlobalError` (snackbar-based global error display)
  - `router-view` for page content
- File: `src/layouts/AdminLayout.vue`.

## Auth and Error Flow
- Auth store in `src/stores/auth.js` handles login and token storage in `localStorage`.
- Router guard in `src/router/index.js` checks `localStorage.token` and redirects to `/login` if missing/expired.
- Axios client in `src/api/axios.js`:
  - Adds `Authorization: Bearer <token>` on each request.
  - On `401`, clears token and hard-redirects to `/admin/login`.
  - On `403`, shows a global error.
  - For other errors, shows a global error unless `skipGlobalError` is set on the request.
- Global error UI in `src/components/common/GlobalError.vue` reads from `src/stores/error.js`.

## API Layer
Axios wrapper and API modules live in `src/api/`.
- `src/api/axios.js` creates the client and global interceptors.
- `src/api/workouts.js` CRUD + search for workouts.
- `src/api/exercises.js` CRUD for exercises.
- `src/api/programs.js` CRUD + program workout mapping.
- `src/api/media.js` media upload and management for exercises.
- `src/api/cms.js` CRUD for CMS content and content images.

## Key Views and Responsibilities
- `src/views/Dashboard.vue` shows summary stats (currently static).
- `src/views/Workouts.vue` lists workouts and opens `WorkoutForm` for create/edit.
- `src/views/Exercises.vue` lists exercises, edits, and opens media manager.
- `src/views/Media.vue` manages exercise media with TipTap editor.
- `src/views/Programs.vue` lists programs and opens `ProgramForm`.
- `src/views/ProgramBuilder.vue` assigns workouts to program days.
- `src/views/CMS.vue` manages CMS content per page.
- `src/views/Login.vue` handles auth and stores token via `useAuthStore`.

## Conventions and Notes
- Components and forms typically live under `src/components/` and are shown via dialogs in list views.
- Token storage is client-side only; no refresh token flow in the UI.
- Base URL for API requests is `VITE_API_BASE_URL` (see `src/api/axios.js`).

