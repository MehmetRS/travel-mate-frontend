'use client';

import { useAuth } from '@/contexts/auth';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Pages that don't require authentication
const PUBLIC_PATHS = ['/', '/login', '/register'];

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !PUBLIC_PATHS.includes(pathname)) {
      router.replace('/login');
    }
  }, [isLoading, isAuthenticated, pathname, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Show welcome screen for unauthenticated users on public paths
  if (!isAuthenticated && PUBLIC_PATHS.includes(pathname)) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to Travel Mate
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Find and share rides with verified travelers
            </p>
            <div className="space-x-4">
              <button
                onClick={() => router.push('/login')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => router.push('/register')}
                className="px-6 py-2 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show protected content for authenticated users
  return <>{children}</>;
}
