CMS Media
---------
POST /api/content-media/content/{contentId}
Request:
```json
{
  "title": "Banner Image",
  "description": "Main banner",
  "url": "https://cdn.fitally.com/banner.jpg",
  "type": "IMAGE"
}
```
Response:
```json
{
  "id": "uuid",
  "title": "Banner Image",
  "description": "Main banner",
  "url": "https://cdn.fitally.com/banner.jpg",
  "type": "IMAGE"
}
```

GET /api/content-media/content/{contentId}
Query params: pageNumber, pageSize, sortBy, sortDir
Response:
```json
{
  "content": [
    {
      "id": "uuid",
      "title": "Banner Image",
      "description": "Main banner",
      "url": "https://cdn.fitally.com/banner.jpg",
      "type": "IMAGE"
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

DELETE /api/content-media/{id}
Response: 200 OK

POST /api/content-media/image/content/{contentId}
Request: multipart form (file, title)
Response:
```json
{
  "id": "uuid",
  "title": "Banner Image",
  "description": null,
  "url": "https://res.cloudinary.com/...jpg",
  "type": "IMAGE",
  "metadata": {
    "provider": "CLOUDINARY",
    "image-id": "fitally/app_content/..."
  }
}
```

AdminController (Note)
-----------------------

