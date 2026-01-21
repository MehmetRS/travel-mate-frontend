/**
 * useTripDetail Hook
 *
 * Fetches a single trip by ID with fallback logic.
 * Implementation:
 * 1. First tries to fetch via GET /trips/:id/public
 * 2. If that fails, falls back to useTrips() list filtering
 * 3. Only shows "not found" if both methods fail
 *
 * PUBLIC DATA - no auth required
 */

'use client';

import { useState, useEffect } from 'react';
import { useTrips } from './useTrips';
import { tripsApi } from '../api';
import type { TripDetailResponseDto, TripResponseDto } from '@/lib/types/backend-contracts';
import { isApiError } from '@/lib/api/api-errors';

// ============================================================================
// Types - 5 explicit states
// ============================================================================

type TripDetailState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: TripDetailResponseDto }
  | { status: 'notFound' }
  | { status: 'error'; error: string };

interface UseTripDetailReturn {
  state: TripDetailState;
  refetch: () => Promise<void>;
  isLoading: boolean;
  isSuccess: boolean;
  isNotFound: boolean;
  isError: boolean;
  trip: TripDetailResponseDto | null;
  error: string | null;
}

// ============================================================================
// Hook
// ============================================================================

export function useTripDetail(tripId: string): UseTripDetailReturn {
  const [state, setState] = useState<TripDetailState>({ status: 'idle' });
  const { trips: allTrips, isLoading: isTripsLoading, isSuccess: isTripsSuccess } = useTrips();

  useEffect(() => {
    fetchTripDetail();
  }, [tripId, isTripsSuccess]);

  const fetchTripDetail = async () => {
    setState({ status: 'loading' });

    try {
      // Step 1: Try to fetch directly via public endpoint
      const tripDetail = await tripsApi.getPublicTripById(tripId);

      if (tripDetail) {
        setState({ status: 'success', data: tripDetail });
        return;
      }
    } catch (error) {
      // If direct fetch fails, we'll try the fallback
      console.log('Direct trip fetch failed, trying fallback:', error);
    }

    // Step 2: Fallback to filtering from trips list
    try {
      if (isTripsSuccess && allTrips.length > 0) {
        const foundTrip = allTrips.find(trip => trip.id === tripId);

        if (foundTrip) {
          // Convert TripResponseDto to TripDetailResponseDto
          const tripDetail: TripDetailResponseDto = {
            ...foundTrip,
            createdAt: new Date().toISOString() // Add createdAt field for compatibility
          };
          setState({ status: 'success', data: tripDetail });
          return;
        }
      }

      // If we get here, neither method found the trip
      setState({ status: 'notFound' });

    } catch (fallbackError) {
      const message = isApiError(fallbackError)
        ? fallbackError.message
        : 'Failed to load trip details';

      setState({ status: 'error', error: message });
    }
  };

  // Convenience properties
  const isLoading = state.status === 'loading';
  const isSuccess = state.status === 'success';
  const isNotFound = state.status === 'notFound';
  const isError = state.status === 'error';
  const trip = state.status === 'success' ? state.data : null;
  const error = state.status === 'error' ? state.error : null;

  return {
    state,
    refetch: fetchTripDetail,
    isLoading,
    isSuccess,
    isNotFound,
    isError,
    trip,
    error,
  };
}
