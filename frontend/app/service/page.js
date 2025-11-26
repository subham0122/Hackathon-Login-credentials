'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getServiceData } from '@/lib/api';
import { getToken, removeToken, isAuthenticated } from '@/lib/auth';

export default function ServicePage() {
    const router = useRouter();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // Check authentication
        if (!isAuthenticated()) {
            router.push('/login');
            return;
        }

        async function fetchData() {
            const token = getToken();
            if (!token) {
                router.push('/login');
                return;
            }

            try {
                const serviceData = await getServiceData(token);
                setData(serviceData);
            } catch (err) {
                setError('Failed to fetch service data. Your session may have expired.');
                // Token might be invalid, redirect to login
                setTimeout(() => {
                    removeToken();
                    router.push('/login');
                }, 2000);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [router]);

    const handleLogout = () => {
        removeToken();
        router.push('/home');
    };

    if (loading) {
        return <div style={{ padding: '20px' }}>Loading...</div>;
    }

    if (error) {
        return (
            <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
                <div style={{
                    padding: '15px',
                    backgroundColor: '#fee',
                    color: '#c00',
                    borderRadius: '5px'
                }}>
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>Service Page (Protected)</h1>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={() => router.push('/home')}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#0070f3',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        Home
                    </button>
                    <button
                        onClick={handleLogout}
                        style={{
                            padding: '8px 16px',
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

            {data && (
                <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
                    <p><strong>Message:</strong> {data.message}</p>
                    <p><strong>Description:</strong> {data.description}</p>
                    <p><strong>User ID:</strong> {data.user_id}</p>
                </div>
            )}

            <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#e7f3ff', borderRadius: '5px' }}>
                <p style={{ margin: 0 }}>
                    ✅ You are authenticated! This page is only accessible with a valid JWT token.
                </p>
            </div>
        </div>
    );
}
