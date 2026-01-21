export const dynamic = 'force-dynamic';
export const revalidate = 0;

import TripDetailClient from "@/app/trips/TripDetailClient";

interface PageProps {
  params: { id: string };
}

export default function TripDetailPage({ params }: PageProps) {
  return <TripDetailClient />;
}
