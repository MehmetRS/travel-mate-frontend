/**
 * Dashboard API
 *
 * All dashboard-related API calls.
 * Aligned with backend endpoints.
 */

import { get } from '@/lib/api/api-client';
import type {
  TripResponseDto,
  MeResponse
} from '@/lib/types/backend-contracts';

// Extended user profile interface
export interface UserProfile extends MeResponse {
  name: string | null;
  rating: number;
  isVerified: boolean;
  vehiclesCount: number;
}

export interface DashboardTripsParams {
  upcoming?: boolean;
  past?: boolean;
  role?: 'driver' | 'passenger' | 'all';
}

export const dashboardApi = {
  /**
   * GET /me
   * AUTH REQUIRED - Get user profile with extended data
   */
  getProfile: (): Promise<UserProfile> => {
    return get<UserProfile>('/me');
  },

  /**
   * GET /vehicles
   * AUTH REQUIRED - Get user's vehicles count
   */
  getVehiclesCount: (): Promise<number> => {
    return get<number>('/vehicles/count');
  },

  /**
   * GET /trips
   * AUTH REQUIRED - Get trips with filters
   */
  getTrips: (params: DashboardTripsParams): Promise<TripResponseDto[]> => {
    const query = new URLSearchParams();
    if (params.upcoming) query.set('upcoming', 'true');
    if (params.past) query.set('past', 'true');
    if (params.role) query.set('role', params.role);

    const queryString = query.toString();
    const path = queryString ? `/trips?${queryString}` : '/trips';

    return get<TripResponseDto[]>(path);
  },
};
