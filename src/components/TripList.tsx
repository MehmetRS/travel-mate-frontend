'use client';

import { TripFilters } from '@/lib/trip.types';
import { useTrips } from '@/features/trips/hooks/useTrips';
import TripCard from './TripCard';

interface TripListProps {
  filters: TripFilters;
  className?: string;
}

export default function TripList({ filters, className = '' }: TripListProps) {
  const { isLoading, isEmpty, isError, trips, error } = useTrips({
    date: filters.date,
  });

  return (
    <div className={className}>
      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-24 bg-gray-200 rounded-lg"></div>
            <div className="h-24 bg-gray-200 rounded-lg"></div>
            <div className="h-24 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="text-center py-8 text-red-500">
          <p>Yolculuklar yüklenirken bir hata oluştu.</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {isEmpty && (
        <div className="text-center py-8 text-gray-500">
          Bu kriterlere uygun yolculuk bulunamadı.
        </div>
      )}

      {/* Success State - Trip Cards */}
      {!isLoading && !isError && trips.length > 0 && (
        <>
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {trips.length} sonuç bulundu
            </div>
          </div>

          <div className="space-y-4">
            {trips.map(trip => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
