# Frontend Setup Guide

This guide will help you set up and run the Next.js frontend application.

## Prerequisites

- Node.js 18+ installed
- Backend API running on `http://localhost:8000`

## Installation

1. **Navigate to frontend directory:**
   ```bash
   cd d:\Project\frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

   This will install:
   - Next.js 14
   - React 18
   - React DOM 18

3. **Verify environment configuration:**
   
   Check that `.env.local` contains:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

## Running the Application

### Development Mode

```bash
npm run dev
```

The application will start on **http://localhost:3000**

### Production Build

```bash
npm run build
npm start
```

---

## Application Structure

```
frontend/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Root page (redirects to /home)
│   ├── home/
│   │   └── page.tsx        # Public home page
│   ├── login/
│   │   └── page.tsx        # Login page (email + Google)
│   ├── service/
│   │   └── page.tsx        # Protected service page
│   └── auth/
│       └── callback/
│           └── page.tsx    # OAuth callback handler
├── lib/
│   ├── api.ts              # API client functions
│   └── auth.ts             # Auth utilities (token management)
├── .env.local              # Environment variables
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
└── next.config.js          # Next.js config
```

---

## Testing the Application

### 1. Start Backend

Make sure your FastAPI backend is running:

```bash
cd d:\Project
python main.py
```

Backend should be available at: **http://localhost:8000**

### 2. Start Frontend

```bash
cd d:\Project\frontend
npm run dev
```

Frontend should be available at: **http://localhost:3000**

### 3. Test Authentication Flows

#### Email Login Flow

1. Navigate to **http://localhost:3000**
2. You'll be redirected to `/home`
3. Click **"Go to Login"**
4. Enter your email and password
5. Click **"Login with Email"**
6. You should be redirected to `/service` page
7. Click **"Logout"** to return to home

#### Google Login Flow

1. Navigate to **http://localhost:3000/login**
2. Click **"Login with Google"**
3. You'll be redirected to Google's login page
4. Sign in with your Google account
5. Grant permissions
6. You'll be redirected back to `/service` page
7. Your JWT token is stored in localStorage

#### Protected Route Test

1. While logged out, try to access **http://localhost:3000/service**
2. You should be automatically redirected to `/login`
3. After logging in, you can access `/service`

---

## How It Works

### Authentication Flow

1. **Email Login:**
   - User submits email/password
   - Frontend calls `POST /login`
   - Backend returns JWT token
   - Token stored in localStorage
   - User redirected to `/service`

2. **Google OAuth:**
   - User clicks "Login with Google"
   - Frontend calls `POST /login/google`
   - Backend returns Google OAuth URL
   - User redirected to Google
   - Google redirects to `/auth/callback` with token
   - Token extracted from URL hash and stored
   - User redirected to `/service`

3. **Protected Routes:**
   - Page checks for token in localStorage
   - If no token → redirect to `/login`
   - If token exists → fetch data with `Authorization: Bearer <token>`
   - If token invalid → redirect to `/login`

### JWT Token Storage

- Tokens are stored in **localStorage** with key `auth_token`
- Token is automatically included in API requests to protected endpoints
- Token persists across page refreshes
- Logout removes token from localStorage

---

## Environment Variables

### Frontend (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

- `NEXT_PUBLIC_` prefix makes it available in browser
- Change this for production deployment

### Backend (.env)

```
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
```

---

## Troubleshooting

### "Failed to fetch" errors

- **Check backend is running** on port 8000
- **Check CORS is enabled** in backend (already configured)
- **Check `.env.local`** has correct API URL

### Google OAuth not working

- **Verify Supabase configuration:**
  - Google OAuth provider enabled
  - Client ID and Secret configured
  - Redirect URL: `http://localhost:3000/auth/callback`
- **Check browser console** for errors

### Token not persisting

- **Check localStorage** in browser DevTools
- **Check for errors** in browser console
- **Try clearing localStorage** and logging in again

### Page not redirecting

- **Check browser console** for JavaScript errors
- **Verify token** is in localStorage
- **Try hard refresh** (Ctrl+Shift+R)

---

## Development Tips

### View Stored Token

Open browser DevTools (F12):
```javascript
// Console
localStorage.getItem('auth_token')
```

### Clear Token Manually

```javascript
// Console
localStorage.removeItem('auth_token')
```

### Test API Calls

```javascript
// Console
fetch('http://localhost:8000/home')
  .then(r => r.json())
  .then(console.log)
```

---

## Next Steps

- Customize the UI styling
- Add error handling improvements
- Add loading states
- Implement token refresh
- Add user profile page
- Deploy to production
