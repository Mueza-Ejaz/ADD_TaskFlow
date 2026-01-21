'use client';

import React from 'react';
import { ChatInterface } from '@/components/chatbot/ChatInterface';
import { Card, CardContent } from '@/components/ui/Card';

export default function ChatbotPage() {
  return (
    <div className="flex flex-col h-full pb-2">
      <h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3">AI Task Assistant</h1>

      <div className="flex-1 min-h-0 bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
        <ChatInterface />
      </div>
    </div>
  );
}