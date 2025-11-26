'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { setToken } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackPage() {
    const router = useRouter();
    const [error, setError] = useState('');
    const [status, setStatus] = useState('Processing authentication...');

    useEffect(() => {
        async function handleCallback() {
            try {
                console.log('Full URL:', window.location.href);

                // Check if we have an authorization code in the URL
                const params = new URLSearchParams(window.location.search);
                const code = params.get('code');

                if (code) {
                    setStatus('Exchanging authorization code for session...');
                    console.log('Authorization code found, exchanging...');

                    // Exchange the code for a session using Supabase
                    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

                    if (exchangeError) {
                        console.error('Code exchange error:', exchangeError);
                        setError(exchangeError.message || 'Failed to complete authentication');
                        setTimeout(() => router.push('/login'), 3000);
                        return;
                    }

                    if (data.session) {
                        setStatus('Login successful! Redirecting...');
                        console.log('Session obtained, storing token');
                        setToken(data.session.access_token);
                        setTimeout(() => {
                            router.push('/service');
                        }, 500);
                        return;
                    }
                }

                // Check for hash-based tokens (implicit flow)
                const hash = window.location.hash;
                if (hash) {
                    const hashParams = new URLSearchParams(hash.substring(1));
                    const accessToken = hashParams.get('access_token');

                    if (accessToken) {
                        setStatus('Login successful! Redirecting...');
                        setToken(accessToken);
                        setTimeout(() => {
                            router.push('/service');
                        }, 500);
                        return;
                    }
                }

                // Check for existing session
                const { data: sessionData } = await supabase.auth.getSession();
                if (sessionData.session) {
                    setStatus('Login successful! Redirecting...');
                    setToken(sessionData.session.access_token);
                    setTimeout(() => {
                        router.push('/service');
                    }, 500);
                    return;
                }

                // No authentication data found
                console.log('No authentication data found');
                setError('Authentication incomplete. Please try logging in again.');
                setTimeout(() => router.push('/login'), 3000);
            } catch (err) {
                console.error('Callback error:', err);
                setError('An error occurred during authentication');
                setTimeout(() => router.push('/login'), 3000);
            }
        }

        handleCallback();
    }, [router]);

    if (error) {
        return (
            <div style={{ padding: '20px', maxWidth: '600px', margin: '50px auto', textAlign: 'center' }}>
                <div style={{
                    padding: '15px',
                    backgroundColor: '#fee',
                    color: '#c00',
                    borderRadius: '5px',
                    marginBottom: '20px'
                }}>
                    {error}
                </div>
                <p>Redirecting to login...</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '50px auto', textAlign: 'center' }}>
            <h2>Processing authentication...</h2>
            <p>{status}</p>
            <div style={{ marginTop: '20px' }}>
                <div style={{
                    display: 'inline-block',
                    width: '40px',
                    height: '40px',
                    border: '4px solid #f3f3f3',
                    borderTop: '4px solid #0070f3',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }}></div>
            </div>
            <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
}
