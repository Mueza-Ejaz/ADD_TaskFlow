'use client';

import React, { useRef, useEffect, useState } from 'react';
import { ChatMessage } from './ChatMessage';
import { MessageInput } from './MessageInput';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/hooks/useAuth';
import { useConversations } from '@/hooks/useConversations';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Menu, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ConversationHistory } from './ConversationHistory';
import { WelcomeScreen } from './WelcomeScreen';

interface ChatInterfaceProps {
  conversationId?: string;
  showSidebar?: boolean;
  isCompact?: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  conversationId,
  showSidebar = true,
  isCompact = false
}) => {
  const { user } = useAuth();
  const { createNewConversation } = useConversations(user?.id || '');
  const {
    messages,
    activeConversationId: currentActiveId,
    sendMessage,
    loadConversation,
    inputValue,
    setInputValue,
    isTyping,
    error,
    clearError
  } = useChat(user?.id || '');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSendMessage = (message: string) => {
    if (user?.id) {
      // Use the active conversation ID from state if available, 
      // otherwise fall back to the prop (which is likely undefined here)
      const targetConvId = currentActiveId || conversationId;
      sendMessage(message, targetConvId);
    }
  };

  const handleSelectConversation = (id: string) => {
    loadConversation(id);
  };

  const handleCreateNew = () => {
    createNewConversation();
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <p>Please log in to use the chatbot.</p>
      </div>
    );
  }

  return (
    <div className="flex h-full max-w-full mx-auto w-full bg-transparent overflow-hidden rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)]">
      {/* Conversation History Sidebar - Hidden on mobile when closed */}
      {showSidebar && (
        <div className="w-72 border-r border-white/10 flex flex-col h-full md:flex hidden bg-[#050505]">
          <ConversationHistory
            onSelectConversation={handleSelectConversation}
            onCreateNew={handleCreateNew}
            activeConversationId={currentActiveId || conversationId || null}
          />
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-gradient-to-b from-[#0a0a0a] to-black">
        {/* Chat Identity Header */}
        <div className="flex-none p-4 border-b border-white/10 flex items-center bg-[#050505]">
          {/* Mobile Sidebar Toggle */}
          {showSidebar && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 mr-3 rounded-xl hover:bg-white/10 text-white/70 hover:text-white transition-colors md:hidden"
            >
              <Menu size={20} />
            </button>
          )}          
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#00FFD1] flex items-center justify-center shadow-[0_0_15px_rgba(0,255,209,0.4)]">
              <Bot size={22} className="text-black" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base tracking-wide">AI Task Assistant</h3>
              <p className="text-xs text-white/60 font-medium">I help you manage tasks smartly</p>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col min-h-0 relative">
          <div className={`flex-1 overflow-y-auto scroll-smooth custom-scrollbar ${messages.length === 0 ? 'flex flex-col' : isCompact ? 'p-2 sm:p-3' : 'p-3 sm:p-5'}`}>
            {messages.length === 0 ? (
              <WelcomeScreen onSuggestionClick={handleSendMessage} isCompact={isCompact} />
            ) : (
              <div className={isCompact ? "space-y-3" : "space-y-6"}>
                <AnimatePresence mode='popLayout'>
                  {messages.map((msg, index) => (
                    <ChatMessage
                      key={`${msg.id || 'temp'}-${index}`}
                      role={msg.role}
                      content={msg.content}
                      status={msg.status}
                      toolCalls={msg.toolCalls}
                      timestamp={msg.createdAt ? new Date(msg.createdAt) : undefined}
                      isCompact={isCompact}
                    />
                  ))}
                </AnimatePresence>

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex justify-start mb-6"
                  >
                    <div className="bg-white/5 border border-white/10 text-white/80 rounded-2xl rounded-bl-sm px-5 py-3 backdrop-blur-md shadow-lg flex items-center gap-3">
                        <Loader2 className="h-4 w-4 animate-spin text-[#00FFD1]" />
                        <span className="text-sm font-medium tracking-wide">Thinking...</span>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <div className={cn(
            "flex-none border-t border-white/10 bg-black/20 backdrop-blur-md",
            isCompact ? "p-2 sm:p-3" : "p-3 sm:p-5"
          )}>
            {error && (
              <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-xl text-sm flex items-center justify-between backdrop-blur-sm text-red-200 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                <span className="flex items-center gap-2">
                   <span className="h-1.5 w-1.5 rounded-full bg-red-500 inline-block" />
                   Error: {error.message}
                </span>
                <button
                  onClick={clearError}
                  className="ml-2 text-white/50 hover:text-white text-xs font-semibold px-2 py-1 hover:bg-white/10 rounded-lg transition-colors"
                >
                  DISMISS
                </button>
              </div>
            )}
            <MessageInput
              value={inputValue}
              onChange={setInputValue}
              onSubmit={handleSendMessage}
              disabled={isTyping}
            />
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden" 
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>
      
      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-72 bg-[#050505] z-50 md:hidden border-r border-white/10 flex flex-col shadow-[10px_0_30px_rgba(0,0,0,0.5)]"
          >
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/20">
              <span className="font-bold text-white tracking-tight ml-2">History</span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-xl hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <ConversationHistory
              onSelectConversation={(id) => {
                handleSelectConversation(id);
                setSidebarOpen(false);
              }}
              onCreateNew={() => {
                handleCreateNew();
                setSidebarOpen(false);
              }}
              activeConversationId={conversationId || null}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};