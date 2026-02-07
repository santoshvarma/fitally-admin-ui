Auth
----
POST /api/auth/register
Request:
```json
{
  "name": "Admin User",
  "email": "admin@fitally.com",
  "phone": "9999999999",
  "password": "StrongPassword",
  "role": "ROLE_ADMIN"
}
```
Response:
```json
"User registered successfully"
```

POST /api/auth/login
Request:
```json
{
  "email": "admin@fitally.com",
  "password": "StrongPassword"
}
```
Response:
```json
{
  "accessToken": "jwt-token",
  "refreshToken": "uuid-token"
}
```

POST /api/auth/refresh
Request:
```json
{
  "refreshToken": "uuid-token"
}
```
Response:
```json
{
  "accessToken": "jwt-token"
}
```

POST /api/auth/firebase
Request:
```json
{
  "idToken": "firebase-id-token"
}
```
Response:
```json
{
  "accessToken": "jwt-token",
  "refreshToken": "uuid-token"
}
```

