'use client';

import Link from 'next/link';

interface TestTripCardProps {
  tripId: string;
}

export default function TestTripCard({ tripId }: TestTripCardProps) {
  return (
    <Link href={`/trips/${tripId}`} className="block p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
      TEST NAVIGATION - Click to go to trip {tripId}
    </Link>
  );
}
