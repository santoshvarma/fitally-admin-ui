Exercises
---------
POST /api/exercises
Request:
```json
{
  "title": "Bench Press",
  "description": "Chest compound movement",
  "equipmentType": "MACHINE",
  "muscleGroup": "CHEST",
  "category": "GYM",
  "active": true
}
```
Response:
```json
{
  "id": "uuid",
  "title": "Bench Press",
  "description": "Chest compound movement",
  "equipmentType": "MACHINE",
  "muscleGroup": "CHEST",
  "category": "GYM",
  "active": true
}
```

GET /api/exercises
Query params: pageNumber, pageSize, sortBy, sortDir
Response:
```json
{
  "content": [
    {
      "id": "uuid",
      "title": "Bench Press",
      "description": "Chest compound movement",
      "equipmentType": "MACHINE",
      "muscleGroup": "CHEST",
      "category": "GYM",
      "active": true
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

GET /api/exercises/{exerciseId}
Response:
```json
{
  "id": "uuid",
  "title": "Bench Press",
  "description": "Chest compound movement",
  "equipmentType": "MACHINE",
  "muscleGroup": "CHEST",
  "category": "GYM",
  "active": true
}
```

GET /api/exercises/workout/{workoutId}
Query params: pageNumber, pageSize, sortBy, sortDir
Response:
```json
{
  "content": [
    {
      "id": "uuid",
      "title": "Bench Press",
      "description": "Chest compound movement",
      "equipmentType": "MACHINE",
      "muscleGroup": "CHEST",
      "category": "GYM",
      "active": true
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

PUT /api/exercises/{id}
Request:
```json
{
  "title": "Bench Press",
  "description": "Updated description",
  "equipmentType": "MACHINE",
  "muscleGroup": "CHEST",
  "category": "GYM",
  "active": true
}
```
Response:
```json
{
  "id": "uuid",
  "title": "Bench Press",
  "description": "Updated description",
  "equipmentType": "MACHINE",
  "muscleGroup": "CHEST",
  "category": "GYM",
  "active": true
}
```

DELETE /api/exercises/{id}
Response: 200 OK

GET /api/exercises/search?muscleGroup=CHEST
Query params: pageNumber, pageSize, sortBy, sortDir
Response:
```json
{
  "content": [
    {
      "id": "uuid",
      "title": "Bench Press",
      "description": "Chest compound movement",
      "equipmentType": "MACHINE",
      "muscleGroup": "CHEST",
      "category": "GYM",
      "active": true
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

