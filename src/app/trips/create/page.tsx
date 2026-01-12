'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAccessToken } from '@/lib/auth';
import { apiFetch } from '@/lib/api';

export default function CreateTripPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    departureDateTime: '',
    price: '',
    availableSeats: '',
    description: '',
  });

  // Form validation errors
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Check authentication
  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.push('/login');
    }
  }, [router]);

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

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submit
  const handleSubmit = async () => {
    setError(null);

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const response = await apiFetch('/trips', {
        method: 'POST',
        body: JSON.stringify({
          origin: formData.origin,
          destination: formData.destination,
          departureDateTime: new Date(formData.departureDateTime).toISOString(),
          price: Number(formData.price),
          availableSeats: Number(formData.availableSeats),
          description: formData.description || undefined,
        }),
      });

      // Redirect to the new trip's detail page
      router.push(`/trips/${response.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Yolculuk oluşturulamadı');
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

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
              className={`mt-1 block w-full rounded-md shadow-sm ${
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
              className={`mt-1 block w-full rounded-md shadow-sm ${
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
              className={`mt-1 block w-full rounded-md shadow-sm ${
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
              className={`mt-1 block w-full rounded-md shadow-sm ${
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
              className={`mt-1 block w-full rounded-md shadow-sm ${
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
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
              disabled={loading}
              onClick={handleSubmit}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                loading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
            >
              {loading ? 'Oluşturuluyor...' : 'Yolculuk Oluştur'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
