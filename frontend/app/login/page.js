'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginWithEmail } from '@/lib/api';
import { setToken } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await loginWithEmail(email, password);
            setToken(response.access_token);
            router.push('/service');
        } catch (err) {
            setError('Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError('');
        setLoading(true);

        try {
            // Use Supabase JS client to initiate OAuth (handles PKCE automatically)
            const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`
                }
            });

            if (oauthError) {
                setError('Failed to initiate Google login.');
                setLoading(false);
            }
            // If successful, user will be redirected to Google
        } catch (err) {
            setError('Failed to initiate Google login.');
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: '50px auto' }}>
            <h1>Login</h1>

            {error && (
                <div style={{
                    padding: '10px',
                    backgroundColor: '#fee',
                    color: '#c00',
                    borderRadius: '5px',
                    marginBottom: '20px'
                }}>
                    {error}
                </div>
            )}

            {/* Email Login Form */}
            <form onSubmit={handleEmailLogin} style={{ marginBottom: '30px' }}>
                <h2 style={{ fontSize: '18px', marginBottom: '15px' }}>Login with Email</h2>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{
                            width: '100%',
                            padding: '8px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '14px'
                        }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{
                            width: '100%',
                            padding: '8px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '14px'
                        }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: '#0070f3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontSize: '16px'
                    }}
                >
                    {loading ? 'Logging in...' : 'Login with Email'}
                </button>
            </form>

            {/* Divider */}
            <div style={{
                textAlign: 'center',
                margin: '20px 0',
                borderTop: '1px solid #ddd',
                paddingTop: '20px'
            }}>
                <span style={{ color: '#666' }}>OR</span>
            </div>

            {/* Google Login Button */}
            <button
                onClick={handleGoogleLogin}
                disabled={loading}
                style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#db4437',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontSize: '16px'
                }}
            >
                {loading ? 'Redirecting...' : 'Login with Google'}
            </button>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <p style={{ marginBottom: '10px' }}>Don't have an account?</p>
                <button
                    onClick={() => router.push('/signup')}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#0070f3',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        fontSize: '16px'
                    }}
                >
                    Sign up here
                </button>
            </div>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <button
                    onClick={() => router.push('/home')}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#666',
                        cursor: 'pointer',
                        textDecoration: 'underline'
                    }}
                >
                    Back to Home
                </button>
            </div>
        </div>
    );
}
