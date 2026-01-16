/**
 * useChat Hook
 *
 * Centralized chat data fetching and state management.
 * Handles message history, sending messages, and real-time updates.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { chatApi } from '@/lib/api/chat';
import { useAuth } from '@/features/auth/hooks/useAuth';
import type { Message, CreateMessageRequest } from '@/types/chat';
import { MessageType } from '@/types/chat';

interface ChatState {
  chatId: string | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  isSending: boolean;
  sendError: string | null;
}

export function useChat(chatId: string) {
  const { user } = useAuth();
  const [state, setState] = useState<ChatState>({
    chatId: null,
    messages: [],
    isLoading: true,
    error: null,
    isSending: false,
    sendError: null,
  });

  // Fetch chat messages
  const fetchMessages = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await chatApi.getMessages(chatId);

      if (!response.exists) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Chat not found or you do not have access.',
        }));
        return;
      }

      setState(prev => ({
        ...prev,
        chatId: response.chatId || chatId,
        messages: response.messages || [],
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      console.error('Failed to fetch chat messages:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to load chat messages. Please try again later.',
      }));
    }
  }, [chatId]);

  // Send a new message
  const sendMessage = async (content: string, messageType: MessageType = MessageType.TEXT, metadata?: Record<string, any>) => {
    if (!user || !state.chatId) {
      setState(prev => ({
        ...prev,
        sendError: 'You must be authenticated to send messages.',
      }));
      return;
    }

    try {
      setState(prev => ({
        ...prev,
        isSending: true,
        sendError: null,
      }));

      const messageData: CreateMessageRequest = {
        content,
        messageType,
        metadata,
      };

      const response = await chatApi.createMessage(state.chatId, messageData);

      // Optimistically add the message to the list
      const newMessage: Message = {
        id: 'temp-' + Date.now(),
        content,
        senderId: user.id,
        messageType,
        metadata,
        createdAt: new Date().toISOString(),
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, newMessage],
        isSending: false,
        sendError: null,
      }));

      // If the response contains updated messages, replace our optimistic message
      if (response.messages && response.messages.length > 0) {
        const latestMessage = response.messages[response.messages.length - 1];
        setState(prev => ({
          ...prev,
          messages: prev.messages.map(msg =>
            msg.id === newMessage.id ? latestMessage : msg
          ),
        }));
      }

      return response;
    } catch (error) {
      console.error('Failed to send message:', error);
      setState(prev => ({
        ...prev,
        isSending: false,
        sendError: 'Failed to send message. Please try again.',
      }));
      throw error;
    }
  };

  // Poll for new messages (simple polling implementation)
  useEffect(() => {
    if (!state.chatId || state.isLoading) return;

    const pollingInterval = setInterval(() => {
      fetchMessages();
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(pollingInterval);
  }, [state.chatId, state.isLoading, fetchMessages]);

  // Initial fetch
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const clearErrors = () => {
    setState(prev => ({
      ...prev,
      error: null,
      sendError: null,
    }));
  };

  return {
    ...state,
    refetch: fetchMessages,
    sendMessage,
    clearErrors,
  };
}
