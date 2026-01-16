/**
 * useCreateTrip Hook
 *
 * Handles trip creation with form validation and submission.
 * Implements state management for create operations
 *
 * AUTH REQUIRED - only authenticated users can create trips
 */

'use client';

import { useState } from 'react';
import { tripsApi } from '../api';
import type { CreateTripDto } from '@/lib/types/backend-contracts';
import { isApiError } from '@/lib/api/api-errors';

// ============================================================================
// Types - Create Trip States
// ============================================================================

type CreateTripState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: { id: string } }
  | { status: 'error'; error: string };

interface UseCreateTripReturn {
  state: CreateTripState;
  createTrip: (data: CreateTripDto) => Promise<void>;
  reset: () => void;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: string | null;
}

// ============================================================================
// Hook
// ============================================================================

export function useCreateTrip(): UseCreateTripReturn {
  const [state, setState] = useState<CreateTripState>({ status: 'idle' });

  const createTrip = async (data: CreateTripDto) => {
    setState({ status: 'loading' });

    try {
      const response = await tripsApi.create(data);
      setState({ status: 'success', data: { id: response.id } });
    } catch (error) {
      const message = isApiError(error)
        ? error.message
        : 'Failed to create trip';

      setState({ status: 'error', error: message });
    }
  };

  const reset = () => {
    setState({ status: 'idle' });
  };

  // Convenience properties
  const isLoading = state.status === 'loading';
  const isSuccess = state.status === 'success';
  const isError = state.status === 'error';
  const error = state.status === 'error' ? state.error : null;

  return {
    state,
    createTrip,
    reset,
    isLoading,
    isSuccess,
    isError,
    error,
  };
}
