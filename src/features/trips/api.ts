/**
 * Trips API
 * 
 * All trip-related API calls.
 * Aligned with backend /trips endpoints.
 */

import { get, post } from '@/lib/api/api-client';
import type {
  TripResponseDto,
  TripDetailResponseDto,
  CreateTripDto,
} from '@/lib/types/backend-contracts';

export interface TripsSearchParams {
  origin?: string;
  destination?: string;
  date?: string;
  minPrice?: number;
  maxPrice?: number;
  minSeats?: number;
  availableOnly?: boolean;
}

export const tripsApi = {
  /**
   * GET /trips
   * PUBLIC - no auth required
   */
  getAll: (params?: TripsSearchParams): Promise<TripResponseDto[]> => {
    const query = new URLSearchParams();
    if (params?.origin) query.set('origin', params.origin);
    if (params?.destination) query.set('destination', params.destination);
    if (params?.date) query.set('date', params.date);
    if (params?.minPrice) query.set('minPrice', params.minPrice.toString());
    if (params?.maxPrice) query.set('maxPrice', params.maxPrice.toString());
    if (params?.minSeats) query.set('minSeats', params.minSeats.toString());
    if (params?.availableOnly) query.set('availableOnly', params.availableOnly.toString());

    const queryString = query.toString();
    const path = queryString ? `/trips?${queryString}` : '/trips';

    return get<TripResponseDto[]>(path, { skipAuth: true });
  },

  /**
   * GET /trips/:id
   * PUBLIC - no auth required
   */
  getById: (id: string): Promise<TripDetailResponseDto> => {
    return get<TripDetailResponseDto>(`/trips/${id}`, { skipAuth: true });
  },

  /**
   * POST /trips
   * AUTH REQUIRED
   */
  create: (data: CreateTripDto): Promise<TripResponseDto> => {
    return post<TripResponseDto>('/trips', data);
  },
};
