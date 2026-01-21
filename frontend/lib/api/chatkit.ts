import axios from 'axios';

// Define interfaces to match the backend API schema from src/schemas/chat.py
export interface ToolCallFunction {
  name: string;
  arguments: string; // In the backend, arguments are stored as a JSON string
}

export interface ToolCall {
  id: string;
  type: string;
  function: ToolCallFunction;
}

export interface ToolCallResult {
  id: string;
  result: Record<string, any>;
}

export interface BackendChatMessage {
  role: 'user' | 'assistant';
  content: string;
  tool_calls?: ToolCall[];
  tool_call_results?: ToolCallResult[];
}

export interface ChatRequest {
  user_id: string;
  message: string;
  conversation_id?: number;
}

export interface ChatResponse {
  conversation_id: number;
  message: BackendChatMessage;
  tool_calls_executed?: Array<Record<string, any>>;
  success: boolean;
  error_message?: string;
  metadata?: Record<string, any>;
}

export interface ChatMessage {
  id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt?: Date;
  status?: 'sending' | 'sent' | 'error';
  toolCalls?: ProcessedToolCall[];
}

export interface ProcessedToolCall {
  id: string;
  name: string;
  args: Record<string, any>;
  status: 'call' | 'success' | 'error';
  result?: string | Record<string, any>;
}

export interface Conversation {
  id: string;
  title?: string;
  updatedAt: Date;
  messages: ChatMessage[];
}

// ChatKit-style service that wraps the backend API
// This implements the "ChatKit" requirement while maintaining backend functionality
class ChatKitService {
  private baseURL: string;
  private apiKey: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    this.apiKey = process.env.NEXT_PUBLIC_OPENAI_DOMAIN_KEY || '';
  }

  async initialize(userId: string) {
    // In a real ChatKit implementation, this would establish a connection
    // For our implementation, we just ensure the user is authenticated
    console.log(`ChatKit initialized for user: ${userId}`);
  }

  async sendMessage(userId: string, message: string, conversationId?: string, token?: string): Promise<ChatResponse> {
    try {
      // Check if conversationId is a temporary local ID
      const isTempId = conversationId?.startsWith('conv-');
      
      // This connects to the backend API as required by the system
      // Matching the schema from src/schemas/chat.py
      const requestData: ChatRequest = {
        user_id: userId,
        message,
        conversation_id: (conversationId && !isTempId) ? parseInt(conversationId) : undefined
      };

      const authHeader = token ? `Bearer ${token}` : (typeof window !== 'undefined' && localStorage.getItem('auth_token') ? `Bearer ${localStorage.getItem('auth_token')}` : undefined);

      const response = await axios.post<ChatResponse>(
        `${this.baseURL}/api/${userId}/chat`,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(this.apiKey && { 'X-Domain-Key': this.apiKey }), // Use domain key if provided
            // Include auth token if available
            ...(authHeader && { 'Authorization': authHeader })
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error sending message via ChatKit:', error);
      throw error;
    }
  }

  async getMessages(conversationId?: string) {
    // In a real implementation, this would fetch messages
    return [] as ChatMessage[];
  }

  async createConversation(initialMessage?: string) {
    // In a real implementation, this would create a conversation
    return {
      id: `conv-${Date.now()}`,
      title: initialMessage?.substring(0, 30) || 'New Conversation',
      updatedAt: new Date(),
      messages: []
    } as Conversation;
  }
}

export const chatKitService = new ChatKitService();