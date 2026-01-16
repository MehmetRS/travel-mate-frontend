import { redirect } from 'next/navigation';
import TripDetailClient from './TripDetailClient';

export const dynamicParams = true;

export default function Page({
  params,
}: {
  params: { id: string };
}) {
  // Treat this as a PURE ROUTE WRAPPER
  // If params.id is missing or falsy, immediately redirect to /trips
  // Do NOT render TripDetailClient, do NOT show error UI
  if (!params?.id) {
    redirect('/trips');
  }

  return <TripDetailClient id={params.id} />;
}
