import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number; // Duration in milliseconds, 0 for infinite
  onClose?: () => void;
  className?: string;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 3000,
  onClose,
  className,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) {
          onClose();
        }
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500',
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className={clsx(
            'fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg text-white max-w-sm',
            bgColor[type],
            className
          )}
        >
          <div className="flex items-center justify-between">
            <span>{message}</span>
            <button className="ml-4 text-white font-semibold" onClick={() => setIsVisible(false)}>
              ×
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export { Toast };
