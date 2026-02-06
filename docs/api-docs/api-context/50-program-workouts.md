Program Workouts
----------------
POST /api/program-workouts?programId={uuid}&workoutId={uuid}&dayNumber=1
Response:
```json
{
  "id": "uuid",
  "dayNumber": 1
}
```

GET /api/program-workouts/program/{programId}
Query params: pageNumber, pageSize, sortBy, sortDir
Response:
```json
{
  "content": [
    {
      "id": "uuid",
      "dayNumber": 1
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

DELETE /api/program-workouts/{id}
Response: 200 OK

