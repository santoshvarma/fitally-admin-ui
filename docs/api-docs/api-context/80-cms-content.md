CMS Content
-----------
POST /api/content
Request:
```json
{
  "title": "Summer Banner",
  "description": "Promo",
  "type": "HOME_BANNER",
  "page": "HOME",
  "displayOrder": 1,
  "active": true
}
```
Response:
```json
{
  "id": "uuid",
  "title": "Summer Banner",
  "description": "Promo",
  "type": "HOME_BANNER",
  "page": "HOME",
  "displayOrder": 1,
  "active": true
}
```

GET /api/content?page=HOME
Query params: page (required), pageNumber, pageSize, sortBy, sortDir
Response:
```json
{
  "content": [
    {
      "id": "uuid",
      "title": "Summer Banner",
      "description": "Promo",
      "type": "HOME_BANNER",
      "page": "HOME",
      "displayOrder": 1,
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

GET /api/content/{id}
Response:
```json
{
  "id": "uuid",
  "title": "Summer Banner",
  "description": "Promo",
  "type": "HOME_BANNER",
  "page": "HOME",
  "displayOrder": 1,
  "active": true
}
```

PUT /api/content/{id}
Request:
```json
{
  "title": "Summer Banner",
  "description": "Updated promo",
  "type": "HOME_BANNER",
  "page": "HOME",
  "displayOrder": 1,
  "active": true
}
```
Response:
```json
{
  "id": "uuid",
  "title": "Summer Banner",
  "description": "Updated promo",
  "type": "HOME_BANNER",
  "page": "HOME",
  "displayOrder": 1,
  "active": true
}
```

DELETE /api/content/{id}
Response: 200 OK

