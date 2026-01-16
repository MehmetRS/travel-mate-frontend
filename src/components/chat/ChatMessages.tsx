'use client';

import { Message } from '@/types/chat';
import { useAuth } from '@/features/auth/hooks/useAuth';

interface ChatMessagesProps {
  messages: Message[];
}

export default function ChatMessages({ messages }: ChatMessagesProps) {
  // Get current user ID from auth context
  const { user } = useAuth();
  const currentUserId = user?.id || null;

  return (
    <div className="flex flex-col space-y-4 p-4">
      {messages.map(message => (
        <div
          key={message.id}
          className={`flex ${message.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[70%] rounded-lg p-3 ${
              message.senderId === currentUserId
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-900'
            }`}
          >
            <p className="text-sm">{message.content}</p>
            <p className="text-xs mt-1 opacity-70">
              {new Date(message.createdAt).toLocaleTimeString('tr-TR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
