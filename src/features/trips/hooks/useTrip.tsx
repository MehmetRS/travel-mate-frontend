/**
 * useTrip Hook
 * 
 * Fetches single trip by ID.
 * Implements 5-state pattern: loading, success, notFound, error, initial
 * 
 * PUBLIC DATA - no auth required
 */

'use client';

import { useState, useEffect } from 'react';
import { tripsApi } from '../api';
import type { TripDetailResponseDto } from '@/lib/types/backend-contracts';
import { isApiError, isNotFoundError } from '@/lib/api/api-errors';

// ============================================================================
// Types - 5 explicit states
// ============================================================================

type TripState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: TripDetailResponseDto }
  | { status: 'notFound' }
  | { status: 'error'; error: string };

interface UseTripReturn {
  state: TripState;
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

export function useTrip(id: string): UseTripReturn {
  const [state, setState] = useState<TripState>({ status: 'idle' });

  useEffect(() => {
    // id validation belongs ONLY to route layer
    // TripDetailClient should assume id is always valid
    if (!id) return;

    fetchTrip();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchTrip = async () => {
    // id validation belongs ONLY to route layer
    // TripDetailClient should assume id is always valid
    if (!id) return;

    setState({ status: 'loading' });

    try {
      const data = await tripsApi.getById(id);
      setState({ status: 'success', data });
    } catch (error) {
      // 404 - trip not found
      if (isNotFoundError(error)) {
        setState({ status: 'notFound' });
        return;
      }

      // Other errors
      const message = isApiError(error)
        ? error.message
        : 'Failed to load trip';
      
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
    refetch: fetchTrip,
    isLoading,
    isSuccess,
    isNotFound,
    isError,
    trip,
    error,
  };
}
