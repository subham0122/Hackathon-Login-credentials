'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getHomeData } from '@/lib/api';
import { isAuthenticated, removeToken } from '@/lib/auth';

export default function HomePage() {
    const router = useRouter();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const homeData = await getHomeData();
                setData(homeData);
            } catch (error) {
                console.error('Failed to fetch home data:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    const handleLogout = () => {
        removeToken();
        window.location.reload(); // Refresh to update auth state
    };

    if (loading) {
        return <div style={{ padding: '20px' }}>Loading...</div>;
    }

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h1>Home Page (Public)</h1>

            {data && (
                <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
                    <p><strong>Message:</strong> {data.message}</p>
                    <p><strong>Description:</strong> {data.description}</p>
                </div>
            )}

            <div style={{ marginTop: '30px' }}>
                {isAuthenticated() ? (
                    <div>
                        <p>You are logged in!</p>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                            <button
                                onClick={() => router.push('/service')}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#0070f3',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer'
                                }}
                            >
                                Go to Service
                            </button>
                            <button
                                onClick={handleLogout}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#dc3545',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer'
                                }}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <p>Welcome! Please login or signup to access services.</p>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                            <button
                                onClick={() => router.push('/service')}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#0070f3',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer'
                                }}
                            >
                                Go to Service
                            </button>
                            <button
                                onClick={() => router.push('/login')}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#28a745',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer'
                                }}
                            >
                                Login
                            </button>
                            <button
                                onClick={() => router.push('/signup')}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#17a2b8',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer'
                                }}
                            >
                                Sign Up
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
