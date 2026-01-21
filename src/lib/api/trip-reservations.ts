/**
 * Trip Reservations API
 *
 * Direct API calls to TripReservation table (NEW ARCHITECTURE)
 * No request/approval abstraction - direct DB operations
 */

import { get, post, patch, del } from './api-client';

export interface CreateTripReservationDto {
  tripId: string;
  seatCount: number;
}

export interface TripReservationResponseDto {
  id: string;
  tripId: string;
  userId: string;
  seatCount: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}

export interface UpdateTripReservationDto {
  status: 'ACCEPTED' | 'REJECTED' | 'CANCELLED';
}

export const tripReservationsApi = {
  /**
   * POST /reservations
   * AUTH REQUIRED - Create direct trip reservation
   * Maps 1:1 to TripReservation table
   */
  create: (
    data: CreateTripReservationDto
  ): Promise<TripReservationResponseDto> => {
    return post<TripReservationResponseDto>('/reservations', data);
  },

  /**
   * GET /trip-reservations
   * AUTH REQUIRED - Get all reservations for current user
   */
  getMyReservations: (): Promise<TripReservationResponseDto[]> => {
    return get<TripReservationResponseDto[]>(`/trip-reservations/mine`);
  },

  /**
   * GET /trip-reservations/trip/:tripId
   * AUTH REQUIRED - Get reservations for a specific trip (driver only)
   */
  getForTrip: (tripId: string): Promise<TripReservationResponseDto[]> => {
    return get<TripReservationResponseDto[]>(`/trip-reservations/trip/${tripId}`);
  },

  /**
   * PATCH /trip-reservations/:reservationId
   * AUTH REQUIRED - Update reservation status
   */
  update: (
    reservationId: string,
    data: UpdateTripReservationDto
  ): Promise<TripReservationResponseDto> => {
    return patch<TripReservationResponseDto>(
      `/trip-reservations/${reservationId}`,
      data
    );
  },

  /**
   * DELETE /trip-reservations/:reservationId
   * AUTH REQUIRED - Cancel reservation
   */
  cancel: (reservationId: string): Promise<void> => {
    return del(`/trip-reservations/${reservationId}`);
  },
};
