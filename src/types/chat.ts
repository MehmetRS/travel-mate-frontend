export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  LOCATION = 'LOCATION',
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  messageType: MessageType;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface ChatResponse {
  exists: boolean;
  chatId?: string;
  messages?: Message[];
}

export interface CreateMessageRequest {
  content: string;
  messageType?: MessageType;
  metadata?: Record<string, any>;
}
