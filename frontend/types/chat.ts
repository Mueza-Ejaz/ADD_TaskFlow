export interface Message {
  id: string; // UUID
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: Date;
  status: 'sending' | 'sent' | 'error';
  toolCalls?: ToolCall[];
}

export interface ToolCall {
  id: string;
  name: string;
  args: Record<string, any>;
  status: 'call' | 'success' | 'error';
  result?: string | Record<string, any>;
}

export interface Conversation {
  id: string; // UUID
  title?: string;
  updatedAt: Date;
  messages: Message[];
}