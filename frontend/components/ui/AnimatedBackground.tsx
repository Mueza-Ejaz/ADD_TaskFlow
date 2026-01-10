'use client';

import { motion, useReducedMotion } from 'framer-motion';

export const AnimatedBackground = () => {
  const shouldReduceMotion = useReducedMotion();

  const animationProps = shouldReduceMotion ? {} : {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.2, 0.3, 0.2],
    },
    transition: {
      duration: 10,
      repeat: Infinity,
      repeatType: "reverse" as const,
    }
  };

  return (
    <div className="fixed inset-0 -z-10 h-full w-full bg-black overflow-hidden pointer-events-none">
      {/* Top Right Glow */}
      <motion.div
        {...animationProps}
        transition={{
          ...animationProps.transition,
          duration: 8,
        }}
        className="absolute -top-[10%] -right-[10%] h-[500px] w-[500px] rounded-full bg-teal-900/40 blur-[100px] will-change-transform"
      />

      {/* Bottom Left Glow */}
      <motion.div
        {...animationProps}
        transition={{
          ...animationProps.transition,
          duration: 10,
          delay: 1,
        }}
        className="absolute -bottom-[10%] -left-[10%] h-[500px] w-[500px] rounded-full bg-emerald-900/40 blur-[100px] will-change-transform"
      />
      
      {/* Subtle Mesh Overlay */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
    </div>
  );
};