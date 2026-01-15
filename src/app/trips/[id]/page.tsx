import TripDetailClient from './TripDetailClient';

export const dynamicParams = true;

export default function Page({
  params,
}: {
  params: { id: string };
}) {
  console.log(' PAGE PARAMS:', params);
  return <TripDetailClient id={params.id} />;
}
