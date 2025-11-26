# API Endpoints Documentation

Complete reference for all backend API endpoints.

## Base URL

```
http://localhost:8000
```

---

## Public Endpoints

### Health Check

**GET** `/health`

Check if the API is running.

**Response:**
```json
{
  "status": "ok"
}
```

---

### Home (Public)

**GET** `/home`

Get public home page data. No authentication required.

**Response:**
```json
{
  "message": "Welcome to the home page!",
  "description": "This is a public endpoint accessible to everyone."
}
```

---

## Authentication Endpoints

### Sign Up

**POST** `/signup`

Create a new user account with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "your_password"
}
```

**Response:**
```json
{
  "message": "Signup successful",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    ...
  }
}
```

---

### Login (Email)

**POST** `/login`

Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "your_password"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

---

### Login with Google (Initiate OAuth)

**POST** `/login/google`

Initiate Google OAuth flow. Returns a URL that must be opened in a browser.

**Response:**
```json
{
  "url": "https://accounts.google.com/o/oauth2/v2/auth?...",
  "message": "Open this URL in browser to authenticate with Google"
}
```

**Usage:**
1. Call this endpoint
2. Open the returned `url` in a browser
3. User authenticates with Google
4. Google redirects to callback URL with access token

---

### Verify Google Auth

**POST** `/auth/google/verify`

Exchange Google access token for Supabase JWT.

**Request Body:**
```json
{
  "access_token": "google_access_token_here"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": "uuid",
    "email": "user@gmail.com"
  }
}
```

**Error Response (400):**
```json
{
  "detail": "Google auth verification failed: ..."
}
```

---

### Logout

**POST** `/logout`

Logout the current user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

---

## Protected Endpoints

These endpoints require a valid JWT token in the Authorization header.

### Service (Protected)

**GET** `/service`

Get service data. Requires authentication.

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Response:**
```json
{
  "message": "Welcome to the service page, user@example.com!",
  "description": "This is a protected endpoint. You are authenticated.",
  "user_id": "uuid"
}
```

**Error Response (401):**
```json
{
  "detail": "Missing Authorization header"
}
```

---

### Protected (Legacy)

**GET** `/protected`

Legacy protected endpoint. Requires authentication.

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Response:**
```json
{
  "message": "Welcome, user@example.com!"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "detail": "Error message describing what went wrong"
}
```

### 401 Unauthorized
```json
{
  "detail": "Missing Authorization header"
}
```
or
```json
{
  "detail": "Invalid Authorization header format"
}
```
or
```json
{
  "detail": "Unauthorized"
}
```

### 500 Internal Server Error
```json
{
  "detail": "Error message"
}
```

---

## Authentication Flow

### Email/Password Flow

```
1. POST /signup → Create account
2. POST /login → Get JWT token
3. Use token in Authorization header for protected endpoints
```

### Google OAuth Flow

```
1. POST /login/google → Get OAuth URL
2. Open URL in browser → User authenticates
3. Redirect to callback → Extract access_token from URL
4. (Optional) POST /auth/google/verify → Exchange for Supabase JWT
5. Use token in Authorization header for protected endpoints
```

Note: The token from Google OAuth callback is already a Supabase JWT and can be used directly.

---

## CORS Configuration

The API allows requests from:
- `http://localhost:3000` (Next.js frontend)

All methods and headers are allowed for cross-origin requests.
