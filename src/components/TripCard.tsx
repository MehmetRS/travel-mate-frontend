import { Trip } from '@/lib/trip.types';
import { StarIcon, CheckBadgeIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

interface TripCardProps {
  trip: Trip;
}

export default function TripCard({ trip }: TripCardProps) {
  const isFull = trip.isFull;

  return (
    <div 
      className={`rounded-lg border p-4 mb-4 transition-colors ${
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
            {trip.driver.vehicle.vehicleType}
          </div>
        )}
      </div>

      {/* Seats & Status */}
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
        <Link 
          href={`/trips/${trip.id}`}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
            isFull 
              ? 'bg-gray-100 text-gray-500 opacity-75'
              : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
          }`}
        >
          Detaylar
        </Link>
      </div>
    </div>
  );
}
