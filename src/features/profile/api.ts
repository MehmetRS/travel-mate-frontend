/**
 * Profile API
 *
 * All profile and vehicle-related API calls.
 * Aligned with backend endpoints.
 */

import { get, post, del } from '@/lib/api/api-client';
import type {
  VehicleDto,
  CreateVehicleDto
} from '@/lib/types/backend-contracts';

// Extended user profile interface
export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  rating: number;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Re-export types for easier import
export type { VehicleDto, CreateVehicleDto };

export const profileApi = {
  /**
   * GET /me
   * AUTH REQUIRED - Get full user profile
   */
  getProfile: (): Promise<UserProfile> => {
    return get<UserProfile>('/me');
  },

  /**
   * GET /vehicles
   * AUTH REQUIRED - Get user's vehicles
   */
  getVehicles: (): Promise<VehicleDto[]> => {
    return get<VehicleDto[]>('/vehicles');
  },

  /**
   * POST /vehicles
   * AUTH REQUIRED - Add a new vehicle
   */
  addVehicle: (vehicleData: CreateVehicleDto | any): Promise<VehicleDto> => {
    return post<VehicleDto>('/vehicles', vehicleData);
  },

  /**
   * DELETE /vehicles/:id
   * AUTH REQUIRED - Delete a vehicle
   */
  deleteVehicle: (vehicleId: string): Promise<void> => {
    return del(`/vehicles/${vehicleId}`);
  },
};
