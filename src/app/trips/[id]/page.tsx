import TripDetailClient from "../TripDetailClient";

interface PageProps {
  params: {
    id: string;
  };
}

export default function TripDetailPage({ params }: PageProps) {
  return <TripDetailClient tripId={params.id} />;
}
