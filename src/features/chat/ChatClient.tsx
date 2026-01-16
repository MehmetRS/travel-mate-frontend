'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useChat } from './hooks/useChat';
import { MessageType } from '@/types/chat';
import {
  PaperAirplaneIcon,
  PhotoIcon,
  MapPinIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  XMarkIcon,
  CheckCircleIcon
} from '@heroicons/react/24/solid';
import Link from 'next/link';

export default function ChatClient({ chatId }: { chatId: string }) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const {
    messages,
    isLoading,
    error,
    isSending,
    sendError,
    refetch,
    sendMessage,
    clearErrors
  } = useChat(chatId);

  const [messageContent, setMessageContent] = useState('');
  const [messageType, setMessageType] = useState<MessageType>(MessageType.TEXT);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Redirect if not authenticated
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Show loading state
  if (authLoading || isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-8"></div>

          <div className="bg-gray-100 p-6 rounded-lg mb-6">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg">
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={refetch}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center"
          >
            <ArrowPathIcon className="w-5 h-5 mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Don't render content until authenticated
  if (!isAuthenticated || !user) {
    return null;
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!messageContent.trim()) {
      return;
    }

    try {
      await sendMessage(messageContent, messageType);
      setMessageContent('');
      setMessageType(MessageType.TEXT);
    } catch (error) {
      // Error is already handled by the hook
    }
  };

  const handleMessageTypeChange = (type: MessageType) => {
    setMessageType(type);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Chat</h1>
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            Dashboard
          </Link>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Success message */}
      {sendError && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-red-700">{sendError}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={clearErrors}
                className="text-red-500 hover:text-red-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Container */}
      <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
        {/* Messages Area */}
        <div className="p-6 h-[60vh] overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="mb-4">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
              <p className="text-gray-500">Start the conversation!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map(message => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  currentUserId={user.id}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Message Input Area */}
        <div className="border-t p-4 bg-gray-50">
          <form onSubmit={handleSendMessage} className="space-y-3">
            {/* Message Type Buttons */}
            <div className="flex space-x-2 mb-3">
              <button
                type="button"
                onClick={() => handleMessageTypeChange(MessageType.TEXT)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  messageType === MessageType.TEXT
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Text
              </button>
              <button
                type="button"
                onClick={() => handleMessageTypeChange(MessageType.IMAGE)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  messageType === MessageType.IMAGE
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <PhotoIcon className="w-4 h-4 inline-block mr-1" />
                Image
              </button>
              <button
                type="button"
                onClick={() => handleMessageTypeChange(MessageType.LOCATION)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  messageType === MessageType.LOCATION
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <MapPinIcon className="w-4 h-4 inline-block mr-1" />
                Location
              </button>
            </div>

            {/* Message Input */}
            <div className="flex space-x-2">
              <input
                type="text"
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                placeholder={
                  messageType === MessageType.TEXT ? 'Type a message...' :
                  messageType === MessageType.IMAGE ? 'Paste image URL...' :
                  'Enter location...'
                }
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isSending}
              />
              <button
                type="submit"
                disabled={isSending || !messageContent.trim()}
                className={`p-2 rounded-lg transition-colors ${
                  isSending || !messageContent.trim()
                    ? 'bg-blue-300 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                <PaperAirplaneIcon className="w-6 h-6 text-white" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Message Bubble Component
function MessageBubble({ message, currentUserId }: { message: any, currentUserId: string }) {
  const isCurrentUser = message.senderId === currentUserId;

  const formatMessageContent = () => {
    switch (message.messageType) {
      case MessageType.IMAGE:
        return (
          <div className="max-w-xs">
            <img
              src={message.content}
              alt="Shared image"
              className="rounded-lg max-w-full h-auto"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
              }}
            />
            {message.metadata?.caption && (
              <p className="text-xs text-gray-500 mt-1">{message.metadata.caption}</p>
            )}
          </div>
        );
      case MessageType.LOCATION:
        return (
          <div className="bg-white p-3 rounded-lg border">
            <p className="font-medium">{message.metadata?.name || 'Location'}</p>
            <p className="text-sm text-gray-600">{message.content}</p>
            {message.metadata?.coordinates && (
              <p className="text-xs text-gray-500">
                {message.metadata.coordinates.lat}, {message.metadata.coordinates.lng}
              </p>
            )}
          </div>
        );
      case MessageType.TEXT:
      default:
        return <p>{message.content}</p>;
    }
  };

  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs lg:max-w-md rounded-lg p-3 ${
          isCurrentUser
            ? 'bg-blue-500 text-white rounded-br-none'
            : 'bg-gray-200 text-gray-900 rounded-bl-none'
        }`}
      >
        <div className="text-xs text-opacity-75 mb-1">
          {isCurrentUser ? 'You' : 'Traveler'} • {new Date(message.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
        </div>
        {formatMessageContent()}
      </div>
    </div>
  );
}
