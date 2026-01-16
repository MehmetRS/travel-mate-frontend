import '../styles/globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '@/features/auth/hooks/useAuth';

export const metadata: Metadata = {
  title: 'Travel Mate - Yolculuk Paylaşımı',
  description: 'Güvenli ve ekonomik yolculuk paylaşım platformu',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="h-full">
      <body className="flex flex-col min-h-full">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
