'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SendIcon } from 'lucide-react';

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  disabled?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  value,
  onChange,
  onSubmit,
  disabled = false
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !disabled) {
      onSubmit(value.trim());
      onChange('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 w-full items-center" role="form" aria-label="Chat message input form">
      <div className="relative flex-1">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Ask me anything..."
          disabled={disabled}
          className="w-full bg-black/40 border border-white/10 text-white placeholder:text-white/20 rounded-xl h-12 pl-5 pr-4 focus:border-[#00FFD1]/50 focus:ring-1 focus:ring-[#00FFD1]/50 backdrop-blur-sm transition-all duration-300 hover:border-white/20"
          aria-label="Type your message"
          role="textbox"
          aria-multiline="true"
          autoComplete="off"
        />
      </div>
      <Button
        type="submit"
        disabled={!value.trim() || disabled}
        className="h-12 w-12 rounded-xl bg-[#00FFD1] text-black hover:bg-[#00CCAA] hover:scale-105 hover:shadow-[0_0_20px_rgba(0,255,209,0.4)] transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none flex items-center justify-center"
        aria-label="Send message"
      >
        <SendIcon size={22} className="ml-0.5" aria-hidden="true" />
      </Button>
    </form>
  );
};