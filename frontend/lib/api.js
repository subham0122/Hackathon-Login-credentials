const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Email login
export async function loginWithEmail(email, password) {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        throw new Error('Login failed');
    }

    return response.json();
}

// Initiate Google OAuth
export async function initiateGoogleLogin() {
    const response = await fetch(`${API_URL}/login/google`, {
        method: 'POST',
    });

    if (!response.ok) {
        throw new Error('Failed to initiate Google login');
    }

    return response.json();
}

// Verify Google OAuth token
export async function verifyGoogleAuth(accessToken) {
    const response = await fetch(`${API_URL}/auth/google/verify`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ access_token: accessToken }),
    });

    if (!response.ok) {
        throw new Error('Google auth verification failed');
    }

    return response.json();
}

// Get service data (protected)
export async function getServiceData(token) {
    const response = await fetch(`${API_URL}/service`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch service data');
    }

    return response.json();
}

// Get home data (public)
export async function getHomeData() {
    const response = await fetch(`${API_URL}/home`);

    if (!response.ok) {
        throw new Error('Failed to fetch home data');
    }

    return response.json();
}
