/**
 * useDashboard Hook
 *
 * Centralized dashboard data fetching and state management.
 * Uses /trips/dashboard as the single source of truth for trip visibility.
 */

'use client';

import { useState, useEffect } from 'react';
import { dashboardApi } from '../api';
import type { UserProfile, DashboardTripsResponse } from '../api';
import type { TripResponseDto } from '@/lib/types/backend-contracts';

interface DashboardState {
  profile: UserProfile | null;
  upcomingTrips: TripResponseDto[];
  pastPendingTrips: TripResponseDto[];
  pastCompletedTrips: TripResponseDto[];
  isLoading: boolean;
  error: string | null;
}

export function useDashboard() {
  const [state, setState] = useState<DashboardState>({
    profile: null,
    upcomingTrips: [],
    pastPendingTrips: [],
    pastCompletedTrips: [],
    isLoading: true,
    error: null,
  });

  const fetchDashboardData = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      // Fetch data in parallel - use /trips/dashboard as single source of truth
      const [profile, dashboardTrips] = await Promise.all([
        dashboardApi.getProfile(),
        dashboardApi.getDashboardTrips(),
      ]);

      setState({
        profile,
        upcomingTrips: dashboardTrips.upcoming,
        pastPendingTrips: dashboardTrips.past.pending,
        pastCompletedTrips: dashboardTrips.past.completed,
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
