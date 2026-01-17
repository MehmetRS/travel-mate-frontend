/**
 * Requests API
 *
 * All trip request-related API calls (NEW FEATURE).
 * Aligned with backend /trips/:tripId/requests and /requests endpoints.
 */

import { get, post, patch } from '@/lib/api/api-client';
import type {
  CreateTripRequestDto,
  TripRequestResponseDto,
  UpdateTripRequestDto,
} from '@/lib/types/backend-contracts';

export const requestsApi = {
  /**
   * POST /trips/:tripId/requests
   * AUTH REQUIRED - Create booking or chat request
   */
  create: (
    tripId: string,
    data: CreateTripRequestDto
  ): Promise<TripRequestResponseDto> => {
    return post<TripRequestResponseDto>(`/trips/${tripId}/requests`, data);
  },

  /**
   * GET /trips/:tripId/requests
   * AUTH REQUIRED - Get all requests for a trip (trip owner only)
   */
  getForTrip: (tripId: string): Promise<TripRequestResponseDto[]> => {
    return get<TripRequestResponseDto[]>(`/trips/${tripId}/requests`);
  },

  /**
   * GET /requests
   * AUTH REQUIRED - Get all requests for current user (as trip owner)
   */
  getAll: (): Promise<TripRequestResponseDto[]> => {
    return get<TripRequestResponseDto[]>(`/requests`);
  },

  /**
   * GET /requests/mine?tripId=:tripId
   * AUTH REQUIRED - Get current user's request for a specific trip (as passenger)
   */
  getMyRequestForTrip: (tripId: string): Promise<TripRequestResponseDto | null> => {
    return get<TripRequestResponseDto | null>(`/requests/mine?tripId=${tripId}`);
  },

  /**
   * PATCH /requests/:requestId
   * AUTH REQUIRED - Accept/reject/cancel request
   */
  update: (
    requestId: string,
    data: UpdateTripRequestDto
  ): Promise<TripRequestResponseDto & { chatId?: string }> => {
    return patch<TripRequestResponseDto & { chatId?: string }>(
      `/requests/${requestId}`,
      data
    );
  },
};
