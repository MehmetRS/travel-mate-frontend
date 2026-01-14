import TripDetailClient from './TripDetailClient';

export const dynamicParams = true;

export default function Page({ params }: { params: { id: string } }) {
  return <TripDetailClient id={params.id} />;
}
