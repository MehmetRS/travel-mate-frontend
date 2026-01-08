'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAccessToken, clearAccessToken } from '@/lib/auth';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const token = getAccessToken();
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    clearAccessToken();
    router.push('/login');
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px', color: '#0070f3' }}>Dashboard</h1>

      <div style={{ backgroundColor: '#f0f8ff', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2 style={{ color: '#0070f3', marginBottom: '10px' }}>Welcome to Travel Mate!</h2>
        <p style={{ marginBottom: '15px' }}>You have successfully logged in to your account.</p>
        <p>This is your dashboard where you can manage your travel plans and trips.</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
        <button
          onClick={handleLogout}
          style={{
            padding: '10px 20px',
            backgroundColor: '#ff4444',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}