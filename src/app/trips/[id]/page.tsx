import { redirect } from 'next/navigation';
import TripDetailClient from './TripDetailClient';

export const dynamic = 'force-dynamic';

export default function TripDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div style={{ padding: 40 }}>
      <h1>Trip Detail Works</h1>
      <p>ID: {params.id}</p>
    </div>
  );
}
