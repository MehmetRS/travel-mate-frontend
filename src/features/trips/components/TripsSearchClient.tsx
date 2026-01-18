'use client';

import { useState, useEffect } from 'react';
import { useTrips } from '../hooks/useTrips';
import TripList from '@/components/TripList';
import TripCard from '@/components/TripCard';
import { TripResponseDto } from '@/lib/types/backend-contracts';

export default function TripsSearchClient() {
  // Filter state
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [minSeats, setMinSeats] = useState<number | undefined>(undefined);
  const [availableOnly, setAvailableOnly] = useState(false);

  // Build clean filters object - remove undefined/empty values
  const buildCleanFilters = () => {
    const filters = {
      origin,
      destination,
      date,
      minPrice,
      maxPrice,
      minSeats,
      availableOnly,
    };

    // Remove keys with undefined, empty string, or null values
    return Object.fromEntries(
      Object.entries(filters).filter(([_, v]) =>
        v !== undefined && v !== '' && v !== null
      )
    );
  };

  // Search state
  const [searchParams, setSearchParams] = useState<Record<string, any>>({});
  const { state, refetch } = useTrips(searchParams);

  // Make filters reactive - trigger search whenever filters change
  useEffect(() => {
    const cleanFilters = buildCleanFilters();
    setSearchParams(cleanFilters);
  }, [origin, destination, date, minPrice, maxPrice, minSeats, availableOnly]);

  const handleSearch = () => {
    const cleanFilters = buildCleanFilters();
    setSearchParams(cleanFilters);
  };

  const handleReset = () => {
    setOrigin('');
    setDestination('');
    setDate('');
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setMinSeats(undefined);
    setAvailableOnly(false);
    setSearchParams({});
  };

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Search Form */}
      <form className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-8" onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Origin</label>
            <input
              type="text"
              placeholder="Enter origin city"
              className="input-base"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
            <input
              type="text"
              placeholder="Enter destination city"
              className="input-base"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              className="input-base"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        {/* Additional Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
            <input
              type="number"
              placeholder="Min price"
              className="input-base"
              value={minPrice || ''}
              onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
            <input
              type="number"
              placeholder="Max price"
              className="input-base"
              value={maxPrice || ''}
              onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Min Seats</label>
            <input
              type="number"
              placeholder="Min seats"
              className="input-base"
              value={minSeats || ''}
              onChange={(e) => setMinSeats(e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>
          <div className="flex items-end">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="availableOnly"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                checked={availableOnly}
                onChange={(e) => setAvailableOnly(e.target.checked)}
              />
              <label htmlFor="availableOnly" className="ml-2 text-sm">
                Available Only
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
          <button
            type="button"
            className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </form>

      {/* Results */}
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          {/* 5-State Pattern Rendering */}
          {state.status === 'loading' && (
            <div className="text-center py-8">
              <p>Searching trips...</p>
            </div>
          )}

          {state.status === 'error' && (
            <div className="text-center py-8 text-red-500">
              <p>Error loading trips</p>
              <p className="text-sm">{state.error}</p>
            </div>
          )}

          {state.status === 'empty' && (
            <div className="text-center py-8 text-gray-500">
              <p>No trips found for selected criteria</p>
            </div>
          )}

          {state.status === 'success' && (
            <>
              <div className="mb-4 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {state.data.length} results found
                </div>
              </div>

              <div className="space-y-4">
                {state.data.map(trip => (
                  <TripCard key={trip.id} trip={trip} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
