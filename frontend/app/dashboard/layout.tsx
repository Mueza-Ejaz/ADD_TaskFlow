'use client';

import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen w-full bg-black text-white">
      <AnimatedBackground />
      <Sidebar />
      <div className="pl-64">
        <div className="container mx-auto min-h-screen p-8">
           <Header />
           <main>
            {children}
           </main>
        </div>
      </div>
    </div>
  );
}