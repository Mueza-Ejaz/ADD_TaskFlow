'use client';

import { useSession } from 'next-auth/react';
import { Bell, Search } from 'lucide-react';
import { motion } from 'framer-motion';

export const Header = () => {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-30 mb-8 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur-md">
      {/* Search Bar (Placeholder) */}
      <div className="relative hidden w-96 md:block">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search tasks..."
          className="w-full rounded-xl border border-white/10 bg-black/20 py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4 ml-auto">
        <button className="relative rounded-lg p-2 text-gray-400 hover:bg-white/5 hover:text-white">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-black" />
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-white">{session?.user?.name || 'User'}</p>
            <p className="text-xs text-gray-500">{session?.user?.email}</p>
          </div>
          <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-white/10 bg-emerald-500/10">
             {/* Placeholder Avatar */}
             <div className="flex h-full w-full items-center justify-center font-bold text-emerald-500">
                {session?.user?.name?.[0]?.toUpperCase() || 'U'}
             </div>
          </div>
        </div>
      </div>
    </header>
  );
};
