'use client';

import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import ParticleBackground from '@/components/ParticleBackground';
import { ChatProvider } from '@/providers/ChatProvider';
import AuthProvider from '@/providers/AuthProvider';
import { SessionUpdater } from '@/components/auth/SessionUpdater';
import { FloatingChatbot } from '@/components/chatbot/FloatingChatbot';
import { useState } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <AuthProvider>
      <SessionUpdater />
      <ChatProvider>
        <div className="relative h-screen w-full bg-black text-white overflow-hidden">
          <ParticleBackground />
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
          <div className="md:pl-64 h-full transition-all duration-300">
            <div className="flex flex-col h-full p-4 md:p-8">
               <Header onMenuClick={() => setIsSidebarOpen(true)} />
               <main className="flex-1 min-h-0">
                {children}
               </main>
            </div>
          </div>
          <FloatingChatbot />
        </div>
      </ChatProvider>
    </AuthProvider>
  );
}