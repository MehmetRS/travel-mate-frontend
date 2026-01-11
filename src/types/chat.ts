export interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
}

export interface ChatResponse {
  exists: boolean;
  chatId?: string;
  messages?: Message[];
}

export interface CreateMessageRequest {
  content: string;
}
