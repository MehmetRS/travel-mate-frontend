import Link from 'next/link';

export default function HomePage() {
  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px', textAlign: 'center' }}>
      <h1 style={{ color: '#0070f3', marginBottom: '30px', fontSize: '2.5rem' }}>Travel Mate</h1>

      <div style={{ backgroundColor: '#f0f8ff', padding: '30px', borderRadius: '8px', marginBottom: '30px' }}>
        <h2 style={{ color: '#0070f3', marginBottom: '20px' }}>Welcome to Travel Mate</h2>
        <p style={{ marginBottom: '15px', fontSize: '1.1rem' }}>
          Your personal travel companion for planning and managing trips.
        </p>
        <p style={{ fontSize: '1rem', color: '#666' }}>
          Sign up or login to start planning your next adventure!
        </p>
      </div>

      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
        <Link href="/login" style={{
          display: 'inline-block',
          padding: '12px 24px',
          backgroundColor: '#0070f3',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '4px',
          fontSize: '1rem',
          fontWeight: 'bold'
        }}>
          Login
        </Link>

        <Link href="/register" style={{
          display: 'inline-block',
          padding: '12px 24px',
          backgroundColor: '#28a745',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '4px',
          fontSize: '1rem',
          fontWeight: 'bold'
        }}>
          Register
        </Link>
      </div>
    </div>
  );
}
