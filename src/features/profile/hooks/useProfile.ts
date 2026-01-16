/**
 * useProfile Hook
 *
 * Centralized profile and vehicle data fetching and state management.
 * Handles profile info, vehicles, and vehicle management operations.
 */

'use client';

import { useState, useEffect } from 'react';
import { profileApi } from '../api';
import type { UserProfile, VehicleDto, CreateVehicleDto } from '../api';

interface ProfileState {
  profile: UserProfile | null;
  vehicles: VehicleDto[];
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
}

export function useProfile() {
  const [state, setState] = useState<ProfileState>({
    profile: null,
    vehicles: [],
    isLoading: true,
    error: null,
    successMessage: null,
  });

  const fetchProfileData = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null, successMessage: null }));

      // Fetch data in parallel
      const [profile, vehicles] = await Promise.all([
        profileApi.getProfile(),
        profileApi.getVehicles(),
      ]);

      setState({
        profile,
        vehicles,
        isLoading: false,
        error: null,
        successMessage: null,
      });
    } catch (error) {
      console.error('Failed to fetch profile data:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to load profile data. Please try again later.',
        successMessage: null,
      }));
    }
  };

  const addVehicle = async (vehicleData: CreateVehicleDto) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null, successMessage: null }));

      const newVehicle = await profileApi.addVehicle(vehicleData);

      setState(prev => ({
        ...prev,
        vehicles: [...prev.vehicles, newVehicle],
        isLoading: false,
        successMessage: 'Vehicle added successfully!',
      }));

      return newVehicle;
    } catch (error) {
      console.error('Failed to add vehicle:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to add vehicle. Please check your input and try again.',
        successMessage: null,
      }));
      throw error;
    }
  };

  const deleteVehicle = async (vehicleId: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null, successMessage: null }));

      await profileApi.deleteVehicle(vehicleId);

      setState(prev => ({
        ...prev,
        vehicles: prev.vehicles.filter(v => v.id !== vehicleId),
        isLoading: false,
        successMessage: 'Vehicle deleted successfully!',
      }));
    } catch (error) {
      console.error('Failed to delete vehicle:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to delete vehicle. Please try again.',
        successMessage: null,
      }));
      throw error;
    }
  };

  const clearMessages = () => {
    setState(prev => ({
      ...prev,
      error: null,
      successMessage: null,
    }));
  };

  // Initial fetch
  useEffect(() => {
    fetchProfileData();
  }, []);

  return {
    ...state,
    refetch: fetchProfileData,
    addVehicle,
    deleteVehicle,
    clearMessages,
  };
}
