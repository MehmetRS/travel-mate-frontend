import TripDetailClient from "@/app/trips/TripDetailClient";

interface PageProps {
  params: { id: string };
}

export default function TripDetailPage({ params }: PageProps) {
  console.log("TRIP DETAIL PAGE PARAM:", params.id);
  return <TripDetailClient tripId={params.id} />;
}
