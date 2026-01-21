'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ToolCallStatus } from './ToolCallStatus';

interface ChatMessageProps {
  role: 'user' | 'assistant' | 'system';
  content: string;
  status?: 'sending' | 'sent' | 'error';
  toolCalls?: Array<{
    id: string;
    name: string;
    args: Record<string, any>;
    status: 'call' | 'success' | 'error';
    result?: string | Record<string, any>;
  }>;
  timestamp?: Date;
  isCompact?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  role,
  content,
  status = 'sent',
  toolCalls,
  timestamp,
  isCompact = false
}) => {
  const isUser = role === 'user';
  const isError = status === 'error';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        'flex w-full',
        isCompact ? 'mb-3' : 'mb-6',
        isUser ? 'justify-end' : 'justify-start'
      )}
      role="listitem"
      aria-label={`${role} message: ${content.substring(0, 50)}${content.length > 50 ? '...' : ''}`}
    >
      <div
        className={cn(
          'relative shadow-lg transition-all duration-300',
          isCompact ? 'max-w-[90%] rounded-xl px-4 py-2.5' : 'max-w-[85%] rounded-2xl px-6 py-4',
          isUser
            ? 'bg-gradient-to-br from-[#00FFD1] to-[#00CCAA] !text-black rounded-br-sm shadow-[0_0_15px_rgba(0,255,209,0.3)]'
            : 'bg-white/10 border border-white/10 text-white rounded-bl-sm backdrop-blur-md hover:border-[#00FFD1]/30 hover:shadow-[0_0_15px_rgba(0,255,209,0.05)]',
          isError && 'bg-red-900/30 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
        )}
        aria-live={role === 'assistant' ? 'polite' : 'off'}
      >
        <div className={cn(
          "whitespace-pre-wrap break-words leading-relaxed", 
          isCompact ? "text-[13px]" : "text-[15px]",
          isUser ? "font-semibold !text-black" : "font-normal text-white/90"
        )}>
          {content}
        </div>

        {toolCalls && toolCalls.length > 0 && (
          <div className={cn("space-y-2 pt-2 border-t border-white/10", isCompact ? "mt-2" : "mt-3")} aria-label="Tool calls performed">
            {toolCalls.map((toolCall, index) => (
              <ToolCallStatus
                key={`${toolCall.id}-${index}`}
                name={toolCall.name}
                status={toolCall.status}
                result={toolCall.result}
              />
            ))}
          </div>
        )}

        {timestamp && (
          <div className={cn("text-[10px] mt-1.5 font-medium tracking-wide", isUser ? "text-black/60" : "text-white/40")} aria-label={`Sent at ${timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}>
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}
      </div>
    </motion.div>
  );
};