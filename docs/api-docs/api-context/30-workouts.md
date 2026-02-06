Workouts
--------
POST /api/workouts
Request:
```json
{
  "title": "Chest Workout",
  "description": "Gym chest routine",
  "category": "GYM",
  "difficulty": "INTERMEDIATE",
  "equipmentType": "MACHINE",
  "equipmentRequired": true,
  "active": true,
  "exerciseIds": [
    "exercise-uuid-1",
    "exercise-uuid-2"
  ]
}
```
Response:
```json
{
  "id": "uuid",
  "title": "Chest Workout",
  "description": "Gym chest routine",
  "category": "GYM",
  "difficulty": "INTERMEDIATE",
  "equipmentType": "MACHINE",
  "equipmentRequired": true,
  "active": true,
  "workoutExercises": [
    {
      "id": 1,
      "sortOrder": 0
    }
  ]
}
```

GET /api/workouts
Query params: pageNumber, pageSize, sortBy, sortDir
Response:
```json
{
  "content": [
    {
      "id": "uuid",
      "title": "Chest Workout",
      "description": "Gym chest routine",
      "category": "GYM",
      "difficulty": "INTERMEDIATE",
      "equipmentType": "MACHINE",
      "equipmentRequired": true,
      "active": true,
      "exercises": [
        {
          "id": "exercise-uuid-1",
          "title": "Bench Press"
        }
      ]
    }
  ],
  "totalElements": 1,
  "totalPages": 1,
  "number": 0,
  "size": 20,
  "first": true,
  "last": true
}
```

GET /api/workouts/{id}
Response:
```json
{
  "id": "uuid",
  "title": "Chest Workout",
  "description": "Gym chest routine",
  "category": "GYM",
  "difficulty": "INTERMEDIATE",
  "equipmentType": "MACHINE",
  "equipmentRequired": true,
  "active": true,
  "workoutExercises": [
    {
      "id": 1,
      "sortOrder": 0
    }
  ]
}
```

PUT /api/workouts/{id}
Request:
```json
{
  "title": "Chest Workout",
  "description": "Updated routine",
  "category": "GYM",
  "difficulty": "INTERMEDIATE",
  "equipmentType": "MACHINE",
  "equipmentRequired": true,
  "active": true,
  "exerciseIds": [
    "exercise-uuid-1",
    "exercise-uuid-2"
  ]
}
```
Response:
```json
{
  "id": "uuid",
  "title": "Chest Workout",
  "description": "Updated routine",
  "category": "GYM",
  "difficulty": "INTERMEDIATE",
  "equipmentType": "MACHINE",
  "equipmentRequired": true,
  "active": true
}
```

DELETE /api/workouts/{id}
Response: 200 OK

GET /api/workouts/search?category=GYM&equipment=MACHINE&difficulty=INTERMEDIATE
Query params: pageNumber, pageSize, sortBy, sortDir
Response:
```json
{
  "content": [
    {
      "id": "uuid",
      "title": "Chest Workout"
    }
  ],
  "totalElements": 1,
  "totalPages": 1,
  "number": 0,
  "size": 20,
  "first": true,
  "last": true
}
```

