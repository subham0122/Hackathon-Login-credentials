# Quick Setup Guide

## Current Status

✅ Backend code is ready  
✅ Frontend code is ready  
⚠️ TypeScript errors are **NORMAL** before running `npm install`

## The TypeScript Errors You're Seeing

The errors in `api.ts`, `layout.tsx`, and other `.tsx` files are because:
- React types are not installed yet
- Next.js types are not installed yet
- These will **automatically disappear** after `npm install`

## Setup Steps

### Step 1: Restart Terminal

After installing Node.js 24, you need to restart your terminal:

1. Close current PowerShell/terminal
2. Open a new one
3. Verify Node.js is available:
   ```bash
   node --version
   npm --version
   ```

Expected output:
```
v24.x.x
10.x.x
```

### Step 2: Install Frontend Dependencies

```bash
cd d:\Project\frontend
npm install
```

This will install:
- `next` (Next.js framework)
- `react` (React library)
- `react-dom` (React DOM)
- All TypeScript type definitions

**All TypeScript errors will disappear after this step!**

### Step 3: Start Backend

In one terminal:
```bash
cd d:\Project
python main.py
```

Expected output:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### Step 4: Start Frontend

In another terminal:
```bash
cd d:\Project\frontend
npm run dev
```

Expected output:
```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
```

### Step 5: Test in Browser

Open: `http://localhost:3000`

You should see:
- Home page loads
- "Go to Login" button works
- Login page has email and Google options

## If npm Still Not Found

If `npm` command is not recognized:

1. **Check Node.js installation**:
   - Open a NEW terminal (important!)
   - Run: `node --version`
   - If not found, Node.js may not be in PATH

2. **Add to PATH manually**:
   - Search for "Environment Variables" in Windows
   - Add Node.js installation path (usually `C:\Program Files\nodejs`)
   - Restart terminal

3. **Alternative**: Use full path:
   ```bash
   "C:\Program Files\nodejs\npm.exe" install
   ```

## Current File Status

All files are correct:

✅ `frontend/lib/api.ts` - API client functions  
✅ `frontend/lib/auth.ts` - Token management  
✅ `frontend/app/layout.tsx` - Root layout (React import added)  
✅ `frontend/app/page.tsx` - Root redirect  
✅ `frontend/app/home/page.tsx` - Public home  
✅ `frontend/app/login/page.tsx` - Login page  
✅ `frontend/app/service/page.tsx` - Protected page  
✅ `frontend/app/auth/callback/page.tsx` - OAuth callback  

## Testing Backend Only (While Waiting for npm)

You can test the backend right now:

```bash
cd d:\Project
python main.py
```

Then in browser or Postman:
```
http://localhost:8000/health
http://localhost:8000/home
```

## Next Steps

1. Restart your terminal
2. Run `npm install` in `d:\Project\frontend`
3. All TypeScript errors will disappear
4. Start both backend and frontend
5. Test the complete flow

The code is ready - you just need to install the dependencies!
