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
