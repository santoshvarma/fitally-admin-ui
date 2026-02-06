Exercise Media
--------------
POST /api/media/exercise/{exerciseId}
Request:
```json
{
  "title": "Bench Press Demo",
  "description": "How to perform",
  "url": "https://youtube.com/example",
  "type": "VIDEO"
}
```
Response:
```json
{
  "id": "uuid",
  "title": "Bench Press Demo",
  "description": "How to perform",
  "url": "https://youtube.com/example",
  "type": "VIDEO"
}
```

GET /api/media/exercise/{exerciseId}
Query params: pageNumber, pageSize, sortBy, sortDir
Response:
```json
{
  "content": [
    {
      "id": "uuid",
      "title": "Bench Press Demo",
      "description": "How to perform",
      "url": "https://youtube.com/example",
      "type": "VIDEO"
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

