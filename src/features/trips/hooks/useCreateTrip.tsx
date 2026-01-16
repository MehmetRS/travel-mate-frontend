/**
 * useCreateTrip Hook
 *
 * Handles trip creation with form validation and submission.
 * Implements state management for create operations
 *
 * AUTH REQUIRED - only authenticated users can create trips
 * VEHICLE REQUIRED - user must have at least one vehicle
 */

'use client';

import { useState, useEffect } from 'react';
import { tripsApi } from '../api';
import { profileApi } from '@/features/profile/api';
import type { CreateTripDto, VehicleDto } from '@/lib/types/backend-contracts';
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
  vehicles: VehicleDto[];
  isLoadingVehicles: boolean;
  vehiclesError: string | null;
  refetchVehicles: () => Promise<void>;
}

// ============================================================================
// Hook
// ============================================================================

export function useCreateTrip(): UseCreateTripReturn {
  const [state, setState] = useState<CreateTripState>({ status: 'idle' });
  const [vehicles, setVehicles] = useState<VehicleDto[]>([]);
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(true);
  const [vehiclesError, setVehiclesError] = useState<string | null>(null);

  // Fetch vehicles on mount
  const fetchVehicles = async () => {
    try {
      setIsLoadingVehicles(true);
      setVehiclesError(null);
      const data = await profileApi.getVehicles();
      setVehicles(data);
    } catch (error) {
      console.error('Failed to fetch vehicles:', error);
      setVehiclesError('Failed to load vehicles. Please try again.');
    } finally {
      setIsLoadingVehicles(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

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
    vehicles,
    isLoadingVehicles,
    vehiclesError,
    refetchVehicles: fetchVehicles,
  };
}
