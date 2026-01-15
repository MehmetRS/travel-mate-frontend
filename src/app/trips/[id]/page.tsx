import TripDetailClient from './TripDetailClient';

type PageProps = {
  params: {
    id: string;
  };
};

export const dynamicParams = true;

export default function Page({ params }: PageProps) {
  return <TripDetailClient id={params.id} />;
}
