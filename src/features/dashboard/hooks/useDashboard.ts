/**
 * useDashboard Hook
 *
 * Centralized dashboard data fetching and state management.
 * Handles profile, trips, and vehicles data.
 */

'use client';

import { useState, useEffect } from 'react';
import { dashboardApi } from '../api';
import type { UserProfile, DashboardTripsParams } from '../api';
import type { TripResponseDto } from '@/lib/types/backend-contracts';

interface DashboardState {
  profile: UserProfile | null;
  upcomingTrips: TripResponseDto[];
  pastTrips: TripResponseDto[];
  isLoading: boolean;
  error: string | null;
}

export function useDashboard() {
  const [state, setState] = useState<DashboardState>({
    profile: null,
    upcomingTrips: [],
    pastTrips: [],
    isLoading: true,
    error: null,
  });

  const fetchDashboardData = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      // Fetch data in parallel
      const [profile, upcomingTrips, pastTrips] = await Promise.all([
        dashboardApi.getProfile(),
        dashboardApi.getTrips({ upcoming: true, role: 'all' }),
        dashboardApi.getTrips({ past: true, role: 'all' }),
      ]);

      setState({
        profile,
        upcomingTrips,
        pastTrips,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to load dashboard data. Please try again later.',
      }));
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    ...state,
    refetch: fetchDashboardData,
  };
}
