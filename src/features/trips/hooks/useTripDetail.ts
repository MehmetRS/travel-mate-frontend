/**
 * useTripDetail Hook
 *
 * Fetches a single trip by ID using ONLY public trips data.
 * Single source of truth: GET /trips/public
 *
 * PUBLIC DATA - no auth required
 */

'use client';

import { useState, useEffect } from 'react';
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

  useEffect(() => {
    fetchTripDetail();
  }, [tripId]);

  const fetchTripDetail = async () => {
    setState({ status: 'loading' });

    try {
      // Step 1: Fetch ALL public trips
      const publicTrips = await tripsApi.getPublicTrips();

      // Step 2: Find the specific trip by ID
      const foundTrip = publicTrips.find(trip => trip.id === tripId);

      if (foundTrip) {
        // Convert TripResponseDto to TripDetailResponseDto
        const tripDetail: TripDetailResponseDto = {
          ...foundTrip,
          createdAt: new Date().toISOString() // Add createdAt field for compatibility
        };
        setState({ status: 'success', data: tripDetail });
        return;
      }

      // Step 3: If we get here, the request succeeded but trip wasn't found
      setState({ status: 'notFound' });

    } catch (error) {
      const message = isApiError(error)
        ? error.message
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
