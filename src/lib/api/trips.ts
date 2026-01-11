import { Trip, TripFilters, TripSortOption } from '../trip.types';
import { get, post } from './client';

export interface CreateTripRequest {
  origin: string;
  destination: string;
  departureDateTime: string;
  price: number;
  availableSeats: number;
  description?: string;
}

export interface BookTripRequest {
  seats: number;
}

export const tripsApi = {
  /**
   * List all trips
   * Public endpoint - no auth required
   */
  list: async (filters?: TripFilters, sort?: TripSortOption): Promise<Trip[]> => {
    const searchParams = new URLSearchParams();
    
    if (filters) {
      if (filters.minPrice) searchParams.append('minPrice', filters.minPrice.toString());
      if (filters.maxPrice) searchParams.append('maxPrice', filters.maxPrice.toString());
      if (filters.date) searchParams.append('date', filters.date);
      if (filters.verifiedOnly) searchParams.append('verifiedOnly', 'true');
      if (filters.minSeats) searchParams.append('minSeats', filters.minSeats.toString());
    }
    
    if (sort) {
      searchParams.append('sort', sort);
    }

    const queryString = searchParams.toString();
    const url = `/trips${queryString ? `?${queryString}` : ''}`;
    
    return get<Trip[]>(url);
  },

  /**
   * Get trip details by ID
   * Public endpoint - no auth required
   */
  getById: async (id: string): Promise<Trip> => {
    return get<Trip>(`/trips/${id}`);
  },

  /**
   * Create a new trip
   * Requires authentication
   */
  create: async (data: CreateTripRequest): Promise<Trip> => {
    return post<Trip>('/trips', data);
  },

  /**
   * Book seats on a trip
   * Requires authentication
   */
  book: async (tripId: string, data: BookTripRequest): Promise<Trip> => {
    return post<Trip>(`/trips/${tripId}/book`, data);
  }
};
