import { ReactNode } from 'react';

interface TripsLayoutProps {
  children: ReactNode;
}

export default function TripsLayout({ children }: TripsLayoutProps) {
  return <>{children}</>;
}
