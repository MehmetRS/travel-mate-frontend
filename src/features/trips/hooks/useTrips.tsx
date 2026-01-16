/**
 * useTrips Hook
 * 
 * Fetches list of trips with filters.
 * Implements 5-state pattern: loading, success, empty, error, initial
 * 
 * PUBLIC DATA - no auth required
 */

'use client';

import { useState, useEffect } from 'react';
import { tripsApi, type TripsSearchParams } from '../api';
import type { TripResponseDto } from '@/lib/types/backend-contracts';
import { isApiError } from '@/lib/api/api-errors';

// ============================================================================
// Types - 5 explicit states
// ============================================================================

type TripsState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: TripResponseDto[] }
  | { status: 'empty' }
  | { status: 'error'; error: string };

interface UseTripsReturn {
  state: TripsState;
  refetch: () => Promise<void>;
  isLoading: boolean;
  isSuccess: boolean;
  isEmpty: boolean;
  isError: boolean;
  trips: TripResponseDto[];
  error: string | null;
}

// ============================================================================
// Hook
// ============================================================================

export function useTrips(params?: TripsSearchParams): UseTripsReturn {
  const [state, setState] = useState<TripsState>({ status: 'idle' });

  useEffect(() => {
    fetchTrips();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.origin, params?.destination, params?.date, params?.minPrice, params?.maxPrice, params?.minSeats, params?.availableOnly]);

  const fetchTrips = async () => {
    setState({ status: 'loading' });

    try {
      const data = await tripsApi.getAll(params);

      if (data.length === 0) {
        setState({ status: 'empty' });
      } else {
        setState({ status: 'success', data });
      }
    } catch (error) {
      const message = isApiError(error)
        ? error.message
        : 'Failed to load trips';
      
      setState({ status: 'error', error: message });
    }
  };

  // Convenience properties
  const isLoading = state.status === 'loading';
  const isSuccess = state.status === 'success';
  const isEmpty = state.status === 'empty';
  const isError = state.status === 'error';
  const trips = state.status === 'success' ? state.data : [];
  const error = state.status === 'error' ? state.error : null;

  return {
    state,
    refetch: fetchTrips,
    isLoading,
    isSuccess,
    isEmpty,
    isError,
    trips,
    error,
  };
}
