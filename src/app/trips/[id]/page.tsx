import TripDetailClient from "./TripDetailClient";

interface PageProps {
  params: {
    id: string;
  };
}

export default function TripDetailPage({ params }: PageProps) {
  console.log(">>> SERVER PAGE /trips/[id] RENDERED", params.id);
  return <TripDetailClient tripId={params.id} />;
}
