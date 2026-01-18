'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { chatApi } from '@/lib/api/chat';
import { ChatResponse, ChatStatus } from '@/types/chat';
import { ApiError, UnauthorizedError } from '@/lib/api/errors';
import ChatMessages from '@/components/chat/ChatMessages';
import ChatInput from '@/components/chat/ChatInput';
import ChatStart from '@/components/chat/ChatStart';

interface ChatPanelProps {
  tripId: string;
}

export default function ChatPanel({ tripId }: ChatPanelProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chatData, setChatData] = useState<ChatResponse | null>(null);

  // Check authentication
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }
  }, [authLoading, isAuthenticated, router]);

  // Fetch chat data
  useEffect(() => {
    if (!tripId) return;

    async function fetchChat() {
      try {
        setLoading(true);
        setError(null);
        const data = await chatApi.getByTripId(tripId);
        setChatData(data);
      } catch (err) {
        console.error('Failed to load chat:', err);
        if (err instanceof UnauthorizedError) {
          router.push('/login');
          return;
        }
        setError(
          err instanceof ApiError
            ? err.message
            : 'Sohbet yüklenirken bir hata oluştu'
        );
      } finally {
        setLoading(false);
      }
    }

    fetchChat();
  }, [tripId]);

  // Handle sending message
  const handleSendMessage = async (content: string) => {
    try {
      setError(null);
      const response = await chatApi.createMessage(tripId, { content });
      setChatData(response);
    } catch (err) {
      console.error('Failed to send message:', err);
      if (err instanceof UnauthorizedError) {
        router.push('/login');
        return;
      }
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : 'Mesaj gönderilemedi';
      setError(errorMessage);
      throw err; // Re-throw to let ChatInput handle the error state
    }
  };

  // Handle starting new chat
  const handleStartChat = async () => {
    try {
      setError(null);
      const response = await chatApi.createMessage(tripId, { content: 'Merhaba!' });
      setChatData(response);
    } catch (err) {
      console.error('Failed to start chat:', err);
      if (err instanceof UnauthorizedError) {
        router.push('/login');
        return;
      }
      setError(
        err instanceof ApiError 
          ? err.message 
          : 'Sohbet başlatılamadı'
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  if (!chatData?.exists) {
    return <ChatStart onStartChat={handleStartChat} />;
  }

  // Check if chat status is ACCEPTED (new backend rule)
  if (chatData.status !== ChatStatus.ACCEPTED) {
    return (
      <div className="p-4 text-center text-yellow-600">
        <p>Sohbet henüz kabul edilmedi. Lütfen bekleyin.</p>
        {chatData.status === ChatStatus.PENDING && (
          <p className="text-sm mt-2">Sohbet isteği beklemede</p>
        )}
        {chatData.status === ChatStatus.REJECTED && (
          <p className="text-sm mt-2 text-red-500">Sohbet isteği reddedildi</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[500px] border rounded-lg">
      <div className="flex-1 overflow-y-auto">
        <ChatMessages messages={chatData.messages || []} />
      </div>
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
}
