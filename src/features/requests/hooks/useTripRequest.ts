/**
 * useTripRequest Hook
 *
 * Fetches the current user's request for a specific trip.
 * Handles authentication and authorization automatically.
 * Returns null if no request exists or user is not authenticated.
 */

'use client';

import { useState, useEffect } from 'react';
import { requestsApi } from '../api';
import type { TripRequestResponseDto } from '@/lib/types/backend-contracts';
import { isApiError, isNotFoundError, isUnauthorizedError } from '@/lib/api/api-errors';

type TripRequestState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: TripRequestResponseDto }
  | { status: 'notFound' }
  | { status: 'unauthorized' }
  | { status: 'error'; error: string };

interface UseTripRequestReturn {
  state: TripRequestState;
  refetch: () => Promise<void>;
  isLoading: boolean;
  isSuccess: boolean;
  isNotFound: boolean;
  isUnauthorized: boolean;
  isError: boolean;
  request: TripRequestResponseDto | null;
  error: string | null;
}

export function useTripRequest(tripId: string): UseTripRequestReturn {
  const [state, setState] = useState<TripRequestState>({ status: 'idle' });

  useEffect(() => {
    if (!tripId) return;
    fetchRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripId]);

  const fetchRequest = async () => {
    if (!tripId) return;

    setState({ status: 'loading' });

    try {
      const data = await requestsApi.getMyRequestForTrip(tripId);

      if (data) {
        setState({ status: 'success', data });
      } else {
        setState({ status: 'notFound' });
      }
    } catch (error) {
      if (isUnauthorizedError(error)) {
        setState({ status: 'unauthorized' });
        return;
      }

      if (isNotFoundError(error)) {
        setState({ status: 'notFound' });
        return;
      }

      const message = isApiError(error)
        ? error.message
        : 'Failed to load request';

      setState({ status: 'error', error: message });
    }
  };

  // Convenience properties
  const isLoading = state.status === 'loading';
  const isSuccess = state.status === 'success';
  const isNotFound = state.status === 'notFound';
  const isUnauthorized = state.status === 'unauthorized';
  const isError = state.status === 'error';
  const request = state.status === 'success' ? state.data : null;
  const error = state.status === 'error' ? state.error : null;

  return {
    state,
    refetch: fetchRequest,
    isLoading,
    isSuccess,
    isNotFound,
    isUnauthorized,
    isError,
    request,
    error,
  };
}
