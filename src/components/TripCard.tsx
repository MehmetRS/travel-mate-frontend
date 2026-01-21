'use client';

import { TripResponseDto } from '@/lib/types/backend-contracts';
import { StarIcon, CheckBadgeIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface TripCardProps {
  trip: TripResponseDto;
  status?: 'upcoming' | 'pending' | 'completed';
}

export default function TripCard({ trip, status = 'upcoming' }: TripCardProps) {
  const router = useRouter();
  const isFull = trip.isFull;

  // Status badge text and colors
  const getStatusBadge = () => {
    switch (status) {
      case 'upcoming':
        return { text: 'Upcoming', bgColor: 'bg-blue-100', textColor: 'text-blue-800' };
      case 'pending':
        return { text: 'Pending completion', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' };
      case 'completed':
        return { text: 'Completed', bgColor: 'bg-green-100', textColor: 'text-green-800' };
      default:
        return { text: 'Upcoming', bgColor: 'bg-blue-100', textColor: 'text-blue-800' };
    }
  };

  const statusBadge = getStatusBadge();

  const handleNavigation = (e: React.MouseEvent) => {
    e.preventDefault();
    // Encode trip data as base64 and pass via URL
    const tripData = JSON.stringify(trip);
    const encodedTripData = btoa(encodeURIComponent(tripData));
    router.push(`/trip/${trip.id}?tripData=${encodedTripData}`);
  };

  return (
    <div
      onClick={handleNavigation}
      className={`block rounded-lg border p-4 mb-4 transition-colors hover:shadow-md cursor-pointer ${
        isFull ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-100 hover:border-blue-200'
      }`}
    >
      {/* Header: From -> To */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className="font-medium">{trip.origin}</span>
            <span className="text-gray-400">→</span>
            <span className="font-medium">{trip.destination}</span>
          </div>
          <div className="text-sm text-gray-500">
            {new Date(trip.departureDateTime).toLocaleDateString('tr-TR')} - {new Date(trip.departureDateTime).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
        <div className="text-lg font-semibold text-blue-600">
          {trip.price} ₺
        </div>
      </div>

      {/* Driver Info */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            {trip.driver.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center space-x-1">
              <span className="font-medium">{trip.driver.name}</span>
              {trip.driver.isVerified && (
                <CheckBadgeIcon className="w-4 h-4 text-blue-500" />
              )}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
              <span>{trip.driver.rating.toFixed(1)}</span>
            </div>
          </div>
        </div>

        {/* Vehicle Info */}
        {trip.driver.vehicle && (
          <div className="text-sm text-gray-600">
            {trip.driver.vehicle.brand} {trip.driver.vehicle.model}
            <span className="text-gray-400 mx-1">•</span>
            {trip.driver.vehicle.type}
          </div>
        )}
      </div>

      {/* Status Badge and Seats */}
      <div className="flex items-center justify-between">
        <div className="text-sm">
          {isFull ? (
            <span className="text-red-500 font-medium">DOLU</span>
          ) : (
            <span>
              <span className="font-medium">{trip.availableSeats}</span> koltuk müsait
            </span>
          )}
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge.bgColor} ${statusBadge.textColor}`}>
          {statusBadge.text}
        </span>
      </div>
    </div>
  );
}
