'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  FilePlus,
  ListTodo,
  Search,
  Edit3,
  Trash2,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

interface ToolCallStatusProps {
  name: string;
  status: 'call' | 'success' | 'error';
  result?: string | Record<string, any>;
}

export const ToolCallStatus: React.FC<ToolCallStatusProps> = ({
  name,
  status,
  result
}) => {
  const getStatusConfig = () => {
    const toolIcons: Record<string, React.ReactNode> = {
      'add_task': <FilePlus size={14} />,
      'list_tasks': <ListTodo size={14} />,
      'search_tasks': <Search size={14} />,
      'update_task': <Edit3 size={14} />,
      'delete_task': <Trash2 size={14} />,
    };

    const statusIcons = {
      call: <Loader2 className="animate-spin" size={14} />,
      success: <CheckCircle size={14} className="text-green-500" />,
      error: <AlertCircle size={14} className="text-red-500" />,
    };

    const statusTexts = {
      call: 'Processing...',
      success: 'Completed',
      error: 'Failed',
    };

    // Get the appropriate icon for the tool name
    const toolIcon = toolIcons[name] || toolIcons['add_task']; // Default to add_task icon

    // Get the status-specific icon
    const statusIcon = statusIcons[status];

    // Get the status text
    const statusText = statusTexts[status];

    return {
      toolIcon,
      statusIcon,
      statusText,
      bgColor: status === 'error' ? 'bg-red-900/10' : status === 'success' ? 'bg-white/5' : 'bg-white/5',
      borderColor: status === 'error' ? 'border-red-500/30' : status === 'success' ? 'border-white/10' : 'border-[#00FFD1]/20',
      textColor: status === 'error' ? 'text-red-400' : status === 'success' ? 'text-white/50' : 'text-[#00FFD1]/70',
    };
  };

  const { toolIcon, statusIcon, statusText, bgColor, borderColor, textColor } = getStatusConfig();

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className={cn(
        'flex flex-col gap-1 p-2 rounded-xl text-[10px] border transition-all duration-300',
        bgColor,
        borderColor
      )}
    >
      <div className="flex items-center gap-2">
        <div className={cn("flex items-center gap-1.5", textColor)}>
          {statusIcon}
          {toolIcon}
          <span className="font-semibold uppercase tracking-wider">
            {name.replace(/_/g, ' ')}
          </span>
        </div>
        <div className="h-1 w-1 rounded-full bg-white/20"></div>
        <span className={cn("font-medium", textColor)}>
          {statusText}
        </span>
      </div>
      
      {status === 'error' && result && (
        <div className="mt-1 pl-5 text-red-400/80 font-medium italic">
          {typeof result === 'string' ? result : (result.detail || JSON.stringify(result))}
        </div>
      )}
    </motion.div>
  );
};