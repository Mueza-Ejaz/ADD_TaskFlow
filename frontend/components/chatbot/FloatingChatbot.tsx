'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Bot } from 'lucide-react';
import { ChatInterface } from './ChatInterface';
import { cn } from '@/lib/utils';

export const FloatingChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="mb-4 w-[calc(100vw-32px)] sm:w-[400px] h-[500px] sm:h-[600px] max-h-[75vh] sm:max-h-[80vh] bg-gray-900 border border-white/10 rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col backdrop-blur-xl"
          >
            {/* Header for the floating window */}
            <div className="flex-none p-3 sm:p-4 bg-[#050505] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-gradient-to-tr from-[#00FFD1] to-[#00CCAA] flex items-center justify-center shadow-[0_0_10px_rgba(0,255,209,0.3)]">
                  <Bot size={16} className="text-black" />
                </div>
                <div>
                  <span className="font-bold text-white text-xs sm:text-sm block">AI Task Assistant</span>
                  <div className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[10px] text-white/40 font-medium">Online</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 sm:p-2 rounded-xl hover:bg-white/10 text-white/50 hover:text-white transition-all active:scale-90"
              >
                <X size={18} />
              </button>
            </div>

            {/* The Chat Interface itself */}
            <div className="flex-1 min-h-0 bg-black/40">
              <ChatInterface showSidebar={false} isCompact={true} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button (FAB) */}
      <motion.button
        whileHover={{ scale: 1.05, translateY: -2 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-14 w-14 sm:h-16 sm:w-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 border relative group cursor-pointer",
          isOpen 
            ? "bg-gray-900 text-white border-white/10" 
            : "bg-gradient-to-tr from-[#00FFD1] to-[#00CCAA] text-black border-[#00FFD1]/20 shadow-[0_8px_32px_rgba(0,255,209,0.4)]"
        )}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={28} />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <MessageCircle size={30} fill="currentColor" className="opacity-20 absolute -inset-1 blur-sm" />
              <MessageCircle size={30} />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Glow effect on hover */}
        {!isOpen && (
          <div className="absolute inset-0 rounded-full bg-[#00FFD1] opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />
        )}

        {/* Status Badge */}
        {!isOpen && (
          <span className="absolute top-1 right-1 h-3.5 w-3.5 bg-emerald-500 rounded-full border-2 border-black shadow-lg" />
        )}
      </motion.button>
    </div>
  );
};
