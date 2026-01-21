import { useState, useCallback } from 'react';
import { chatKitService } from '../lib/api/chatkit';
import { chatAPIClient } from '../lib/api/chat';
import { useChatContext } from '../providers/ChatProvider';
import { useAuth } from './useAuth';

export const useChat = (userId: string) => {
  const { state, dispatch } = useChatContext();
  const { token } = useAuth();
  const [inputValue, setInputValue] = useState('');

  // Function to trigger task list refresh when relevant tool calls are made
  const triggerTaskListRefresh = useCallback(() => {
    // Dispatch a custom event to notify other parts of the app to refresh
    window.dispatchEvent(new CustomEvent('TASK_LIST_REFRESH'));
  }, []);

  const loadConversation = useCallback(async (conversationId: string) => {
    if (!userId || !token) return;
    
    // If it's a temporary local ID, don't try to load from backend
    if (conversationId.startsWith('conv-')) {
      dispatch({ type: 'SET_ACTIVE_CONVERSATION', payload: conversationId });
      // Clear messages for new conversation
      dispatch({ type: 'SET_CONVERSATIONS', payload: state.conversations.map(c => 
        c.id === conversationId ? { ...c, messages: [] } : c
      )});
      return;
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      // Cast token to string | undefined
      const authToken = token || undefined;
      
      const conversation = await chatAPIClient.getConversation(userId, conversationId, authToken);
      
      // Update the conversation in the state with the full details (including messages)
      const updatedConversations = state.conversations.map(c => 
        c.id === conversationId ? { ...c, ...conversation } : c
      );
      
      // If conversation wasn't in list (e.g. deep link), add it? 
      // For now assume it is, or just update state.
      
      dispatch({ type: 'SET_CONVERSATIONS', payload: updatedConversations });
      dispatch({ type: 'SET_ACTIVE_CONVERSATION', payload: conversationId });
      
    } catch (error) {
      console.error("Failed to load conversation", error);
      // Check if this is an authentication error
      const errorMessage = error instanceof Error ? error.message : 'Failed to load conversation';

      if (errorMessage.includes('Authentication token has expired') || errorMessage.includes('Please log in again')) {
        // Dispatch a custom event to trigger logout
        window.dispatchEvent(new Event('LOGOUT_USER'));
        dispatch({
          type: 'SET_ERROR',
          payload: new Error('Session expired. Redirecting to login...'),
        });
      } else {
        dispatch({
          type: 'SET_ERROR',
          payload: error instanceof Error ? error : new Error('Failed to load conversation'),
        });
      }
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [userId, token, dispatch, state.conversations]);

  const sendMessage = useCallback(async (message: string, conversationId?: string) => {
    if (!message.trim()) return;

    // Optimistically add user message
    const userMessageId = `temp-${Date.now()}`;
    dispatch({
      type: 'ADD_MESSAGE',
      payload: {
        id: userMessageId,
        role: 'user',
        content: message,
        createdAt: new Date(),
        status: 'sending',
      },
    });

    try {
      dispatch({ type: 'SET_TYPING', payload: true });

      // Initialize ChatKit service with user ID
      await chatKitService.initialize(userId);

      // Cast token to string | undefined
      const authToken = token || undefined;
      const response = await chatKitService.sendMessage(userId, message, conversationId, authToken);

      // Update user message status to 'sent'
      dispatch({
        type: 'UPDATE_MESSAGE',
        payload: {
          id: userMessageId,
          updates: { status: 'sent' },
        },
      });

      // Add assistant message
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          id: `msg-${Date.now()}`,
          role: response.message.role,
          content: response.message.content,
          createdAt: new Date(),
          status: 'sent',
          toolCalls: response.tool_calls_executed?.map((tc: any, index: number) => ({
            id: `tc-${Date.now()}-${index}`,
            name: tc.name,
            args: tc.arguments || {},
            status: 'success', // From the backend, these are already executed
            result: tc.result || tc.arguments,
          })),
        },
      });

      // If this was a new conversation, we need to update its ID from the response
      if (conversationId?.startsWith('conv-') && response.conversation_id) {
        const newRealId = String(response.conversation_id);
        
        // Update the conversation in the list
        const updatedConversations = state.conversations.map(c => 
          c.id === conversationId ? { ...c, id: newRealId } : c
        );
        
        dispatch({ type: 'SET_CONVERSATIONS', payload: updatedConversations });
        dispatch({ type: 'SET_ACTIVE_CONVERSATION', payload: newRealId });
      }

      // Check if any of the tool calls were task-related and trigger refresh
      if (response.tool_calls_executed && response.tool_calls_executed.some((tc: any) =>
        tc.name.includes('task') || tc.name.includes('add_') || tc.name.includes('delete_') || tc.name.includes('update_'))) {
        triggerTaskListRefresh();
      }
    } catch (error) {
      // Check if this is an authentication error
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message';

      if (errorMessage.includes('Authentication token has expired') || errorMessage.includes('Please log in again')) {
        // Dispatch a custom event to trigger logout
        window.dispatchEvent(new Event('LOGOUT_USER'));
        dispatch({
          type: 'UPDATE_MESSAGE',
          payload: {
            id: userMessageId,
            updates: { status: 'error' },
          },
        });
        dispatch({
          type: 'SET_ERROR',
          payload: new Error('Session expired. Redirecting to login...'),
        });
      } else {
        dispatch({
          type: 'UPDATE_MESSAGE',
          payload: {
            id: userMessageId,
            updates: { status: 'error' },
          },
        });
        dispatch({
          type: 'SET_ERROR',
          payload: error instanceof Error ? error : new Error('Failed to send message'),
        });
      }
    } finally {
      dispatch({ type: 'SET_TYPING', payload: false });
    }
  }, [userId, dispatch, triggerTaskListRefresh, token]);

  return {
    messages: state.messages,
    activeConversationId: state.activeConversationId,
    sendMessage,
    loadConversation,
    inputValue,
    setInputValue,
    isTyping: state.isTyping,
    error: state.error,
    clearError: () => dispatch({ type: 'CLEAR_ERROR' }),
  };
};