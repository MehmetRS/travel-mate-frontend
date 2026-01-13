'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';

export default function RegisterClient() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    setError(null);
    setIsLoading(true);

    try {
      // Use apiFetch wrapper for proper auth headers and error handling
      const data = await apiFetch<{ accessToken: string }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, name }),
      });

      // Store the access token in localStorage
      localStorage.setItem('accessToken', data.accessToken);

      // Redirect to dashboard page
      router.push('/dashboard');

    } catch (err) {
      console.error('Registration failed:', err);
      setError(err instanceof Error ? err.message : 'Registration failed');
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Register</h1>

      {error && (
        <div style={{ color: 'red', marginBottom: '15px', padding: '10px', backgroundColor: '#ffeeee', borderRadius: '4px' }}>
          {error}
        </div>
      )}

      <div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="name" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Name:
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Email:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Password:
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>

        <button
          type="button"
          disabled={isLoading}
          onClick={handleRegister}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </div>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <p>Already have an account? <a href="/login" style={{ color: '#0070f3' }}>Login</a></p>
      </div>
    </div>
  );
}
