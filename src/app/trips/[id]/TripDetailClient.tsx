'use client';

import { useEffect, useState } from 'react';
import { Trip } from '@/lib/trip.types';
import { StarIcon, CheckBadgeIcon, ClockIcon, MapPinIcon } from '@heroicons/react/24/solid';
import { tripsApi } from '@/lib/api/trips';
import { ApiError, UnauthorizedError, ForbiddenError, ConflictError } from '@/lib/api/errors';
import { useRouter } from 'next/navigation';
import ChatPanel from './ChatPanel';

interface TripDetailContentProps {
  trip: Trip;
  onBook: () => Promise<void>;
  isBooking: boolean;
  bookingError: string | null;
  bookingSeats: number;
  onBookingSeatsChange: (seats: number) => void;
}

function TripDetailContent({
  trip,
  onBook,
  isBooking,
  bookingError,
  bookingSeats,
  onBookingSeatsChange
}: TripDetailContentProps) {
  const isFull = trip.isFull;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Trip Summary Section */}
        <div className={`rounded-lg border p-6 mb-6 ${isFull ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-100'}`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-xl font-semibold">{trip.origin}</span>
                <span className="text-gray-400">→</span>
                <span className="text-xl font-semibold">{trip.destination}</span>
              </div>
              <div className="flex items-center space-x-4 text-gray-600">
                <div className="flex items-center">
                  <ClockIcon className="w-5 h-5 mr-1" />
                  <span>
                    {new Date(trip.departureDateTime).toLocaleDateString('tr-TR')} - {' '}
                    {new Date(trip.departureDateTime).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div>
                  {isFull ? (
                    <span className="text-red-500 font-medium">DOLU</span>
                  ) : (
                    <span><span className="font-medium">{trip.availableSeats}</span> koltuk müsait</span>
                  )}
                </div>
              </div>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {trip.price} ₺
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Driver Information Section */}
          <div className="rounded-lg border p-6 bg-white">
            <h2 className="text-lg font-semibold mb-4">Sürücü Bilgileri</h2>
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-xl">
                {trip.driver.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-medium">{trip.driver.name}</span>
                  {trip.driver.isVerified && (
                    <CheckBadgeIcon className="w-5 h-5 text-blue-500" title="Doğrulanmış Sürücü" />
                  )}
                </div>
                <div className="flex items-center text-gray-600">
                  <StarIcon className="w-5 h-5 text-yellow-400 mr-1" />
                  <span>{trip.driver.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>
            {trip.driver.vehicle && (
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Araç Bilgileri</h3>
                <div className="text-gray-700">
                  <p>{trip.driver.vehicle.brand} {trip.driver.vehicle.model}</p>
                  <p>{trip.driver.vehicle.vehicleType}</p>
                  <p>{trip.driver.vehicle.seats} Koltuk</p>
                </div>
              </div>
            )}
          </div>

          {/* Trip Details Section */}
          <div className="rounded-lg border p-6 bg-white">
            <h2 className="text-lg font-semibold mb-4">Yolculuk Detayları</h2>
            {trip.description && (
              <div className="mb-4">
                <p className="text-gray-700">{trip.description}</p>
              </div>
            )}
            <div className="space-y-3">
              <div className="flex items-start">
                <MapPinIcon className="w-5 h-5 text-gray-400 mr-2 mt-1" />
                <div>
                  <p className="font-medium">Kalkış Noktası</p>
                  <p className="text-gray-600">{trip.origin}</p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPinIcon className="w-5 h-5 text-gray-400 mr-2 mt-1" />
                <div>
                  <p className="font-medium">Varış Noktası</p>
                  <p className="text-gray-600">{trip.destination}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Section */}
        {!isFull && (
          <div className="mt-6 rounded-lg border p-6 bg-white">
            <h2 className="text-lg font-semibold mb-4">Rezervasyon</h2>
            <div className="flex items-center gap-4 mb-4">
              <div>
                <label htmlFor="seats" className="block text-sm font-medium text-gray-700 mb-1">
                  Koltuk Sayısı
                </label>
                <select
                  id="seats"
                  className="input-base w-24"
                  value={bookingSeats}
                  onChange={(e) => onBookingSeatsChange(Number(e.target.value))}
                  disabled={isBooking}
                >
                  {Array.from({ length: trip.availableSeats }, (_, i) => i + 1).map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <button
                  onClick={onBook}
                  disabled={isBooking}
                  className={`w-full px-4 py-2 rounded-md text-white font-medium transition-colors ${
                    isBooking
                      ? 'bg-blue-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isBooking ? 'Rezervasyon Yapılıyor...' : 'Rezervasyon Yap'}
                </button>
              </div>
            </div>
            {bookingError && (
              <div className="text-red-500 text-sm">{bookingError}</div>
            )}
          </div>
        )}
        {/* Chat Section */}
        {!isFull && trip?.id && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-4">Sürücü ile İletişim</h2>
            <ChatPanel tripId={trip.id} />
          </div>
        )}
        {isFull && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Bu yolculuk için tüm koltuklar dolu.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

interface TripDetailClientProps {
  id: string;
}

export default function TripDetailClient({ id }: TripDetailClientProps) {
  const router = useRouter();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [bookingSeats, setBookingSeats] = useState(1);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    async function fetchTrip() {
      try {
        setLoading(true);
        setError(null);
        setNotFound(false);

        const data = await tripsApi.getById(id);
        if (!data || !data.id) {
          throw new ApiError(404, 'Trip not found');
        }
        setTrip(data);
      } catch (err: unknown) {
        if (err instanceof ApiError && err.status === 404) {
          setNotFound(true);
          return;
        }

        setError(
          err instanceof ApiError
            ? err.message
            : 'Yolculuk bilgileri yüklenirken bir hata oluştu'
        );
      } finally {
        setLoading(false);
        setHasFetched(true);
      }
    }

    fetchTrip();
  }, [id]);

  const handleBookTrip = async () => {
    try {
      setIsBooking(true);
      setBookingError(null);

      await tripsApi.book(id, { seats: bookingSeats });

      // Refresh trip data after booking
      const updatedTrip = await tripsApi.getById(id);
      setTrip(updatedTrip);

    } catch (err) {
      console.error('Failed to book trip:', err);

      if (err instanceof UnauthorizedError) {
        // Redirect to login if not authenticated
        router.push('/login');
        return;
      }

      if (err instanceof ForbiddenError) {
        setBookingError('Kendi yolculuğunuzu rezerve edemezsiniz');
      } else if (err instanceof ConflictError) {
        setBookingError('Yeterli boş koltuk bulunmuyor');
      } else {
        setBookingError(
          err instanceof ApiError
            ? err.message
            : 'Rezervasyon yapılırken bir hata oluştu'
        );
      }
    } finally {
      setIsBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-48 bg-gray-200 rounded-lg mb-6"></div>
          <div className="h-32 bg-gray-200 rounded-lg mb-6"></div>
          <div className="h-24 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Yolculuk Bulunamadı
          </h2>
          <p className="text-gray-600">
            Bu yolculuk mevcut değil veya kaldırılmış olabilir.
          </p>
        </div>
      </div>
    );
  }

  return (
    <TripDetailContent
      trip={trip!}
      onBook={handleBookTrip}
      isBooking={isBooking}
      bookingError={bookingError}
      bookingSeats={bookingSeats}
      onBookingSeatsChange={setBookingSeats}
    />
  );
}
