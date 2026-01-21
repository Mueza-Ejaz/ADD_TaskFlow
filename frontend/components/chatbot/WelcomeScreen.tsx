'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Sparkles, CheckCircle2, ListTodo } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WelcomeScreenProps {
  onSuggestionClick: (message: string) => void;
  isCompact?: boolean;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSuggestionClick, isCompact = false }) => {
  const suggestions = [
    { text: "Add task: Buy groceries", icon: <CheckCircle2 size={isCompact ? 14 : 16} /> },
    { text: "Show my tasks", icon: <ListTodo size={isCompact ? 14 : 16} /> },
    { text: "Delete task: Meeting", icon: <Sparkles size={isCompact ? 14 : 16} /> },
  ];

  return (
    <div className={cn(
      "min-h-full flex flex-col items-center justify-center text-center",
      isCompact ? "p-3 sm:p-4" : "p-2 sm:p-4"
    )}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "bg-white/5 border border-white/10 rounded-full shadow-[0_0_30px_rgba(0,255,209,0.15)] relative",
          isCompact ? "p-2 mb-2" : "p-3 mb-3"
        )}
      >
        <div className="absolute inset-0 bg-[#00FFD1]/20 blur-xl rounded-full"></div>
        <Bot size={isCompact ? 20 : 24} className="text-[#00FFD1] relative z-10" />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className={cn(
          "font-bold text-white mb-1",
          isCompact ? "text-lg" : "text-2xl sm:text-3xl"
        )}
      >
        Hi! I’m your AI Task Assistant.
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className={cn(
          "text-white/60 max-w-md",
          isCompact ? "text-[10px] mb-3" : "text-xs sm:text-sm mb-4"
        )}
      >
        I help you manage tasks smartly. You can try things like:
      </motion.p>

      <motion.div
        className={cn(
          "grid w-full",
          isCompact ? "gap-1.5 max-w-[280px]" : "gap-2 max-w-sm"
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        {suggestions.map((suggestion, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.01, backgroundColor: "rgba(0, 255, 209, 0.1)" }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onSuggestionClick(suggestion.text)}
            className={cn(
              "flex items-center bg-white/5 border border-white/10 rounded-xl text-left hover:border-[#00FFD1]/30 transition-all duration-200 group",
              isCompact ? "gap-2 p-2" : "gap-2.5 p-2.5"
            )}
          >
            <div className={cn(
              "bg-white/5 rounded-lg text-[#00FFD1] group-hover:bg-[#00FFD1] group-hover:text-black transition-colors",
              isCompact ? "p-1" : "p-1.5"
            )}>
              {suggestion.icon}
            </div>
            <span className={cn(
              "text-white/80 font-medium group-hover:text-white truncate",
              isCompact ? "text-[11px]" : "text-xs sm:text-sm"
            )}>{suggestion.text}</span>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
};