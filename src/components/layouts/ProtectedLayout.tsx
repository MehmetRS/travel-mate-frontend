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

  // For public paths, show the content regardless of auth status
  if (PUBLIC_PATHS.includes(pathname)) {
    return <>{children}</>;
  }

  // Show protected content for authenticated users
  return <>{children}</>;
}
