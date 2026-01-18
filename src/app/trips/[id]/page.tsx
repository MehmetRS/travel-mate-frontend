import { redirect } from 'next/navigation';
import TripDetailClient from './TripDetailClient';

export const dynamic = 'force-dynamic';

export default function TripDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <TripDetailClient id={params.id} />
    </div>
  );
}
