'use client';

import { useState } from 'react';
import { TripFilters as TripFiltersType } from '@/lib/trip.types';
import TripFilters from '@/components/TripFilters';
import TripList from '@/components/TripList';

export default function TripsPage() {
  const [filters, setFilters] = useState<TripFiltersType>({
    minPrice: undefined,
    maxPrice: undefined,
    date: undefined,
    verifiedOnly: false,
    minSeats: 1
  });

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nereden</label>
            <input
              type="text"
              placeholder="Şehir seçin"
              className="input-base"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nereye</label>
            <input
              type="text"
              placeholder="Şehir seçin"
              className="input-base"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tarih</label>
            <input
              type="date"
              className="input-base"
              onChange={(e) => setFilters({ ...filters, date: e.target.value || undefined })}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <TripFilters
            onFilterChange={setFilters}
            className="sticky top-4"
          />
        </aside>

        {/* Trip List */}
        <div className="flex-1">
          <TripList filters={filters} />
        </div>
      </div>
    </main>
  );
}