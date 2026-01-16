import { ChatResponse, CreateMessageRequest } from '../../types/chat';
import { get, post } from './api-client';

export const chatApi = {
  /**
   * Get chat by ID
   * Requires authentication
   */
  getById: async (chatId: string): Promise<ChatResponse> => {
    return get<ChatResponse>(`/chats/${chatId}`);
  },

  /**
   * Get chat messages with pagination
   * Requires authentication
   */
  getMessages: async (chatId: string): Promise<ChatResponse> => {
    return get<ChatResponse>(`/chats/${chatId}/messages`);
  },

  /**
   * Create a new message in a chat
   * Requires authentication
   */
  createMessage: async (chatId: string, data: CreateMessageRequest): Promise<ChatResponse> => {
    return post<ChatResponse>(`/chats/${chatId}/messages`, data);
  },

  /**
   * Get chat for a trip (legacy)
   * Requires authentication
   */
  getByTripId: async (tripId: string): Promise<ChatResponse> => {
    return get<ChatResponse>(`/trips/${tripId}/chat`);
  },

  /**
   * Create a new message in a trip's chat (legacy)
   * Requires authentication
   */
  createMessageForTrip: async (tripId: string, data: CreateMessageRequest): Promise<ChatResponse> => {
    return post<ChatResponse>(`/trips/${tripId}/chat/messages`, data);
  }
};
