'use client';

import { useState, useEffect } from 'react';
import { Trip, TripFilters, TripSortOption } from '@/lib/trip.types';
import { tripsApi } from '@/lib/api/trips';
import { ApiError } from '@/lib/api/errors';
import TripCard from './TripCard';

interface TripListProps {
  filters: TripFilters;
  className?: string;
}

export default function TripList({ filters, className = '' }: TripListProps) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<TripSortOption>(TripSortOption.DATE_ASC);

  useEffect(() => {
    async function fetchTrips() {
      try {
        setLoading(true);
        setError(null);
        const data = await tripsApi.list(filters, sortOption);
        setTrips(data);
      } catch (err) {
        console.error('Failed to fetch trips:', err);
        setError(
          err instanceof ApiError 
            ? err.message 
            : 'Yolculuklar yüklenirken bir hata oluştu'
        );
      } finally {
        setLoading(false);
      }
    }

    fetchTrips();
  }, [filters, sortOption]);

  return (
    <div className={className}>
      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-24 bg-gray-200 rounded-lg"></div>
            <div className="h-24 bg-gray-200 rounded-lg"></div>
            <div className="h-24 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-8 text-red-500">
          <p>Yolculuklar yüklenirken bir hata oluştu.</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Content */}
      {!loading && !error && (
        <>
          {/* Sort Options */}
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {trips.length} sonuç bulundu
            </div>
            <select
              className="input-base max-w-[200px]"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as TripSortOption)}
            >
              <option value={TripSortOption.DATE_ASC}>Tarihe göre (önce yakın)</option>
              <option value={TripSortOption.DATE_DESC}>Tarihe göre (önce uzak)</option>
              <option value={TripSortOption.PRICE_ASC}>Fiyat (düşükten yükseğe)</option>
              <option value={TripSortOption.PRICE_DESC}>Fiyat (yüksekten düşüğe)</option>
              <option value={TripSortOption.RATING_DESC}>Puan (yüksekten düşüğe)</option>
            </select>
          </div>

          {/* Trip Cards */}
          <div className="space-y-4">
            {trips.map(trip => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>

          {/* Empty State */}
          {trips.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Bu kriterlere uygun yolculuk bulunamadı.
            </div>
          )}
        </>
      )}
    </div>
  );
}
