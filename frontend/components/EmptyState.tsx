import React from 'react';

interface EmptyStateProps {
  message?: string;
  subMessage?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message = "No tasks yet!",
  subMessage = "Start by creating a new task to see it here.",
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-gray-500 bg-white rounded-lg shadow-md min-h-[200px]">
      <svg
        className="w-16 h-16 mb-4 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        ></path>
      </svg>
      <p className="text-xl font-semibold mb-2">{message}</p>
      <p className="text-md text-center">{subMessage}</p>
    </div>
  );
};
