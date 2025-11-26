# Authentication Microservice

A secure Authentication Microservice using FastAPI and Supabase.

## Setup

1.  **Install Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

2.  **Environment Variables**:
    - Rename `.env.example` to `.env`.
    - Add your Supabase URL and Key to `.env`:
      ```
      SUPABASE_URL=your_supabase_url
      SUPABASE_KEY=your_supabase_anon_key
      ```

3.  **Run the Server**:
    ```bash
    uvicorn main:app --reload
    ```

## Postman Testing Instructions

### 1. Setup Request for Signup
- **Method**: POST
- **URL**: `http://127.0.0.1:8000/signup`
- **Body**: Select "raw" -> "JSON"
  ```json
  {
    "email": "test@example.com",
    "password": "securepassword123"
  }
  ```
- **Send**: You should receive a success message.

### 2. Setup Request for Login
- **Method**: POST
- **URL**: `http://127.0.0.1:8000/login`
- **Body**: Select "raw" -> "JSON"
  ```json
  {
    "email": "test@example.com",
    "password": "securepassword123"
  }
  ```
- **Send**: You will receive a JSON response containing `access_token`.

### 3. Copy JWT Token
- Copy the value of `access_token` from the Login response body.

### 4. Access Protected Route
- **Method**: GET
- **URL**: `http://127.0.0.1:8000/protected`
- **Authorization Tab**:
  - Select Type: **Bearer Token**
  - Paste the copied token into the "Token" field.
- **Send**: You should see `{"message": "Welcome, test@example.com!"}`.
- **Test Failure**: Try removing the token or changing a character in it. You should get `401 Unauthorized`.
