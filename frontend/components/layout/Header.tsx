'use client';

import { useSession } from 'next-auth/react';
import { Bell, Search, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

export const Header = () => {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-30 mb-8 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur-md shadow-lg">
      {/* Search Bar */}
      <div className="relative hidden w-96 md:block group">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40 group-focus-within:text-[#00FFD1] transition-colors" />
        <input
          type="text"
          placeholder="Search tasks..."
          className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/30 focus:border-[#00FFD1]/50 focus:outline-none focus:ring-2 focus:ring-[#00FFD1]/10 transition-all"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4 ml-auto">
        <button className="relative rounded-lg p-2.5 text-white/50 hover:bg-white/5 hover:text-[#00FFD1] transition-all">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-[#00FFD1] ring-2 ring-black" />
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-white/10 group py-1 px-2 rounded-xl transition-all">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-white group-hover:text-[#00FFD1] transition-colors">
              {session?.user?.name || 'User'}
            </p>
            <p className="text-[11px] font-medium text-white/40 uppercase tracking-wider">
              {session?.user?.email}
            </p>
          </div>
          <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-white/20 bg-[#00FFD1]/10 shadow-[0_0_10px_rgba(0,255,209,0.1)] group-hover:border-[#00FFD1]/40 transition-all">
             {/* Placeholder Avatar */}
             <div className="flex h-full w-full items-center justify-center font-bold text-[#00FFD1]">
                {session?.user?.name?.[0]?.toUpperCase() || 'U'}
             </div>
          </div>
        </div>

        {/* Header Logout Button */}
        <button 
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all text-sm font-bold ml-2 shadow-sm"
          title="Sign Out"
        >
          <LogOut size={16} />
          <span className="hidden lg:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};