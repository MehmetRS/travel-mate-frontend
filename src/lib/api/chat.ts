import { ChatResponse, CreateMessageRequest } from '../../types/chat';
import { get, post } from './api-client';

export const chatApi = {
  /**
   * Get chat for a trip
   * Requires authentication
   */
  getByTripId: async (tripId: string): Promise<ChatResponse> => {
    console.error(" chatApi.getByTripId CALLED WITH:", tripId);
    console.trace("STACK TRACE — chatApi.getByTripId");
    return get<ChatResponse>(`/trips/${tripId}/chat`);
  },

  /**
   * Create a new message in a trip's chat
   * Requires authentication
   */
  createMessage: async (tripId: string, data: CreateMessageRequest): Promise<ChatResponse> => {
    return post<ChatResponse>(`/trips/${tripId}/chat/messages`, data);
  }
};
