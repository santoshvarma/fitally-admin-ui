Exercise Media
--------------
POST /api/media/exercise/{exerciseId}
Request:
```json
{
  "title": "Bench Press Demo",
  "description": "How to perform",
  "url": "https://youtube.com/example",
  "sortOrder": 1,
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
  "sortOrder": 1,
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
      "sortOrder": 1,
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

PUT /api/media/{id}
Request:
```json
{
  "title": "Bench Press Demo",
  "description": "How to perform",
  "url": "https://youtube.com/example",
  "sortOrder": 1,
  "type": "VIDEO",
  "category": "DEMO",
  "metadata": {
    "provider": "CLOUDINARY",
    "image-id": "public-id"
  }
}
```
Response:
```json
{
  "id": "uuid",
  "title": "Bench Press Demo",
  "description": "How to perform",
  "url": "https://youtube.com/example",
  "sortOrder": 1,
  "type": "VIDEO",
  "category": "DEMO",
  "metadata": {
    "provider": "CLOUDINARY",
    "image-id": "public-id"
  }
}
```

