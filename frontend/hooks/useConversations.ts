import { useEffect, useCallback } from 'react';
import { chatAPIClient } from '../lib/api/chat';
import { useChatContext } from '../providers/ChatProvider';
import { useAuth } from './useAuth';

export const useConversations = (userId: string) => {
  const { state, dispatch } = useChatContext();
  const { token } = useAuth();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        // If we don't have a token, we might fail auth, so it's better to wait or handle it.
        // But for now, we'll pass what we have.
        dispatch({ type: 'SET_LOADING', payload: true });
        // Cast token to string | undefined because useAuth might return null, but our API expects string | undefined
        const authToken = token || undefined;
        const conversations = await chatAPIClient.fetchConversations(userId, authToken);
        dispatch({ type: 'SET_CONVERSATIONS', payload: conversations });
      } catch (error) {
        dispatch({
          type: 'SET_ERROR',
          payload: error instanceof Error ? error : new Error('Failed to fetch conversations'),
        });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    if (userId && token) {
      fetchConversations();
    }
  }, [userId, token, dispatch]);

  const setActiveConversation = (conversationId: string | null) => {
    dispatch({ type: 'SET_ACTIVE_CONVERSATION', payload: conversationId });
  };

  const createNewConversation = useCallback(() => {
    const newConversation = {
      id: `conv-${Date.now()}`,
      title: 'New Conversation',
      updatedAt: new Date(),
      messages: [],
    };

    dispatch({
      type: 'SET_CONVERSATIONS',
      payload: [newConversation, ...state.conversations]
    });

    setActiveConversation(newConversation.id);
  }, [dispatch, state.conversations]);

  const deleteConversation = useCallback(async (conversationId: string) => {
    if (!userId) {
      console.error("Cannot delete conversation: User ID is missing");
      return;
    }
    
    try {
      const authToken = token || undefined;
      await chatAPIClient.deleteConversation(userId, conversationId, authToken);
      
      const updatedConversations = state.conversations.filter(c => c.id !== conversationId);
      dispatch({ type: 'SET_CONVERSATIONS', payload: updatedConversations });
      
      if (state.activeConversationId === conversationId) {
        dispatch({ type: 'SET_ACTIVE_CONVERSATION', payload: null });
      }
    } catch (error) {
      console.error('Failed to delete conversation:', error);
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error : new Error('Failed to delete conversation'),
      });
    }
  }, [userId, token, dispatch, state.conversations, state.activeConversationId]);

  return {
    conversations: state.conversations,
    activeConversation: state.conversations.find(c => c.id === state.activeConversationId),
    setActiveConversation,
    createNewConversation,
    deleteConversation,
    isLoading: state.isLoading,
    error: state.error,
  };
};