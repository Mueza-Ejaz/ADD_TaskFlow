'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ParticleSystem } from './ui/ParticleSystem';

const BackgroundGlow = () => {
  return (
    <div className="fixed inset-0 -z-10 h-full w-full overflow-hidden bg-[#050000]">
      {/* Dark Red Gradient Layers */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#050000] via-[#200000] to-[#050000]" />
      
      {/* Red moving blobs - INCREASED OPACITY */}
      <motion.div 
        animate={{
          x: [0, 120, 0],
          y: [0, -60, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-5%] left-[-5%] w-[70%] h-[70%] rounded-full bg-red-600/25 blur-[100px]" 
      />
      <motion.div 
        animate={{
          x: [0, -120, 0],
          y: [0, 60, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-5%] right-[-5%] w-[70%] h-[70%] rounded-full bg-red-800/20 blur-[100px]" 
      />
      <motion.div 
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute top-[20%] left-[10%] w-[40%] h-[40%] rounded-full bg-red-500/15 blur-[80px]" 
      />

      {/* Center Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-red-900/10 blur-[150px] rounded-full" />

      {/* Glassmorphism Overlay */}
      <div className="absolute inset-0 bg-white/[0.02] backdrop-blur-[1px]" />
    </div>
  );
};

export default BackgroundGlow;
