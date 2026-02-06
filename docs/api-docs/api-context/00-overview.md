FitAlly Backend Context
========================

This document captures the current backend context for FitAlly so admin console and
mobile app teams can use it to build screens and data flows.

Project Summary
---------------
- Stack: Spring Boot (Java 17), PostgreSQL, Flyway, JWT, Cloudinary (images), YouTube URLs (video).
- Model is fully dynamic; content is admin-managed and reusable.
- Two content systems:
  - Fitness content: workouts, exercises, media, programs.
  - CMS/AppContent: dynamic UI content for app pages.

Core Concepts
-------------
- Exercise: base unit (e.g., yoga asana, dumbbell, equipment exercise).
- Workout: ordered collection of exercises.
- Program: collection of workouts mapped to days (e.g., 21-day, fat reduction).
- CMS content: banners, featured sections, pages, promotions, articles.

Data Model (Entities)
---------------------
Fitness content
- Workout
  - category, difficulty, equipmentType, equipmentRequired, active
  - 1..n WorkoutExercise (ordered by sortOrder)
- Exercise
  - title, description, equipmentType, category, active
  - 1..n Media
- Media
  - title, description, url, type (IMAGE, VIDEO, AUDIO), metadata (jsonb)
- Program
  - title, category, goal, durationDays, description, active
  - 1..n ProgramWorkout
- ProgramWorkout
  - program, workout, dayNumber

CMS content
- AppContent
  - title, description, type (ContentType), page, displayOrder, active
  - 1..n AppContentMedia
- AppContentMedia
  - title, description, url, type (IMAGE, VIDEO), metadata (jsonb)

User and Security
- User, Role, RefreshToken.
- Audit: Auditable fields (createdBy, updatedBy, updatedAt) on all entities.
- Sanitization: fields annotated with @Sanitized are cleaned via Jsoup.

Enums / Controlled Vocabulary
------------------------------
Fitness
- FitnessCategory (GYM, YOGA, PILATES, MEDITATION, HIIT, ZUMBA)
- GoalType (MUSCLE_GAIN, FAT_LOSS, FLEXIBILITY, STRESS_RELIEF, SLEEP, ASTHMA)
- EquipmentType (DUMBBELL, BARBELL, KETTLEBELL, MACHINE, BODYWEIGHT, HOME, NONE)
- DifficultyLevel (BEGINNER, INTERMEDIATE, ADVANCED)
- MediaType (IMAGE, VIDEO, AUDIO)

CMS
- ContentType (HOME_BANNER, FEATURED_SECTION, PAGE, ARTICLE, PROMOTION, HEADER, FOOTER)

User
- RoleName, UserStatus

API Map (Current Routes)
-------------------------
Auth
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/refresh

Health
- GET /api/health

Exercises
- POST /api/exercises
- GET /api/exercises
- GET /api/exercises/{exerciseId}
- GET /api/exercises/workout/{workoutId}
- PUT /api/exercises/{id}
- DELETE /api/exercises/{id}

Workouts
- POST /api/workouts
- GET /api/workouts
- GET /api/workouts/{id}
- PUT /api/workouts/{id}
- DELETE /api/workouts/{id}
- GET /api/workouts/search?category=&equipment=&difficulty=

Programs
- POST /api/programs
- GET /api/programs
- GET /api/programs/{id}
- PUT /api/programs/{id}
- DELETE /api/programs/{id}
- GET /api/programs/search?category=&goal=

Program Workouts
- POST /api/program-workouts?programId=&workoutId=&dayNumber=
- GET /api/program-workouts/program/{programId}
- DELETE /api/program-workouts/{id}

Exercise Media
- POST /api/media/exercise/{exerciseId}
- GET /api/media/exercise/{exerciseId}

Admin Media Uploads
- POST /api/admin/media/image/exercise/{exerciseId} (multipart: file, title, description)
- POST /api/admin/media/video/exercise/{exerciseId} (params: youtubeUrl, title, description)
- DELETE /api/admin/media/{id}

CMS Content
- POST /api/content
- GET /api/content?page=
- GET /api/content/{id}
- PUT /api/content/{id}
- DELETE /api/content/{id}

CMS Media
- POST /api/content-media/content/{contentId}
- GET /api/content-media/content/{contentId}
- DELETE /api/content-media/{id}
- POST /api/content-media/image/content/{contentId} (multipart: file, title)

AdminController (Note)
-----------------------
AdminController is mapped at /api/admin, but its endpoints also include /api/admin
in method mappings, so the effective path is:
- POST /api/admin/api/admin/content
- POST /api/admin/api/admin/content/{id}/media
- POST /api/admin/api/admin/programs
- POST /api/admin/api/admin/programs/{id}/workouts

Auth and Access Rules (Current Behavior)
----------------------------------------
- SecurityFilter requires a Bearer token for all endpoints except:
  - /api/auth/**
  - /api/health
- SecurityConfig also permits public GET /api/**, but the filter still blocks
  unauthenticated calls. This means GET endpoints currently require a token.

Pagination and Sorting
----------------------
List endpoints support pagination and sorting:
- pageNumber (default 0)
- pageSize (default 20)
- sortBy (default varies by endpoint)
- sortDir (asc or desc, default asc)

Note: /api/content uses `page` for the CMS page name, so pagination uses
pageNumber/pageSize on that endpoint as well.

Request/Response Shapes (Key)
-----------------------------
Workout create/update uses WorkoutRequest:
- title, description, category, difficulty, equipmentType, equipmentRequired, active
- exerciseIds: ordered list of UUIDs

WorkoutResponse includes:
- workout fields
- exercises: list of ExerciseSummary (id, title) ordered by sortOrder

Media metadata:
- Cloudinary uploads store provider and image-id in jsonb metadata

