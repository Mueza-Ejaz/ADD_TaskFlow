import { Variants } from 'framer-motion';

export const fadeAnimation: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3, ease: 'easeInOut' },
};

export const slideAnimation: Variants = {
  initial: { x: -100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: 100, opacity: 0 },
  transition: { duration: 0.3, ease: 'easeInOut' },
};

export const scaleAnimation: Variants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.8, opacity: 0 },
  transition: { duration: 0.3, ease: 'easeInOut' },
};

// Add more complex animation variants here as needed.
// Easing from constitution: cubic-bezier(0.4, 0, 0.2, 1) can be defined if needed
// const customEase = [0.4, 0, 0.2, 1];
// For transition duration, constitution specifies 150ms, 300ms, 500ms
// This can be set dynamically in components or as separate variants.
