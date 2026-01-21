'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useConversations } from '@/hooks/useConversations';
import { useAuth } from '@/hooks/useAuth';
import { Plus, MessageSquare, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';

interface ConversationHistoryProps {
  onSelectConversation: (id: string) => void;
  onCreateNew: () => void;
  activeConversationId: string | null;
}

export const ConversationHistory: React.FC<ConversationHistoryProps> = ({
  onSelectConversation,
  onCreateNew,
  activeConversationId
}) => {
  const { user } = useAuth();
  const { conversations, isLoading, error, deleteConversation } = useConversations(user?.id || '');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (deleteId) {
      await deleteConversation(deleteId);
      setDeleteId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-10 bg-white/5 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="text-red-400 text-sm p-3 bg-red-900/20 border border-red-500/30 rounded-xl backdrop-blur-sm">
          Error: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-black/20 backdrop-blur-md" role="region" aria-label="Conversation history">
      <div className="p-4 border-b border-white/10">
        <Button
          onClick={onCreateNew}
          className="w-full bg-[#00FFD1]/10 hover:bg-[#00FFD1]/20 text-[#00FFD1] border border-[#00FFD1]/20 hover:border-[#00FFD1]/40 transition-all duration-300 rounded-xl h-10 font-semibold hover:shadow-[0_0_15px_rgba(0,255,209,0.1)]"
          aria-label="Start a new conversation"
        >
          <Plus size={18} aria-hidden="true" className="mr-2" />
          New Chat
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar" role="list" aria-label="List of conversations">
        <div className="p-3 space-y-1">
          <AnimatePresence>
            {conversations.length === 0 ? (
              <div className="text-center text-white/30 text-sm p-8" role="status">
                No conversations yet.<br/>Start a new chat!
              </div>
            ) : (
              conversations.map((conv) => {
                const isActive = activeConversationId === conv.id;
                return (
                  <div
                    key={conv.id}
                    className={`group relative p-3 rounded-xl mb-2 cursor-pointer transition-all duration-200 border z-10 ${
                      isActive
                        ? 'bg-[#00FFD1]/20 border-[#00FFD1]/40 shadow-[0_0_10px_rgba(0,255,209,0.1)]'
                        : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'
                    }`}
                    onClick={() => onSelectConversation(conv.id)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg transition-colors ${isActive ? 'bg-[#00FFD1] text-black' : 'bg-black/40 text-white/50 group-hover:text-white'}`}>
                        <MessageSquare size={16} aria-hidden="true" />
                      </div>
                      <div className="truncate flex-1 min-w-0">
                        <div className={`font-semibold text-sm truncate ${isActive ? 'text-[#00FFD1]' : 'text-white/90'}`}>
                          {conv.title || 'New Conversation'}
                        </div>
                        <div className="text-[11px] text-white/40 mt-0.5 font-medium">
                          {new Date(conv.updatedAt).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <button
                        onClick={(e) => handleDeleteClick(e, conv.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-white/10 transition-all absolute right-2 top-1/2 -translate-y-1/2"
                        title="Delete conversation"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>

      <ConfirmationModal
        isOpen={!!deleteId}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteId(null)}
        title="Delete Conversation"
        message="Are you sure you want to delete this conversation? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};