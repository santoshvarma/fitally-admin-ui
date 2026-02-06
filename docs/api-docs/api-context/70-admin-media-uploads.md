Admin Media Uploads
-------------------
POST /api/admin/media/image/exercise/{exerciseId}
Request: multipart form (file, title, description)
Response:
```json
{
  "id": "uuid",
  "title": "Bench Press Image",
  "description": "Form image",
  "url": "https://res.cloudinary.com/...jpg",
  "type": "IMAGE",
  "metadata": {
    "provider": "CLOUDINARY",
    "image-id": "fitally/exercises/..."
  }
}
```

POST /api/admin/media/video/exercise/{exerciseId}
Request: form params (youtubeUrl, title, description)
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

DELETE /api/admin/media/{id}
Response: 200 OK

