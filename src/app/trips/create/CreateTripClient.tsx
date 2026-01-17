'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useCreateTrip } from '@/features/trips/hooks/useCreateTrip';
import type { CreateTripDto } from '@/lib/types/backend-contracts';
import Link from 'next/link';

export default function CreateTripClient() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const {
    createTrip,
    isLoading,
    isSuccess,
    error,
    reset,
    vehicles,
    isLoadingVehicles,
    vehiclesError,
    refetchVehicles,
  } = useCreateTrip();

  // Form state
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    departureDateTime: '',
    price: '',
    availableSeats: '',
    description: '',
    vehicleId: '',
  });

  // Form validation errors
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?returnUrl=/trips/create');
    }
  }, [authLoading, isAuthenticated, router]);

  // Handle successful trip creation
  useEffect(() => {
    if (isSuccess) {
      // Redirect to the new trip's detail page
      // Note: In a real implementation, we would get the trip ID from the success state
      // For now, we'll redirect to the trips list
      router.push('/trips');
    }
  }, [isSuccess, router]);

  // Validate form
  const validateForm = () => {
    const errors: Record<string, string> = {};
    const now = new Date();
    const departureDate = new Date(formData.departureDateTime);

    if (!formData.origin) {
      errors.origin = 'Kalkış noktası gerekli';
    }

    if (!formData.destination) {
      errors.destination = 'Varış noktası gerekli';
    }

    if (!formData.departureDateTime) {
      errors.departureDateTime = 'Kalkış tarihi gerekli';
    } else if (departureDate <= now) {
      errors.departureDateTime = 'Kalkış tarihi gelecekte olmalı';
    }

    const price = Number(formData.price);
    if (!formData.price) {
      errors.price = 'Fiyat gerekli';
    } else if (isNaN(price) || price <= 0) {
      errors.price = 'Geçerli bir fiyat girin';
    }

    const seats = Number(formData.availableSeats);
    if (!formData.availableSeats) {
      errors.availableSeats = 'Koltuk sayısı gerekli';
    } else if (isNaN(seats) || seats < 1 || !Number.isInteger(seats)) {
      errors.availableSeats = 'Geçerli bir koltuk sayısı girin';
    }

    if (!formData.vehicleId) {
      errors.vehicleId = 'Araç seçimi zorunlu';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submit
  const handleSubmit = async () => {
    // Clear previous errors
    reset();

    if (!validateForm()) {
      return;
    }

    try {
      const createData: CreateTripDto = {
        origin: formData.origin,
        destination: formData.destination,
        departureDateTime: new Date(formData.departureDateTime).toISOString(),
        price: Number(formData.price),
        availableSeats: Number(formData.availableSeats),
        description: formData.description || undefined,
        vehicleId: formData.vehicleId,
      };

      await createTrip(createData);
    } catch (err) {
      // Error is already handled by the hook
      console.error('Trip creation error:', err);
    }
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Show loading while checking auth or vehicles
  if (authLoading || isLoadingVehicles) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Yeni Yolculuk Oluştur</h1>

        <div className="space-y-6">
          {/* Origin */}
          <div>
            <label htmlFor="origin" className="block text-sm font-medium text-gray-700">
              Kalkış Noktası
            </label>
            <input
              type="text"
              id="origin"
              name="origin"
              value={formData.origin}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm px-3 py-2 border ${
                validationErrors.origin ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Örn: İstanbul"
            />
            {validationErrors.origin && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.origin}</p>
            )}
          </div>

          {/* Destination */}
          <div>
            <label htmlFor="destination" className="block text-sm font-medium text-gray-700">
              Varış Noktası
            </label>
            <input
              type="text"
              id="destination"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm px-3 py-2 border ${
                validationErrors.destination ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Örn: Ankara"
            />
            {validationErrors.destination && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.destination}</p>
            )}
          </div>

          {/* Departure Date & Time */}
          <div>
            <label htmlFor="departureDateTime" className="block text-sm font-medium text-gray-700">
              Kalkış Tarihi ve Saati
            </label>
            <input
              type="datetime-local"
              id="departureDateTime"
              name="departureDateTime"
              value={formData.departureDateTime}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm px-3 py-2 border ${
                validationErrors.departureDateTime ? 'border-red-300' : 'border-gray-300'
              }`}
              min={new Date().toISOString().slice(0, 16)}
            />
            {validationErrors.departureDateTime && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.departureDateTime}</p>
            )}
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Fiyat (₺)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm px-3 py-2 border ${
                validationErrors.price ? 'border-red-300' : 'border-gray-300'
              }`}
              min="0"
              step="0.01"
              placeholder="299.99"
            />
            {validationErrors.price && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.price}</p>
            )}
          </div>

          {/* Available Seats */}
          <div>
            <label htmlFor="availableSeats" className="block text-sm font-medium text-gray-700">
              Müsait Koltuk Sayısı
            </label>
            <input
              type="number"
              id="availableSeats"
              name="availableSeats"
              value={formData.availableSeats}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm px-3 py-2 border ${
                validationErrors.availableSeats ? 'border-red-300' : 'border-gray-300'
              }`}
              min="1"
              step="1"
              placeholder="4"
            />
            {validationErrors.availableSeats && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.availableSeats}</p>
            )}
          </div>

          {/* Vehicle Selection */}
          <div>
            <label htmlFor="vehicleId" className="block text-sm font-medium text-gray-700">
              Araç Seçimi
            </label>
            {vehicles.length === 0 ? (
              <div className="mt-1">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.065-1.742 3.065H4.42c-1.532 0-2.493-1.731-1.743-3.065l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        Yolculuk oluşturmak için en az bir araca ihtiyacınız var.{' '}
                        <Link href="/profile?reason=missing_vehicle" className="font-medium text-blue-600 hover:text-blue-500 underline">
                          Profil sayfama git
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <select
                id="vehicleId"
                name="vehicleId"
                value={formData.vehicleId}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm px-3 py-2 border ${
                  validationErrors.vehicleId ? 'border-red-300' : 'border-gray-300'
                }`}
                required
              >
                <option value="">Araç seçin</option>
                {vehicles.map(vehicle => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.brand} {vehicle.model} ({vehicle.type}) - {vehicle.seatCount} koltuk
                    {vehicle.licensePlate && ` - ${vehicle.licensePlate}`}
                  </option>
                ))}
              </select>
            )}
            {validationErrors.vehicleId && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.vehicleId}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Açıklama (Opsiyonel)
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 border"
              placeholder="Yolculuk hakkında detaylar..."
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="button"
              disabled={isLoading || !formData.vehicleId}
              onClick={handleSubmit}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                isLoading || !formData.vehicleId
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
            >
              {isLoading ? 'Oluşturuluyor...' : 'Yolculuk Oluştur'}
            </button>
            {!formData.vehicleId && (
              <p className="mt-2 text-sm text-gray-500 text-center">Lütfen bir araç seçin</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
