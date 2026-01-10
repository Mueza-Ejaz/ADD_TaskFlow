'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, User, Settings, LogOut, HelpCircle } from 'lucide-react';
import { signOut } from 'next-auth/react';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Profile', href: '/dashboard/profile', icon: User },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  { label: 'Help', href: '/dashboard/about', icon: HelpCircle },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-white/10 bg-[#050505]/80 backdrop-blur-2xl transition-all duration-300 shadow-[4px_0_18px_rgba(0,0,0,0.6)]">
      <div className="flex h-full flex-col px-4 py-8">
        {/* Logo - Home Navigation Trigger */}
        <Link 
          href="/dashboard" 
          className="mb-10 flex items-center justify-center gap-3 group/logo cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#00FFD1]/50 rounded-xl py-2 transition-all duration-200 hover:scale-[1.02]"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-[#00FFD1] bg-[#00FFD1]/10 shadow-[0_0_10px_rgba(0,255,209,0.2)] group-hover/logo:shadow-[0_0_15px_rgba(0,255,209,0.4)] transition-all">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6 text-[#00FFD1]" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight group-hover/logo:text-[#00FFD1] transition-colors">TaskFlow</h1>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 space-y-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200",
                  isActive
                    ? "bg-[#00FFD1]/10 text-[#00FFD1] shadow-lg shadow-[#00FFD1]/5 border border-[#00FFD1]/10"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon className={cn("h-5 w-5 transition-colors", isActive ? "text-[#00FFD1]" : "text-white/40 group-hover:text-white")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout Section with Divider */}
        <div className="mt-auto pt-6 border-t border-white/10">
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-bold text-white transition-all duration-200 bg-white/5 hover:bg-red-500/20 hover:text-red-400 group border border-white/5 hover:border-red-500/30 shadow-sm"
          >
            <LogOut className="h-5 w-5 text-white/60 group-hover:text-red-400 transition-colors" />
            Log Out
          </button>
        </div>
      </div>
    </aside>
  );
};