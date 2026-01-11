import { useState } from 'react';
import { TripFilters as TripFiltersType } from '@/lib/trip.types';

interface TripFiltersProps {
  onFilterChange: (filters: TripFiltersType) => void;
  className?: string;
}

export default function TripFilters({ onFilterChange, className = '' }: TripFiltersProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [filters, setFilters] = useState<TripFiltersType>({
    minPrice: undefined,
    maxPrice: undefined,
    date: undefined,
    verifiedOnly: false,
    minSeats: 1
  });

  const handleFilterChange = (key: keyof TripFiltersType, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* Mobile Toggle */}
      <button
        className="w-full p-4 text-left font-medium flex items-center justify-between md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        Filtreler
        <svg
          className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Filter Content */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:block p-4 space-y-6`}>
        {/* Price Range */}
        <div>
          <h3 className="font-medium mb-2">Fiyat Aralığı</h3>
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Min ₺"
              className="input-base w-1/2"
              value={filters.minPrice || ''}
              onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
            />
            <input
              type="number"
              placeholder="Max ₺"
              className="input-base w-1/2"
              value={filters.maxPrice || ''}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>
        </div>

        {/* Date */}
        <div>
          <h3 className="font-medium mb-2">Tarih</h3>
          <input
            type="date"
            className="input-base"
            value={filters.date || ''}
            onChange={(e) => handleFilterChange('date', e.target.value || undefined)}
          />
        </div>

        {/* Minimum Seats */}
        <div>
          <h3 className="font-medium mb-2">Minimum Koltuk</h3>
          <select
            className="input-base"
            value={filters.minSeats}
            onChange={(e) => handleFilterChange('minSeats', Number(e.target.value))}
          >
            {[1, 2, 3, 4].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>

        {/* Verified Only */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="verifiedOnly"
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            checked={filters.verifiedOnly}
            onChange={(e) => handleFilterChange('verifiedOnly', e.target.checked)}
          />
          <label htmlFor="verifiedOnly" className="ml-2 text-sm">
            Sadece doğrulanmış profiller
          </label>
        </div>

        {/* Reset Button */}
        <button
          className="w-full py-2 text-sm text-gray-600 hover:text-gray-900"
          onClick={() => {
            const defaultFilters = {
              minPrice: undefined,
              maxPrice: undefined,
              date: undefined,
              verifiedOnly: false,
              minSeats: 1
            };
            setFilters(defaultFilters);
            onFilterChange(defaultFilters);
          }}
        >
          Filtreleri Temizle
        </button>
      </div>
    </div>
  );
}