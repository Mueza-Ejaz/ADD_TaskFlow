import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, className }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={onClose}
          ></motion.div>

          {/* Modal Content */}
          <motion.div
            className={clsx(
              "relative flex flex-col w-full max-w-lg p-6 my-6 mx-auto bg-white rounded-lg shadow-lg dark:bg-gray-800",
              className
            )}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            {/* Header */}
            <div className="flex items-start justify-between pb-3 rounded-t">
              {title && <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>}
              <button
                className="p-1 ml-auto bg-transparent border-0 text-black dark:text-white float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={onClose}
              >
                <span className="bg-transparent text-black dark:text-white h-6 w-6 text-2xl block outline-none focus:outline-none">
                  ×
                </span>
              </button>
            </div>

            {/* Body */}
            <div className="relative flex-auto">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export { Modal };
