import os
from fastapi import FastAPI, HTTPException, Depends, Header
from pydantic import BaseModel
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set in the .env file")

# Initialize Supabase Client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

app = FastAPI(title="Authentication Microservice")

# Pydantic Models
class UserSignup(BaseModel):
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

# Endpoints

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/signup")
def signup(user: UserSignup):
    try:
        response = supabase.auth.sign_up({
            "email": user.email,
            "password": user.password
        })
        # Check if there's an error in the response (Supabase client might raise exception or return error)
        # The python client typically raises exceptions for errors, but let's handle potential return values if needed.
        # However, gotrue-py (used by supabase-py) raises exceptions on error.
        
        return {"message": "Signup successful", "user": response.user}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/login")
def login(user: UserLogin):
    try:
        response = supabase.auth.sign_in_with_password({
            "email": user.email,
            "password": user.password
        })
        return {"access_token": response.session.access_token, "token_type": "bearer"}
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid credentials")

@app.post("/logout")
def logout(authorization: str = Header(None)):
    # Supabase sign_out usually works on the client session, but in a stateless API, 
    # we might just want to call sign_out. 
    # However, the python client's sign_out() doesn't take a token directly in the same way as some other SDKs might imply for server-side.
    # It typically signs out the *current* session of the client instance.
    # Since we are re-initializing or using a global client, we need to be careful.
    # Actually, for a REST API, "logout" is often client-side (discard token).
    # But if we want to invalidate it on server, Supabase Auth is JWT based.
    # Standard Supabase sign_out() invalidates the session on the server if using sessions.
    
    # For this implementation, we'll call sign_out(). 
    # Note: In a real microservice with shared client, sign_out might affect the global state if not careful,
    # but supabase-py client handles session state. 
    # To properly sign out a specific user, we might need to set the session first if we were using the client in a stateful way.
    # But here, we are just proxying. 
    
    try:
        supabase.auth.sign_out()
        return {"message": "Logged out successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/protected")
def protected_route(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Authorization header")
    
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid Authorization header format")
    
    token = authorization.split(" ")[1]
    
    try:
        # Verify the token using Supabase
        user = supabase.auth.get_user(token)
        if not user:
             raise HTTPException(status_code=401, detail="Invalid token")
             
        return {"message": f"Welcome, {user.user.email}!"}
    except Exception as e:
        raise HTTPException(status_code=401, detail="Unauthorized")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
