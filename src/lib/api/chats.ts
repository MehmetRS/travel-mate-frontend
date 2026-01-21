/**
 * Chats API
 *
 * Direct API calls to Chat table (NEW ARCHITECTURE)
 * No request/approval abstraction - direct DB operations
 */

import { get, post } from './api-client';

export interface CreateChatDto {
  tripId: string;
  status?: 'PENDING' | 'ACCEPTED';
}

export interface ChatResponseDto {
  id: string;
  tripId: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}

export interface ChatMemberDto {
  id: string;
  chatId: string;
  userId: string;
  role: 'DRIVER' | 'PASSENGER';
  createdAt: string;
}

export const chatsApi = {
  /**
   * POST /chats
   * AUTH REQUIRED - Create direct chat
   * Maps 1:1 to Chat table
   */
  create: (
    data: CreateChatDto
  ): Promise<ChatResponseDto> => {
    return post<ChatResponseDto>('/chats', data);
  },

  /**
   * GET /chats/mine
   * AUTH REQUIRED - Get all chats for current user
   */
  getMyChats: (): Promise<ChatResponseDto[]> => {
    return get<ChatResponseDto[]>(`/chats/mine`);
  },

  /**
   * GET /chats/:chatId
   * AUTH REQUIRED - Get chat details
   */
  getById: (chatId: string): Promise<ChatResponseDto> => {
    return get<ChatResponseDto>(`/chats/${chatId}`);
  },

  /**
   * POST /chats/:chatId/members
   * AUTH REQUIRED - Add member to chat
   */
  addMember: (chatId: string, userId: string, role: 'DRIVER' | 'PASSENGER'): Promise<ChatMemberDto> => {
    return post<ChatMemberDto>(`/chats/${chatId}/members`, { userId, role });
  },

  /**
   * GET /chats/trip/:tripId
   * AUTH REQUIRED - Get chat for specific trip
   */
  getForTrip: (tripId: string): Promise<ChatResponseDto | null> => {
    return get<ChatResponseDto | null>(`/chats/trip/${tripId}`);
  },
};
