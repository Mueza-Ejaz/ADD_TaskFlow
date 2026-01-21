'use client';

import { ChatProvider } from '@/providers/ChatProvider';
import { ReactNode } from 'react';

interface ChatWrapperProps {
  children: ReactNode;
}

export const ChatWrapper: React.FC<ChatWrapperProps> = ({ children }) => {
  return (
    <ChatProvider>
      {children}
    </ChatProvider>
  );
};