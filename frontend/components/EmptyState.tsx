import React from 'react';
import { Button } from './ui/Button'; // Import Button component

interface EmptyStateProps {
  message?: string;
  subMessage?: string;
  onCreateTask?: () => void; // Optional function to handle task creation
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message = "No tasks yet!",
  subMessage = "Start by creating a new task to see it here.",
  onCreateTask,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-white/50 bg-white/5 border border-white/10 rounded-[2rem] shadow-xl min-h-[300px] backdrop-blur-md">
      <svg
        className="w-20 h-20 mb-6 text-white/20"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
        ></path>
      </svg>
      <p className="text-xl font-bold text-white mb-2">{message}</p>
      <p className="text-md text-center text-white/40 mb-6">{subMessage}</p>
      {onCreateTask && (
        <Button
          onClick={onCreateTask}
          className="bg-[#00FFD1] text-black hover:bg-[#00CCAA] font-bold px-8"
        >
          Create New Task
        </Button>
      )}
    </div>
  );
};
