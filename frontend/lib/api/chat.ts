import axios from 'axios';

// Support both NEXT_PUBLIC_API_BASE_URL and NEXT_PUBLIC_API_URL for backward compatibility
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface SendMessageRequest {
  message: string;
  conversation_id?: string;
  user_id: string;
}

interface SendMessageResponse {
  conversation_id: number | string;
  message: {
    role: string;
    content: string;
  };
  tool_calls_executed?: Array<{
    name: string;
    arguments: Record<string, any>;
    result?: any;
  }>;
  success: boolean;
  error_message?: string;
  metadata?: Record<string, any>;
}

class ChatAPIClient {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async sendMessage(userId: string, request: SendMessageRequest, token?: string): Promise<SendMessageResponse> {
    try {
      // Normalize the token - handle both direct token and potential session objects
      let normalizedToken = token;

      // If token is not provided or is null/undefined, try localStorage
      if (!normalizedToken && typeof window !== 'undefined') {
        normalizedToken = localStorage.getItem('auth_token');
      }

      if (!normalizedToken) {
        throw new Error('Authentication token is required to send messages. User may not be authenticated.');
      }

      const response = await axios.post<SendMessageResponse>(
        `${this.baseURL}/api/${userId}/chat`,
        {
          ...request,
          user_id: userId  // Ensure user_id is included in the request body
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${normalizedToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      // Handle 401 errors by clearing the invalid token
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        // Clear the invalid token from localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
        }
        throw new Error('Authentication token has expired or is invalid. Please log in again.');
      }
      console.error('Error sending message:', error);
      throw error;
    }
  }

  async fetchConversations(userId: string, token?: string): Promise<any> {
    try {
      // Normalize the token - handle both direct token and potential session objects
      let normalizedToken = token;

      // If token is not provided or is null/undefined, try localStorage
      if (!normalizedToken && typeof window !== 'undefined') {
        normalizedToken = localStorage.getItem('auth_token');
      }

      if (!normalizedToken) {
        throw new Error('Authentication token is required to fetch conversations. User may not be authenticated.');
      }

      const response = await axios.get(`${this.baseURL}/api/v1/conversations`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${normalizedToken}`
        }
      });

      // Map backend response (snake_case) to frontend interface (camelCase)
      if (Array.isArray(response.data)) {
        return response.data.map((conv: any) => ({
          id: String(conv.id),
          title: conv.title,
          updatedAt: conv.updated_at || conv.created_at || new Date().toISOString(),
          messages: [] // List endpoint typically doesn't return full message history
        }));
      }

      return [];
    } catch (error) {
      // Handle 401 errors by clearing the invalid token
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        // Clear the invalid token from localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
        }
        throw new Error('Authentication token has expired or is invalid. Please log in again.');
      }
      console.error('Error fetching conversations:', error);
      throw error;
    }
  }

  async getConversation(userId: string, conversationId: string, token?: string): Promise<any> {
    try {
      // If it's a temporary local ID, we shouldn't be calling this, but safety first
      if (conversationId.startsWith('conv-') || isNaN(Number(conversationId))) {
        return {
          id: conversationId,
          title: 'New Conversation',
          updatedAt: new Date().toISOString(),
          messages: []
        };
      }

      // Normalize the token - handle both direct token and potential session objects
      let normalizedToken = token;

      // If token is not provided or is null/undefined, try localStorage
      if (!normalizedToken && typeof window !== 'undefined') {
        normalizedToken = localStorage.getItem('auth_token');
      }

      if (!normalizedToken) {
        throw new Error('Authentication token is required to get conversation. User may not be authenticated.');
      }

      const response = await axios.get(`${this.baseURL}/api/v1/conversations/${conversationId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${normalizedToken}`
        }
      });

      const data = response.data;
      return {
        id: String(data.id),
        title: data.title,
        updatedAt: data.updated_at || data.created_at,
        messages: (data.messages || []).map((msg: any) => ({
          id: String(msg.id),
          role: msg.role,
          content: msg.content,
          createdAt: msg.created_at,
          toolCalls: msg.tool_calls ? JSON.parse(msg.tool_calls) : undefined,
          status: 'sent'
        }))
      };
    } catch (error) {
      // Handle 401 errors by clearing the invalid token
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        // Clear the invalid token from localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
        }
        throw new Error('Authentication token has expired or is invalid. Please log in again.');
      }
      console.error('Error fetching conversation details:', error);
      throw error;
    }
  }

  async deleteConversation(userId: string, conversationId: string, token?: string): Promise<void> {
    try {
      // If it's a temporary local ID, don't try to call the backend
      if (conversationId.startsWith('conv-') || isNaN(Number(conversationId))) {
        return;
      }

      // Normalize the token - handle both direct token and potential session objects
      let normalizedToken = token;

      // If token is not provided or is null/undefined, try localStorage
      if (!normalizedToken && typeof window !== 'undefined') {
        normalizedToken = localStorage.getItem('auth_token');
      }

      if (!normalizedToken) {
        throw new Error('Authentication token is required to delete conversation. User may not be authenticated.');
      }

      await axios.delete(`${this.baseURL}/api/v1/conversations/${conversationId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${normalizedToken}`
        }
      });
    } catch (error) {
      // Handle 401 errors by clearing the invalid token
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        // Clear the invalid token from localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
        }
        throw new Error('Authentication token has expired or is invalid. Please log in again.');
      }
      console.error('Error deleting conversation:', error);
      throw error;
    }
  }
}

export const chatAPIClient = new ChatAPIClient();