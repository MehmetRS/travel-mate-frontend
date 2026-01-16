/**
 * useRequests Hook
 *
 * Centralized requests data fetching and state management.
 * Handles fetching, accepting, and rejecting trip requests.
 */

'use client';

import { useState, useEffect } from 'react';
import { requestsApi } from '../api';
import type {
  TripRequestResponseDto,
  UpdateTripRequestDto
} from '@/lib/types/backend-contracts';

interface RequestsState {
  requests: TripRequestResponseDto[];
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
}

export function useRequests() {
  const [state, setState] = useState<RequestsState>({
    requests: [],
    isLoading: true,
    error: null,
    successMessage: null,
  });

  const fetchRequests = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null, successMessage: null }));

      const data = await requestsApi.getAll();
      setState({
        requests: data,
        isLoading: false,
        error: null,
        successMessage: null,
      });
    } catch (error) {
      console.error('Failed to fetch requests:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to load requests. Please try again later.',
        successMessage: null,
      }));
    }
  };

  const updateRequest = async (requestId: string, action: UpdateTripRequestDto['action']) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null, successMessage: null }));

      const data: UpdateTripRequestDto = { action };
      const response = await requestsApi.update(requestId, data);

      // Update the request in the list
      setState(prev => ({
        requests: prev.requests.map(req =>
          req.id === requestId ? { ...req, ...response } : req
        ),
        isLoading: false,
        error: null,
        successMessage: getSuccessMessage(action),
      }));

      return response;
    } catch (error) {
      console.error(`Failed to ${action.toLowerCase()} request:`, error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: `Failed to ${action.toLowerCase()} request. Please try again.`,
        successMessage: null,
      }));
      throw error;
    }
  };

  const acceptRequest = async (requestId: string) => {
    return updateRequest(requestId, 'ACCEPT');
  };

  const rejectRequest = async (requestId: string) => {
    return updateRequest(requestId, 'REJECT');
  };

  const cancelRequest = async (requestId: string) => {
    return updateRequest(requestId, 'CANCEL');
  };

  const clearMessages = () => {
    setState(prev => ({
      ...prev,
      error: null,
      successMessage: null,
    }));
  };

  // Initial fetch
  useEffect(() => {
    fetchRequests();
  }, []);

  return {
    ...state,
    refetch: fetchRequests,
    acceptRequest,
    rejectRequest,
    cancelRequest,
    clearMessages,
  };
}

// Helper function to generate success messages
function getSuccessMessage(action: UpdateTripRequestDto['action']): string {
  switch (action) {
    case 'ACCEPT':
      return 'Request accepted successfully! Chat created automatically.';
    case 'REJECT':
      return 'Request rejected successfully.';
    case 'CANCEL':
      return 'Request cancelled successfully.';
    default:
      return 'Request updated successfully.';
  }
}
