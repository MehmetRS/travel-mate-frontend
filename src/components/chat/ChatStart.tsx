'use client';

import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

interface ChatStartProps {
  onStartChat: () => Promise<void>;
  disabled?: boolean;
}

export default function ChatStart({ onStartChat, disabled = false }: ChatStartProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Sürücü ile iletişime geçin
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        Yolculuk detaylarını konuşmak için sohbet başlatın
      </p>
      <button
        onClick={onStartChat}
        disabled={disabled}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
      >
        Sohbet Başlat
      </button>
    </div>
  );
}
