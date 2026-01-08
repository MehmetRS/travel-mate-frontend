import '../styles/globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header style={{
          backgroundColor: '#0070f3',
          color: 'white',
          padding: '15px 20px',
          textAlign: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ margin: 0, fontSize: '1.8rem' }}>Travel Mate</h1>
        </header>

        <main style={{ minHeight: 'calc(100vh - 100px)' }}>
          {children}
        </main>

        <footer style={{
          backgroundColor: '#f0f0f0',
          padding: '15px 20px',
          textAlign: 'center',
          marginTop: 'auto'
        }}>
          <p style={{ margin: 0, color: '#666' }}>© {new Date().getFullYear()} Travel Mate. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}