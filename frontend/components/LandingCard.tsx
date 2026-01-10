'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckSquare } from 'lucide-react';

const LandingCard = () => {
  const router = useRouter();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative z-10 w-[92%] max-w-[550px] rounded-[32px] border border-white/10 bg-white/[0.05] p-[40px] md:p-[60px] text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-[20px] hover:bg-white/[0.08] transition-all duration-500"
    >
      {/* Icon Wrapper with Glow */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
        className="mb-[30px] inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-red-500/10 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.2)]"
      >
        <CheckSquare className="text-red-400" size={56} strokeWidth={2} />
      </motion.div>

      {/* Title */}
      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-[2.8rem] md:text-[3.5rem] font-[800] leading-tight tracking-tight text-white mb-4"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        Todo App
      </motion.h1>

      {/* Description Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="mb-[45px]"
      >
        <p className="text-[1.1rem] md:text-[1.2rem] font-[500] leading-relaxed text-red-50/90 mb-2">
          Organize your tasks efficiently and boost your productivity.
        </p>
        <p className="text-[0.95rem] md:text-[1rem] font-[400] text-red-100/60">
          Simple, powerful, and beautifully designed task management.
        </p>
      </motion.div>

      {/* Buttons Container */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="flex flex-col sm:flex-row justify-center gap-[15px] sm:gap-[20px]"
      >
        <button
          onClick={() => router.push('/login')}
          className="flex-1 px-[32px] py-[14px] rounded-xl bg-red-600 text-[1.05rem] font-[600] text-white transition-all duration-300 hover:bg-red-500 hover:scale-[1.02] active:scale-[0.98] shadow-[0_10px_20px_rgba(220,38,38,0.3)]"
        >
          Login
        </button>
        <button
          onClick={() => router.push('/signup')}
          className="flex-1 px-[32px] py-[14px] rounded-xl border border-white/10 bg-white/5 text-[1.05rem] font-[600] text-white backdrop-blur-[5px] transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] active:scale-[0.98]"
        >
          Sign Up
        </button>
      </motion.div>
    </motion.div>
  );
};

export default LandingCard;