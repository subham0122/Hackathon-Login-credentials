# Postman Testing Guide

This guide shows you how to test the Google OAuth integration using Postman.

## Prerequisites

- FastAPI backend running on `http://localhost:8000`
- Postman installed
- Google OAuth configured in Supabase dashboard

## Endpoint Overview

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/health` | GET | No | Health check |
| `/home` | GET | No | Public home page data |
| `/service` | GET | Yes | Protected service data |
| `/signup` | POST | No | Create new user account |
| `/login` | POST | No | Email/password login |
| `/login/google` | POST | No | Initiate Google OAuth |
| `/auth/google/verify` | POST | No | Verify Google token |
| `/logout` | POST | No | Logout user |
| `/protected` | GET | Yes | Legacy protected endpoint |

---

## Testing Flow

### 1. Test Public Endpoint

**Request:**
```
GET http://localhost:8000/home
```

**Expected Response:**
```json
{
  "message": "Welcome to the home page!",
  "description": "This is a public endpoint accessible to everyone."
}
```

---

### 2. Test Protected Endpoint (Should Fail)

**Request:**
```
GET http://localhost:8000/service
```

**Expected Response:** `401 Unauthorized`
```json
{
  "detail": "Missing Authorization header"
}
```

---

### 3. Email Login Flow

#### Step 3a: Sign Up (if needed)

**Request:**
```
POST http://localhost:8000/signup
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "your_password"
}
```

**Expected Response:**
```json
{
  "message": "Signup successful",
  "user": {
    "id": "...",
    "email": "test@example.com",
    ...
  }
}
```

#### Step 3b: Login

**Request:**
```
POST http://localhost:8000/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "your_password"
}
```

**Expected Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**Save the `access_token` for next steps!**

---

### 4. Access Protected Endpoint with Token

**Request:**
```
GET http://localhost:8000/service
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Expected Response:**
```json
{
  "message": "Welcome to the service page, test@example.com!",
  "description": "This is a protected endpoint. You are authenticated.",
  "user_id": "..."
}
```

---

### 5. Google OAuth Flow

> [!IMPORTANT]
> Google OAuth requires browser interaction. You cannot complete the full flow in Postman alone.

#### Step 5a: Initiate Google OAuth

**Request:**
```
POST http://localhost:8000/login/google
```

**Expected Response:**
```json
{
  "url": "https://accounts.google.com/o/oauth2/v2/auth?...",
  "message": "Open this URL in browser to authenticate with Google"
}
```

#### Step 5b: Complete OAuth in Browser

1. Copy the `url` from the response
2. Open it in your browser
3. Log in with your Google account
4. You'll be redirected to: `http://localhost:3000/auth/callback#access_token=...`
5. Copy the `access_token` from the URL hash

#### Step 5c: Use the Google Token

The token from the callback URL is already a Supabase JWT! Use it directly:

**Request:**
```
GET http://localhost:8000/service
Authorization: Bearer <access_token_from_url>
```

**Expected Response:**
```json
{
  "message": "Welcome to the service page, your.email@gmail.com!",
  "description": "This is a protected endpoint. You are authenticated.",
  "user_id": "..."
}
```

---

## Alternative: Testing with Google Access Token

If you have a Google access token from another source, you can exchange it:

**Request:**
```
POST http://localhost:8000/auth/google/verify
Content-Type: application/json

{
  "access_token": "ya29.a0AfH6SMB..."
}
```

**Expected Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": "...",
    "email": "your.email@gmail.com"
  }
}
```

---

## Postman Collection Setup

### Create Environment Variables

1. Create a new environment in Postman
2. Add these variables:
   - `base_url`: `http://localhost:8000`
   - `access_token`: (leave empty, will be set automatically)

### Save Token Automatically

In your login request, add this to the **Tests** tab:

```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.environment.set("access_token", response.access_token);
}
```

### Use Token in Requests

In protected endpoints, set the Authorization header to:
```
Bearer {{access_token}}
```

---

## Troubleshooting

### Error: "Missing Authorization header"
- Make sure you're sending the `Authorization` header
- Format: `Bearer <token>` (note the space after "Bearer")

### Error: "Unauthorized"
- Your token may be expired
- Login again to get a new token

### Error: "OAuth initiation failed"
- Check that Google OAuth is configured in Supabase dashboard
- Verify `SUPABASE_URL` and `SUPABASE_KEY` in `.env`

### Error: "CORS policy"
- Make sure backend is running with CORS enabled
- Frontend should be on `http://localhost:3000`
