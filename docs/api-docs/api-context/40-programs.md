Programs
--------
POST /api/programs
Request:
```json
{
  "title": "60 Day Muscle Gain",
  "category": "GYM",
  "goal": "MUSCLE_GAIN",
  "durationDays": 60,
  "description": "Gym gain plan",
  "active": true
}
```
Response:
```json
{
  "id": "uuid",
  "title": "60 Day Muscle Gain",
  "category": "GYM",
  "goal": "MUSCLE_GAIN",
  "durationDays": 60,
  "description": "Gym gain plan",
  "active": true
}
```

GET /api/programs
Query params: pageNumber, pageSize, sortBy, sortDir
Response:
```json
{
  "content": [
    {
      "id": "uuid",
      "title": "60 Day Muscle Gain",
      "category": "GYM",
      "goal": "MUSCLE_GAIN",
      "durationDays": 60,
      "description": "Gym gain plan",
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

GET /api/programs/{id}
Response:
```json
{
  "id": "uuid",
  "title": "60 Day Muscle Gain",
  "category": "GYM",
  "goal": "MUSCLE_GAIN",
  "durationDays": 60,
  "description": "Gym gain plan",
  "active": true
}
```

PUT /api/programs/{id}
Request:
```json
{
  "title": "60 Day Muscle Gain",
  "category": "GYM",
  "goal": "MUSCLE_GAIN",
  "durationDays": 60,
  "description": "Updated plan",
  "active": true
}
```
Response:
```json
{
  "id": "uuid",
  "title": "60 Day Muscle Gain",
  "category": "GYM",
  "goal": "MUSCLE_GAIN",
  "durationDays": 60,
  "description": "Updated plan",
  "active": true
}
```

DELETE /api/programs/{id}
Response: 200 OK

GET /api/programs/search?category=GYM&goal=MUSCLE_GAIN
Query params: pageNumber, pageSize, sortBy, sortDir
Response:
```json
{
  "content": [
    {
      "id": "uuid",
      "title": "60 Day Muscle Gain"
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

