'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Calendar, Edit2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import clsx from 'clsx';
import { motion } from 'framer-motion';

interface TaskRead {
  id: number;
  title: string;
  description?: string;
  priority?: number;
  due_date?: string;
  status: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

interface TaskCardProps extends TaskRead {
  onEditTask: (task: TaskRead) => void;
  onDeleteTask: (taskId: number) => void;
}

export const TaskCard: React.FC<TaskCardProps> = (props) => {
  const { id, title, description, priority, due_date, status, onEditTask, onDeleteTask } = props;
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getPriorityColor = (p?: number) => {
    switch (p) {
      case 1: return 'text-red-400 bg-red-500/25 border-red-500/40 shadow-[0_0_10px_rgba(239,68,68,0.2)]';
      case 2: return 'text-amber-400 bg-amber-500/25 border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.2)]';
      case 3: return 'text-[#00FFD1] bg-[#00FFD1]/25 border-[#00FFD1]/40 shadow-[0_0_10px_rgba(0,255,209,0.2)]';
      default: return 'text-white bg-white/10 border-white/20';
    }
  };

  const getPriorityLabel = (p?: number) => {
    switch (p) {
      case 1: return 'High Priority';
      case 2: return 'Medium Priority';
      case 3: return 'Low Priority';
      default: return 'No Priority';
    }
  };

  const formattedDate = due_date ? format(new Date(due_date), 'MMM d, yyyy HH:mm') : null;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      layoutId={String(id)}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -6, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
      onClick={() => onEditTask(props)}
      className={clsx(
        "group relative flex flex-col gap-4 rounded-2xl border-2 border-white/20 bg-white/[0.05] p-6 backdrop-blur-md transition-all hover:border-[#00FFD1]/50 shadow-2xl cursor-pointer active:cursor-grabbing",
        isDragging && "opacity-50 z-50 border-[#00FFD1] ring-4 ring-[#00FFD1]/20 shadow-[0_0_30px_rgba(0,255,209,0.3)]"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <h4 className="font-extrabold text-[18px] text-white leading-tight group-hover:text-[#00FFD1] transition-colors line-clamp-2 tracking-tight">
          {title}
        </h4>
        <div className="flex gap-2 shrink-0">
            <button 
                onClick={(e) => { e.stopPropagation(); onEditTask(props); }}
                className="p-2 rounded-xl bg-white/10 hover:bg-[#00FFD1] text-white hover:text-black transition-all shadow-md border border-white/10 hover:border-[#00FFD1] active:scale-90"
                title="Edit Task"
            >
                <Edit2 size={18} strokeWidth={2.5} />
            </button>
            <button 
                onClick={(e) => { e.stopPropagation(); onDeleteTask(id); }}
                className="p-2 rounded-xl bg-white/10 hover:bg-red-500 text-white hover:text-white transition-all shadow-md border border-white/10 hover:border-red-500 active:scale-90"
                title="Delete Task"
            >
                <Trash2 size={18} strokeWidth={2.5} />
            </button>
        </div>
      </div>

      {/* Description */}
      {description && (
        <p className="text-[14px] text-white/75 line-clamp-4 leading-relaxed font-semibold">
          {description}
        </p>
      )}

      {/* Footer */}
      <div className="mt-2 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div className={clsx(
          "px-4 py-1.5 rounded-xl text-[12px] font-black border tracking-wider uppercase shadow-sm",
          getPriorityColor(priority)
        )}>
          {getPriorityLabel(priority)}
        </div>

        {formattedDate && (
          <div className="flex items-center gap-2 text-[12px] font-bold text-white/80 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 shadow-md">
            <Calendar size={15} className="text-[#00FFD1]" />
            {formattedDate}
          </div>
        )}
      </div>

      {/* Status Bar Indicator - Thicker and more visible */}
      <div className={clsx(
          "absolute left-0 top-6 bottom-6 w-2 rounded-r-full transition-all duration-300 shadow-[2px_0_15px_rgba(0,0,0,0.4)]",
          status === 'pending' ? 'bg-white/40' : 
          status === 'in-progress' ? 'bg-[#00FFD1]' : 
          'bg-green-400'
      )} />
    </motion.div>
  );
};